import axios from "axios";
import { clearAuthToken, getAuthToken } from "@/lib/auth/token";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://dev.greenledgeresg.com/api/v1";

const defaultConfig = {
    baseURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

export const publicApi = axios.create(defaultConfig);

export const privateApi = axios.create(defaultConfig);

privateApi.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

privateApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                clearAuthToken();
                if (typeof window !== "undefined") {
                    window.location.replace("/login");
                }
            } else if (error.response?.status === 403) {
                const errorData = error.response.data as {
                    message?: string;
                    error?: { error_code?: string; detail?: string };
                };
                const errorCode = errorData?.error?.error_code;
                const message = errorData?.message || "You do not have permission to perform this action.";

                if (errorCode === "AUTH_PERMISSION_DENIED" && typeof window !== "undefined") {
                    console.warn(`[RBAC] Access denied: ${message}`);
                    window.dispatchEvent(
                        new CustomEvent("app:access-denied", {
                            detail: { message, detail: errorData?.error?.detail },
                        }),
                    );
                }
            }
        }
        return Promise.reject(error);
    },
);
