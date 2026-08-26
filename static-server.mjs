import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "dist");
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

function resolveRequestPath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname.split("?")[0] || "/");
  const requestedPath = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return join(rootDir, requestedPath === "/" ? "index.html" : requestedPath);
}

async function getFilePath(urlPathname) {
  const requestedFile = resolveRequestPath(urlPathname);

  try {
    const info = await stat(requestedFile);
    if (info.isFile()) {
      return requestedFile;
    }
  } catch {
    // The React app handles client-side routes from index.html.
  }

  return join(rootDir, "index.html");
}

createServer(async (request, response) => {
  try {
    const filePath = await getFilePath(request.url || "/");
    const contentType = contentTypes.get(extname(filePath).toLowerCase()) || "application/octet-stream";

    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Server error");
  }
}).listen(port, host, async () => {
  await readFile(join(rootDir, "index.html"));
  console.log(`Paranjape Tours running at http://${host}:${port}`);
});
