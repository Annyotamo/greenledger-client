import { privateApi } from "@/lib/http/client";
import type {
    BrsrEnergyConsumptionResponse,
    BrsrEnergyConsumptionData,
    BrsrWaterDisclosurePayload,
    BrsrWaterDisclosureData,
    BrsrWaterDisclosureResponse,
    BrsrWasteDisclosurePayload,
    BrsrWasteDisclosureData,
    BrsrWasteDisclosureResponse,
} from "./types";

export async function getBrsrEnergyConsumption(payload: {
    start_date: string;
    end_date: string;
    turnover_inr: number;
    ppp_conversion_factor?: number;
    physical_output?: number | null;
    physical_output_unit?: string | null;
}): Promise<BrsrEnergyConsumptionData> {
    const response = await privateApi.post<BrsrEnergyConsumptionResponse>("/tenant/brsr/energy-consumption", payload);
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to fetch energy consumption data.");
    }
    return response.data.data;
}

export async function getBrsrEnergyReport(payload: {
    start_date: string;
    end_date: string;
    turnover_inr: number;
    ppp_conversion_factor?: number;
    physical_output?: number | null;
    physical_output_unit?: string | null;
}): Promise<Blob> {
    const response = await privateApi.post("/tenant/brsr/energy-consumption/report", payload, {
        responseType: "blob",
    });
    return response.data as Blob;
}

export async function postBrsrWaterDisclosure(
    payload: BrsrWaterDisclosurePayload,
): Promise<BrsrWaterDisclosureData> {
    const response = await privateApi.post<BrsrWaterDisclosureResponse>(
        "/tenant/brsr/water-disclosure",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save water disclosure data.");
    }
    return response.data.data;
}

export async function postBrsrWaterReport(
    payload: BrsrWaterDisclosurePayload,
): Promise<Blob> {
    const response = await privateApi.post(
        "/tenant/brsr/water-disclosure/report",
        payload,
        {
            responseType: "blob",
        },
    );
    return response.data as Blob;
}

export async function postBrsrWasteDisclosure(
    payload: BrsrWasteDisclosurePayload,
): Promise<BrsrWasteDisclosureData> {
    const response = await privateApi.post<BrsrWasteDisclosureResponse>(
        "/tenant/brsr/waste",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save waste disclosure data.");
    }
    return response.data.data;
}

export async function postBrsrWasteReport(
    payload: BrsrWasteDisclosurePayload,
): Promise<Blob> {
    const response = await privateApi.post(
        "/tenant/brsr/waste/report",
        payload,
        {
            responseType: "blob",
        },
    );
    return response.data as Blob;
}
