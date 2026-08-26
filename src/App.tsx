import { useEffect, useState, type ComponentType } from "react";
import { RouteContextProvider, navigateTo, useLocation } from "@/lib/navigation";
import { getPublicSiteContent as getStaticSiteContent } from "@/lib/static-content";
import {
  getAdminDashboardContent,
  getPublicSiteContent as fetchPublicSiteContent,
} from "@/lib/content.functions";
import type { AdminDashboardData, PublicSiteContent } from "@/lib/content.types";
import { Route as HomeRoute } from "@/routes/index";
import { Route as AboutRoute } from "@/routes/about";
import { Route as ToursRoute } from "@/routes/tours.index";
import { Route as TourDetailRoute } from "@/routes/tours.$slug";
import { Route as UpcomingRoute } from "@/routes/upcoming";
import { Route as GalleryRoute } from "@/routes/gallery";
import { Route as ShopRoute } from "@/routes/shop";
import { Route as BlogRoute } from "@/routes/blog.index";
import { Route as BlogDetailRoute } from "@/routes/blog.$slug";
import { Route as ContactRoute } from "@/routes/contact";
import { Route as GeneralFaqsRoute } from "@/routes/general-faqs";
import { Route as PrivacyPolicyRoute } from "@/routes/privacy-policy";
import { Route as TermsRoute } from "@/routes/terms-and-conditions";
import { Route as AdminLoginRoute } from "@/routes/admin.login";
import { Route as AdminRoute } from "@/routes/admin.index";
import { Layout } from "@/components/site/Layout";
import { Link } from "@/lib/navigation";

const staticPublicContent = getStaticSiteContent();

function getSearchObject(search: string) {
  return Object.fromEntries(new URLSearchParams(search));
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function renderRoute({
  component: Component,
  loaderData,
  params = {},
  search,
}: {
  component: ComponentType;
  loaderData: unknown;
  params?: Record<string, string>;
  search: Record<string, string>;
}) {
  return (
    <RouteContextProvider loaderData={loaderData} params={params} search={search}>
      <Component />
    </RouteContextProvider>
  );
}

export default function App() {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
  const search = getSearchObject(location.search);
  const [publicContent, setPublicContent] = useState<PublicSiteContent>(staticPublicContent);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (pathname === "/stories") {
      navigateTo("/blog", { replace: true });
    }
  }, [pathname]);

  useEffect(() => {
    const invalidate = () => setReloadKey((current) => current + 1);
    window.addEventListener("app:invalidate", invalidate);
    return () => window.removeEventListener("app:invalidate", invalidate);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchPublicSiteContent()
      .then((content) => {
        if (!cancelled) {
          setPublicContent(content);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPublicContent(staticPublicContent);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setContentLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (pathname !== "/admin") {
      return;
    }

    let cancelled = false;
    setAdminLoading(true);
    setAdminError("");

    getAdminDashboardContent()
      .then((data) => {
        if (!cancelled) {
          setAdminData(data);
        }
      })
      .catch((error) => {
        if (cancelled) return;

        if ((error as Error & { status?: number }).status === 401) {
          navigateTo("/admin/login", { replace: true });
          return;
        }

        setAdminError(error instanceof Error ? error.message : "Unable to load admin dashboard.");
      })
      .finally(() => {
        if (!cancelled) {
          setAdminLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, reloadKey]);

  if (pathname === "/") {
    return renderRoute({ component: HomeRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/about") {
    return renderRoute({ component: AboutRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/tours") {
    return renderRoute({ component: ToursRoute.component!, loaderData: publicContent, search });
  }

  if (pathname.startsWith("/tours/")) {
    const [, , slug, child] = pathname.split("/");
    const tour = publicContent.tours.find((item) => item.slug === slug);

    if (tour && child !== "share-image") {
      return renderRoute({
        component: TourDetailRoute.component!,
        loaderData: { tour, tours: publicContent.tours },
        params: { slug },
        search,
      });
    }

    if (!contentLoaded && child !== "share-image") {
      return <LoadingScreen label="Loading tour" />;
    }
  }

  if (pathname === "/upcoming") {
    return renderRoute({ component: UpcomingRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/gallery") {
    return renderRoute({ component: GalleryRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/shop") {
    return renderRoute({ component: ShopRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/blog") {
    return renderRoute({ component: BlogRoute.component!, loaderData: publicContent, search });
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.split("/")[2] || "";
    const post = publicContent.blogPosts.find((item) => item.slug === slug);

    if (post) {
      return renderRoute({
        component: BlogDetailRoute.component!,
        loaderData: {
          post,
          recentPosts: publicContent.blogPosts.filter((item) => item.slug !== slug).slice(0, 3),
        },
        params: { slug },
        search,
      });
    }

    if (!contentLoaded) {
      return <LoadingScreen label="Loading blog post" />;
    }
  }

  if (pathname === "/contact") {
    return renderRoute({ component: ContactRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/general-faqs") {
    return renderRoute({ component: GeneralFaqsRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/privacy-policy") {
    return renderRoute({ component: PrivacyPolicyRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/terms-and-conditions") {
    return renderRoute({ component: TermsRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/admin/login") {
    return renderRoute({ component: AdminLoginRoute.component!, loaderData: publicContent, search });
  }

  if (pathname === "/admin") {
    if (!adminData && !adminError) {
      return <LoadingScreen label="Loading admin dashboard" />;
    }

    if (adminError) {
      return (
        <Layout>
          <section className="container-prose py-32 text-center">
            <p className="section-eyebrow">Admin</p>
            <h1 className="mt-3 font-serif text-4xl text-primary">Unable to load dashboard</h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{adminError}</p>
          </section>
        </Layout>
      );
    }

    return renderRoute({
      component: AdminRoute.component!,
      loaderData: adminData ?? {
        ...publicContent,
        admin: { id: 0, username: "admin", displayName: "Administrator" },
      },
      search,
    });
  }

  return (
    <Layout>
      <section className="container-prose py-32 text-center">
        <p className="section-eyebrow">404</p>
        <h1 className="mt-3 font-serif text-4xl text-primary">Page not found</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          The page you opened is not available on this React version of the site.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
        >
          Back to Home
        </Link>
      </section>
    </Layout>
  );
}

function LoadingScreen({ label }: { label: string }) {
  return (
    <Layout>
      <section className="container-prose py-32 text-center">
        <p className="section-eyebrow">{label}</p>
        <h1 className="mt-3 font-serif text-4xl text-primary">Please wait</h1>
      </section>
    </Layout>
  );
}
