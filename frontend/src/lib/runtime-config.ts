const DEFAULT_API_ORIGIN = "http://localhost:8083";
const DEFAULT_SITE_ORIGIN = "http://localhost:3000";

function trimTrailingSlash(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export function getServerApiOrigin(env: Record<string, string | undefined> = process.env): string {
  return trimTrailingSlash(
    env.INTERNAL_API_URL ||
      env.NEXT_PUBLIC_API_URL ||
      DEFAULT_API_ORIGIN,
  );
}

export function getPublicApiV1(env: Record<string, string | undefined> = process.env): string {
  return `${getServerApiOrigin(env)}/api/v1`;
}

export function getClientApiOrigin(env: Record<string, string | undefined> = process.env): string {
  const value = env.NEXT_PUBLIC_API_URL;
  return value ? trimTrailingSlash(value) : "";
}

export function getPublicSiteOrigin(env: Record<string, string | undefined> = process.env): string {
  return trimTrailingSlash(env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN);
}

export function absoluteSiteUrl(path: string, env: Record<string, string | undefined> = process.env): string {
  const origin = getPublicSiteOrigin(env);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}
