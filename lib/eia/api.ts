import { privateApi } from "@/lib/http/client";
import type {
    EIAApiResponse,
    EIAStackPresetsData,
    EIAAirEmissionsPayload,
    EIAAirEmissionsComputedData,
} from "./types";

/**
 * 7.2 GET EIA STACK PRESETS & ATTACHED UNITS
 * Returns industrial presets: Sponge iron/DRI, Steel melting, Ferro alloy, Blast furnace, etc.
 */
export async function getEiaAirPresets(): Promise<EIAStackPresetsData> {
    const response = await privateApi.get<EIAApiResponse<EIAStackPresetsData>>(
        "/tenant/eia/air-emissions/presets",
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to fetch EIA stack presets.");
    }
    return response.data.data;
}

/**
 * 7.3 POST COMPUTE EIA STACK METRICS (ON-THE-FLY MATH PREVIEW)
 * Computes hourly emission rates, annual totals, and limit exceedances on the fly.
 */
export async function computeEiaAirMetrics(
    payload: EIAAirEmissionsPayload,
): Promise<EIAAirEmissionsComputedData> {
    const response = await privateApi.post<EIAApiResponse<EIAAirEmissionsComputedData>>(
        "/tenant/eia/air-emissions/compute",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to compute EIA air emission metrics.");
    }
    return response.data.data;
}

/**
 * 7.4 GET SAVED EIA AIR DISCLOSURE
 * Retrieves saved EIA disclosure record by reporting period and optional facility.
 */
export async function getEiaAirDisclosure(
    reportingPeriodId: string,
    facilityId?: string | null,
): Promise<EIAAirEmissionsComputedData | null> {
    if (!reportingPeriodId) return null;
    let url = `/tenant/eia/air-emissions?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`;
    if (facilityId) {
        url += `&facility_id=${encodeURIComponent(facilityId)}`;
    }

    try {
        const response = await privateApi.get<EIAApiResponse<EIAAirEmissionsComputedData | null>>(url);
        return response.data?.data ?? null;
    } catch {
        return null;
    }
}

/**
 * 7.5 PUT SAVE / UPSERT EIA AIR DISCLOSURE
 * Saves and updates the operational stack air emissions record.
 */
export async function saveEiaAirDisclosure(
    payload: EIAAirEmissionsPayload,
): Promise<EIAAirEmissionsComputedData> {
    const response = await privateApi.put<EIAApiResponse<EIAAirEmissionsComputedData>>(
        "/tenant/eia/air-emissions",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save EIA air emissions disclosure.");
    }
    return response.data.data;
}

/**
 * 7.6 POST EXCEL EXPORT FOR EIA AIR EMISSIONS
 * Generates and downloads multi-sheet Excel workbook (Plant Summary & Stack Summary).
 */
export async function exportEiaAirExcel(
    payload: EIAAirEmissionsPayload,
): Promise<Blob> {
    const response = await privateApi.post(
        "/tenant/eia/air-emissions/export/excel",
        payload,
        {
            responseType: "blob",
        },
    );
    return response.data as Blob;
}
