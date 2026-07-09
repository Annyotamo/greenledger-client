import { AxiosError } from "axios";

/**
 * Extracts a user-friendly error message from any error object,
 * specifically handling Axios response bodies from the API server.
 */
export function getErrorMessage(err: unknown, defaultMessage = "An unexpected error occurred. Please try again."): string {
    if (err && typeof err === "object") {
        const axiosErr = err as AxiosError<any>;
        // Check if it is an Axios error and has a response body
        if (axiosErr.isAxiosError && axiosErr.response?.data) {
            const data = axiosErr.response.data;
            if (data && typeof data === "object") {
                return data.message || data.response || data.detail || defaultMessage;
            }
        }
    }
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === "string") {
        return err;
    }
    return defaultMessage;
}
