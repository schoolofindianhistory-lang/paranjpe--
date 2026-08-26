import "./load-env";
import { createHash, randomBytes } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  deleteBlogPostById,
  deleteCategoryById,
  deleteGalleryItemById,
  deleteShopItemById,
  deleteTeamMemberById,
  deleteTestimonialById,
  deleteTourById,
  fetchAdminDashboardData,
  fetchPublicSiteContent,
  hideLegacyContent,
  submitPublicContactEnquiry,
  upsertBlogPost,
  upsertCategory,
  upsertGalleryItem,
  upsertHeroSection,
  upsertShopItem,
  upsertTeamMember,
  upsertTestimonial,
  upsertTour,
} from "@/lib/content.server";
import { getPool, verifyStoredPassword } from "@/lib/db.server";
import type { AdminUser } from "@/lib/content.types";

const ADMIN_COOKIE_NAME = "paranjpe_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const MAX_JSON_BYTES = 25 * 1024 * 1024;
const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distRoot = resolve(projectRoot, "dist");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
]);

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function toAdminUser(row: any): AdminUser {
  return {
    id: Number(row.id),
    username: String(row.username),
    displayName: String(row.display_name),
  };
}

function parseCookies(request: IncomingMessage) {
  const cookies = new Map<string, string>();
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return cookies;
  }

  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (!name) continue;
    cookies.set(name, decodeURIComponent(valueParts.join("=")));
  }

  return cookies;
}

function isSecureRequest(request: IncomingMessage) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "");
  return forwardedProto.split(",")[0]?.trim() === "https" || Boolean((request.socket as any).encrypted);
}

