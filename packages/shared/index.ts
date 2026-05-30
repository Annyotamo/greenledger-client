// packages/shared/index.ts

const RAW_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://dev.greenledgeresg.com/api/v1";
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");
console.log("API_BASE_URL", API_BASE_URL);
export const buildUrl = (path: string) => {
    if (/^https?:\/\//i.test(path)) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalized}`;
};
