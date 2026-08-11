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
    BrsrAirDisclosurePayload,
    BrsrAirDisclosureData,
    BrsrAirDisclosureResponse,
} from "./types";

export type BrsrEnergyConsumptionPayload = {
    start_date: string;
    end_date: string;
    turnover_inr: number;
    ppp_conversion_factor?: number;
    physical_output?: number | null;
    physical_output_tonnes?: number | null;
    physical_output_unit?: string | null;
};

export async function getBrsrEnergyConsumption(
    payload: BrsrEnergyConsumptionPayload
): Promise<BrsrEnergyConsumptionData> {
    const body = {
        ...payload,
        physical_output: payload.physical_output ?? payload.physical_output_tonnes ?? null,
        physical_output_tonnes: payload.physical_output_tonnes ?? payload.physical_output ?? null,
    };
    const response = await privateApi.post<BrsrEnergyConsumptionResponse>("/tenant/brsr/energy-consumption", body);
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to fetch energy consumption data.");
    }
    return response.data.data;
}

export async function getBrsrEnergyReport(
    payload: BrsrEnergyConsumptionPayload
): Promise<Blob> {
    const body = {
        ...payload,
        physical_output: payload.physical_output ?? payload.physical_output_tonnes ?? null,
        physical_output_tonnes: payload.physical_output_tonnes ?? payload.physical_output ?? null,
    };
    const response = await privateApi.post("/tenant/brsr/energy-consumption/report", body, {
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

export async function postBrsrAirDisclosure(
    payload: BrsrAirDisclosurePayload,
): Promise<BrsrAirDisclosureData> {
    const response = await privateApi.post<BrsrAirDisclosureResponse>(
        "/tenant/brsr/air",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save air disclosure data.");
    }
    return response.data.data;
}

export async function postBrsrAirReport(
    payload: BrsrAirDisclosurePayload,
): Promise<Blob> {
    const response = await privateApi.post(
        "/tenant/brsr/air/report",
        payload,
        {
            responseType: "blob",
        },
    );
    return response.data as Blob;
}