function buildCookie(value: string, request: IncomingMessage, maxAge = SESSION_DURATION_SECONDS) {
  const parts = [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (isSecureRequest(request)) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function clearAdminCookie(response: ServerResponse, request: IncomingMessage) {
  response.setHeader("Set-Cookie", buildCookie("", request, 0));
}

async function getCurrentAdmin(request: IncomingMessage, response?: ServerResponse) {
  const token = parseCookies(request).get(ADMIN_COOKIE_NAME);

  if (!token) {
    return null;
  }

  const pool = await getPool();
  const [rows] = await pool.execute<any[]>(
    `
      SELECT admins.id, admins.username, admins.display_name
      FROM admin_sessions
      INNER JOIN admins ON admins.id = admin_sessions.admin_id
      WHERE admin_sessions.token_hash = ? AND admin_sessions.expires_at > NOW()
      LIMIT 1
    `,
    [hashToken(token)],
  );

  if (!rows.length) {
    if (response) {
      clearAdminCookie(response, request);
    }
    return null;
  }

  return toAdminUser(rows[0]);
}

async function loginWithCredentials(request: IncomingMessage, response: ServerResponse, body: any) {
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");

  if (!username || !password) {
    throw Object.assign(new Error("Username and password are required."), { status: 400 });
  }

  const pool = await getPool();
  const [rows] = await pool.execute<any[]>(
    "SELECT id, username, display_name, password_hash FROM admins WHERE username = ? LIMIT 1",
    [username],
  );

  const adminRow = rows[0];
  if (!adminRow || !verifyStoredPassword(password, String(adminRow.password_hash))) {
    throw Object.assign(new Error("Invalid username or password."), { status: 401 });
  }

  const token = randomBytes(32).toString("hex");
  await pool.execute("DELETE FROM admin_sessions WHERE admin_id = ?", [adminRow.id]);
  await pool.execute(
    "INSERT INTO admin_sessions (admin_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))",
    [adminRow.id, hashToken(token), SESSION_DURATION_SECONDS],
  );

  response.setHeader("Set-Cookie", buildCookie(token, request));
  return toAdminUser(adminRow);
}

async function logoutCurrentAdmin(request: IncomingMessage, response: ServerResponse) {
  const token = parseCookies(request).get(ADMIN_COOKIE_NAME);
  const pool = await getPool();

  if (token) {
    await pool.execute("DELETE FROM admin_sessions WHERE token_hash = ?", [hashToken(token)]);
  }

  clearAdminCookie(response, request);
}

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.byteLength;

    if (totalBytes > MAX_JSON_BYTES) {
      throw Object.assign(new Error("Request body is too large."), { status: 413 });
    }

    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  return rawBody ? JSON.parse(rawBody) : {};
}

async function requireAdmin(request: IncomingMessage, response: ServerResponse) {
  const admin = await getCurrentAdmin(request, response);
  if (!admin) {
    throw Object.assign(new Error("You must be logged in as admin."), { status: 401 });
  }

  return admin;
}

async function handleAdminPost(
  request: IncomingMessage,
  response: ServerResponse,
  handler: (body: any) => Promise<unknown>,
) {
  await requireAdmin(request, response);
  const body = await readJsonBody(request);
  await handler(body);
  sendJson(response, 200, { success: true });
}

async function handleApiRequest(request: IncomingMessage, response: ServerResponse, pathname: string) {
  try {
    if (request.method === "GET" && pathname === "/api/content") {
      sendJson(response, 200, await fetchPublicSiteContent());
      return true;
    }

    if (request.method === "POST" && pathname === "/api/contact-enquiries") {
      const body = await readJsonBody(request);
      sendJson(response, 200, await submitPublicContactEnquiry(body));
      return true;
    }

    if (request.method === "GET" && pathname === "/api/admin/session") {
      const admin = await getCurrentAdmin(request, response);
      sendJson(response, 200, { authenticated: Boolean(admin), admin });
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/login") {
      const body = await readJsonBody(request);
      sendJson(response, 200, await loginWithCredentials(request, response, body));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/logout") {
      await logoutCurrentAdmin(request, response);
      sendJson(response, 200, { success: true });
      return true;
    }

    if (request.method === "GET" && pathname === "/api/admin/dashboard") {
      const admin = await requireAdmin(request, response);
      sendJson(response, 200, await fetchAdminDashboardData(admin));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/categories") {
      await handleAdminPost(request, response, upsertCategory);
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/categories/delete") {
      await handleAdminPost(request, response, (body) => deleteCategoryById(Number(body.id)));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/tours") {
      await handleAdminPost(request, response, upsertTour);
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/tours/delete") {
      await handleAdminPost(request, response, (body) => deleteTourById(Number(body.id)));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/hero") {
      await handleAdminPost(request, response, upsertHeroSection);
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/testimonials") {
      await handleAdminPost(request, response, upsertTestimonial);
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/testimonials/delete") {
      await handleAdminPost(request, response, (body) => deleteTestimonialById(Number(body.id)));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/team-members") {
      await handleAdminPost(request, response, upsertTeamMember);
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/team-members/delete") {
      await handleAdminPost(request, response, (body) => deleteTeamMemberById(Number(body.id)));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/shop-items") {
      await handleAdminPost(request, response, upsertShopItem);
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/shop-items/delete") {
      await handleAdminPost(request, response, (body) => deleteShopItemById(Number(body.id)));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/gallery-items") {
      await handleAdminPost(request, response, upsertGalleryItem);
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/gallery-items/delete") {
      await handleAdminPost(request, response, (body) => deleteGalleryItemById(Number(body.id)));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/blog-posts") {
      await handleAdminPost(request, response, upsertBlogPost);
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/blog-posts/delete") {
      await handleAdminPost(request, response, (body) => deleteBlogPostById(Number(body.id)));
      return true;
    }

    if (request.method === "POST" && pathname === "/api/admin/legacy-content/delete") {
      await handleAdminPost(request, response, hideLegacyContent);
      return true;
    }
  } catch (error) {
    const status = Number((error as Error & { status?: number }).status || 500);
    sendJson(response, status, {
      success: false,
      message: error instanceof Error ? error.message : "Server error.",
    });
    return true;
  }

  return false;
}

function resolveStaticRequestPath(urlPathname: string) {
  const decoded = decodeURIComponent(urlPathname.split("?")[0] || "/");
  const requestedPath = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return join(distRoot, requestedPath === "/" ? "index.html" : requestedPath);
}

async function getStaticFilePath(urlPathname: string) {
  const requestedFile = resolveStaticRequestPath(urlPathname);

  try {
    const info = await stat(requestedFile);
    if (info.isFile()) {
      return requestedFile;
    }
  } catch {
    // React handles client-side routes from index.html.
  }

  return join(distRoot, "index.html");
}

async function serveStatic(request: IncomingMessage, response: ServerResponse) {
  const filePath = await getStaticFilePath(request.url || "/");
  const contentType = contentTypes.get(extname(filePath).toLowerCase()) || "application/octet-stream";

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable",
  });
  createReadStream(filePath).pipe(response);
}

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/api/")) {
    const handled = await handleApiRequest(request, response, url.pathname);
    if (!handled) {
      sendJson(response, 404, { success: false, message: "API route not found." });
    }
    return;
  }

  try {
    await serveStatic(request, response);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Server error");
  }
}).listen(port, host, async () => {
  await readFile(join(distRoot, "index.html"));
  console.log(`Paranjape Tours running at http://${host}:${port}`);
});
