import axios from "axios";
import { getAuthToken } from "@/lib/auth/token";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseURL) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined.");
}

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
