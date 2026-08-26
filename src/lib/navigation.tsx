import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ComponentType,
  type ReactNode,
} from "react";

type RouteContextValue = {
  loaderData: unknown;
  params: Record<string, string>;
  search: Record<string, string>;
};

type LinkSearchValue = string | number | boolean | null | undefined;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  params?: Record<string, string | number>;
  search?: Record<string, LinkSearchValue>;
  activeOptions?: { exact?: boolean };
  activeProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  inactiveProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
};

type RouteConfig = {
  component?: ComponentType;
  notFoundComponent?: ComponentType;
  errorComponent?: ComponentType<any>;
  loader?: (args: { params: Record<string, string>; search: Record<string, string> }) => unknown;
  beforeLoad?: () => unknown;
  head?: (args?: any) => unknown;
  headers?: () => unknown;
  validateSearch?: (search: Record<string, unknown>) => unknown;
};

type LoaderData<T extends RouteConfig> = T extends {
  loader: (args: { params: Record<string, string>; search: Record<string, string> }) => infer TResult;
}
  ? Awaited<TResult>
  : any;

type SearchData<T extends RouteConfig> = T extends {
  validateSearch: (search: Record<string, unknown>) => infer TResult;
}
  ? TResult
  : Record<string, string>;

const RouteContext = createContext<RouteContextValue>({
  loaderData: undefined,
  params: {},
  search: {},
});

function getBrowserLocation() {
  if (typeof window === "undefined") {
    return {
      href: "/",
      pathname: "/",
      search: "",
      hash: "",
    };
  }

  return {
    href: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
}

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function buildHref(to: string, params?: LinkProps["params"], search?: LinkProps["search"]) {
  let path = to || "/";

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(new RegExp(`\\$${key}\\b`, "g"), encodeURIComponent(String(value)));
    }
  }

  if (!search || !Object.keys(search).length) {
    return path;
  }

  const [basePath, existingQuery = ""] = path.split("?");
  const searchParams = new URLSearchParams(existingQuery);

  for (const [key, value] of Object.entries(search)) {
    if (value === undefined || value === null || value === "" || value === false) {
      searchParams.delete(key);
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function navigateTo(href: string, options?: { replace?: boolean }) {
  if (typeof window === "undefined") return;

  const url = new URL(href, window.location.origin);
  const nextHref = `${url.pathname}${url.search}${url.hash}`;

  if (nextHref === `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    return;
  }

  if (options?.replace) {
    window.history.replaceState(null, "", nextHref);
  } else {
    window.history.pushState(null, "", nextHref);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "auto" });
}

export function useLocation<T = ReturnType<typeof getBrowserLocation>>(options?: {
  select?: (location: ReturnType<typeof getBrowserLocation>) => T;
}) {
  const [location, setLocation] = useState(getBrowserLocation);

  useEffect(() => {
    const updateLocation = () => setLocation(getBrowserLocation());
    window.addEventListener("popstate", updateLocation);
    return () => window.removeEventListener("popstate", updateLocation);
  }, []);

  return useMemo(
    () => (options?.select ? options.select(location) : (location as T)),
    [location, options],
  );
}

export function Link({
  to,
  params,
  search,
  activeOptions,
  activeProps,
  inactiveProps,
  className,
  onClick,
  target,
  ...props
}: LinkProps) {
  const location = useLocation();
  const href = buildHref(to, params, search);
  const targetPath = normalizePath(href.split("?")[0] || "/");
  const currentPath = normalizePath(location.pathname);
  const isActive = activeOptions?.exact
    ? currentPath === targetPath
    : currentPath === targetPath || (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));
  const stateProps = isActive ? activeProps : inactiveProps;
  const combinedClassName = [className, stateProps?.className].filter(Boolean).join(" ") || undefined;

  return (
    <a
      {...props}
      {...stateProps}
      href={href}
      target={target}
      className={combinedClassName}
      onClick={(event) => {
        stateProps?.onClick?.(event);
        onClick?.(event);

        if (
          event.defaultPrevented ||
          target ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey
        ) {
          return;
        }

        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          return;
        }

        event.preventDefault();
        navigateTo(`${url.pathname}${url.search}${url.hash}`);
      }}
    />
  );
}

export function RouteContextProvider({
  children,
  loaderData,
  params,
  search,
}: RouteContextValue & { children: ReactNode }) {
  return (
    <RouteContext.Provider value={{ loaderData, params, search }}>
      {children}
    </RouteContext.Provider>
  );
}

export function createFileRoute(_path: string) {
  return function defineRoute<T extends RouteConfig>(config: T) {
    return {
      ...config,
      useLoaderData: () => useContext(RouteContext).loaderData as LoaderData<T>,
      useSearch: () => useContext(RouteContext).search as SearchData<T>,
      useParams: <TParams = any,>() => useContext(RouteContext).params as TParams,
    };
  };
}

export function useNavigate() {
  return async (options: string | { to: string; params?: LinkProps["params"]; search?: LinkProps["search"]; replace?: boolean }) => {
    if (typeof options === "string") {
      navigateTo(options);
      return;
    }

    navigateTo(buildHref(options.to, options.params, options.search), { replace: options.replace });
  };
}

export function useRouter() {
  const location = useLocation();

  return {
    state: { location },
    invalidate: async () => {},
    navigate: useNavigate(),
  };
}

export function notFound() {
  return Object.assign(new Error("Not found"), { status: 404 });
}

export function redirect(options: { to: string; search?: LinkProps["search"] }) {
  return Object.assign(new Error("Redirect"), {
    redirectTo: buildHref(options.to, undefined, options.search),
  });
}
