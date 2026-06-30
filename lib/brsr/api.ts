import { privateApi } from "@/lib/http/client";
import type { BrsrEnergyConsumptionResponse, BrsrEnergyConsumptionData } from "./types";

export async function getBrsrEnergyConsumption(
    startDate?: string | null,
    endDate?: string | null,
    turnoverInr?: number | null,
): Promise<BrsrEnergyConsumptionData> {
    const params: Record<string, string | number> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (turnoverInr !== undefined && turnoverInr !== null) params.turnover_inr = turnoverInr;

    const response = await privateApi.get<BrsrEnergyConsumptionResponse>("/tenant/brsr/energy-consumption", {
        params,
    });
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to fetch energy consumption data.");
    }
    return response.data.data;
}

export async function getBrsrEnergyReport(
    startDate: string,
    endDate: string,
    turnoverInr: number,
): Promise<Blob> {
    const response = await privateApi.get("/tenant/brsr/energy-consumption/report", {
        params: {
            start_date: startDate,
            end_date: endDate,
            turnover_inr: turnoverInr,
        },
        responseType: "blob",
    });
    return response.data as Blob;
}
