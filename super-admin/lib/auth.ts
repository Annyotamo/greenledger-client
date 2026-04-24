export const SUPER_ADMIN_AUTH_COOKIE = "gl_super_admin";

export type SuperAdminSession = {
  token: string;
};

export function extractToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const candidate =
    d.token ??
    d.accessToken ??
    d.jwt ??
    (typeof d.data === "string"
      ? d.data
      : typeof d.data === "object" && d.data
        ? (d.data as Record<string, unknown>).token
        : undefined);
  return typeof candidate === "string" && candidate.length > 0 ? candidate : null;
}

