import type { AuthUser } from "@/types/auth";

const AUTH_USER_STORAGE_KEY = "auth_user";

export function setAuthUser(user: AuthUser): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export function clearAuthUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

