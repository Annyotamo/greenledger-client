/**
 * Helper to get a cookie value by name on the client side.
 */
export function getCookie(name: string): string | null {
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

/**
 * Helper to set a cookie with a specified max-age (in seconds) on the client side.
 */
export function setCookie(name: string, value: string, maxAgeInSeconds: number): void {
    if (typeof window === "undefined") return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeInSeconds}; SameSite=Lax${secure}`;
}

/**
 * Helper to delete a cookie by setting its max-age to 0.
 */
export function deleteCookie(name: string): void {
    if (typeof window === "undefined") return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}
