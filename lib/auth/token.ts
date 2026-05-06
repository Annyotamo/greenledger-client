import { AUTH_COOKIE_NAME, AUTH_STORAGE_KEY } from "@/lib/auth/constants";

function readCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const parts = document.cookie.split(";").map((p) => p.trim());
    for (const part of parts) {
        if (!part) continue;
        const eq = part.indexOf("=");
        if (eq === -1) continue;
        const k = part.slice(0, eq).trim();
        if (k !== name) continue;
        const v = part.slice(eq + 1);
        try {
            return decodeURIComponent(v);
        } catch {
            return v;
        }
    }
    return null;
}

export function setAuthToken(token: string): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(AUTH_STORAGE_KEY, token);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=86400; SameSite=Lax${secure}`;
}

export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    const fromStorage = localStorage.getItem(AUTH_STORAGE_KEY);
    if (fromStorage) return fromStorage;
    return readCookie(AUTH_COOKIE_NAME);
}

export function clearAuthToken(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(AUTH_STORAGE_KEY);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
