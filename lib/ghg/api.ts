import { privateApi } from "@/lib/http/client";

export async function getScope1Report(startDate: string, endDate: string) {
    const response = await privateApi.get("/tenant/ghg/scope-1/report", {
        params: { start_date: startDate, end_date: endDate },
        responseType: "blob",
    });
    return response.data as Blob;
}
