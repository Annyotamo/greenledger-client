import { AUTH_COOKIE_NAME, AUTH_STORAGE_KEY } from "@/lib/auth/constants";

export function setAuthToken(token: string): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(AUTH_STORAGE_KEY, token);
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=86400; SameSite=Lax`;
}

export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_STORAGE_KEY);
}

export function clearAuthToken(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
