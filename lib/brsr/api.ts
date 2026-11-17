import { privateApi } from "@/lib/http/client";
import type {
    APIResponse,
    BRSRSectionAData,
    BRSRSectionAResponse,
    BRSRSectionBData,
    BRSRSectionBResponse,
    BRSRSectionCData,
    BRSRSectionCResponse,
    BRSRStatutoryDisclosureData,
    BRSRStatutoryDisclosureResponse,
    BRSRConsolidatedDashboardData,
    BRSRConsolidatedDashboardResponse,
    BRSRWaterDisclosureSaveInput,
    BRSRWaterDisclosureData,
    BRSRWaterDisclosureResponse,
    BRSRWasteDisclosureSaveInput,
    BRSRWasteDisclosureData,
    BRSRWasteDisclosureResponse,
    BRSRAirDisclosureSaveInput,
    BRSRAirDisclosureData,
    BRSRAirDisclosureResponse,
    BrsrAirStackPresetsData,
    BrsrAirStackPresetsResponse,
    BrsrEnergyConsumptionData,
    BrsrEnergyConsumptionResponse,
} from "./types";

// ==========================================
// CONSOLIDATED DASHBOARD
// ==========================================

export async function getBrsrConsolidatedDashboard(
    reportingPeriodId: string,
): Promise<BRSRConsolidatedDashboardData | null> {
    if (!reportingPeriodId) return null;
    try {
        const response = await privateApi.get<BRSRConsolidatedDashboardResponse>(
            `/tenant/brsr/consolidated/dashboard?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
        );
        return response.data?.data ?? null;
    } catch {
        return null;
    }
}

// ==========================================
// SECTION A: GENERAL DISCLOSURES
// ==========================================

export async function getBrsrSectionA(
    reportingPeriodId: string,
): Promise<BRSRSectionAData | null> {
    if (!reportingPeriodId) return null;
    const response = await privateApi.get<BRSRSectionAResponse>(
        `/tenant/brsr/section-a?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
    );
    return response.data?.data ?? null;
}

export async function saveBrsrSectionA(
    payload: BRSRSectionAData,
): Promise<BRSRSectionAData> {
    const response = await privateApi.put<BRSRSectionAResponse>(
        "/tenant/brsr/section-a",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save Section A disclosure.");
    }
    return response.data.data;
}

// ==========================================
// SECTION B: MANAGEMENT & PROCESS
// ==========================================

export async function getBrsrSectionB(
    reportingPeriodId: string,
): Promise<BRSRSectionBData | null> {
    if (!reportingPeriodId) return null;
    const response = await privateApi.get<BRSRSectionBResponse>(
        `/tenant/brsr/section-b?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
    );
    return response.data?.data ?? null;
}

export async function saveBrsrSectionB(
    payload: BRSRSectionBData,
): Promise<BRSRSectionBData> {
    const response = await privateApi.put<BRSRSectionBResponse>(
        "/tenant/brsr/section-b",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save Section B disclosure.");
    }
    return response.data.data;
}

// ==========================================
// SECTION C: SOCIAL & GOVERNANCE PRINCIPLES
// ==========================================

export async function getBrsrSectionC(
    reportingPeriodId: string,
): Promise<BRSRSectionCData | null> {
    if (!reportingPeriodId) return null;
    const response = await privateApi.get<BRSRSectionCResponse>(
        `/tenant/brsr/section-c?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
    );
    return response.data?.data ?? null;
}

export async function saveBrsrSectionC(
    payload: BRSRSectionCData,
): Promise<BRSRSectionCData> {
    const response = await privateApi.put<BRSRSectionCResponse>(
        "/tenant/brsr/section-c",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save Section C disclosures.");
    }
    return response.data.data;
}

// ==========================================
// PRINCIPLE 6: STATUTORY DISCLOSURES (PAT, ZLD, Sensitive Areas, EIA)
// ==========================================

export async function getBrsrStatutoryDisclosure(
    reportingPeriodId: string,
): Promise<BRSRStatutoryDisclosureData | null> {
    if (!reportingPeriodId) return null;
    const response = await privateApi.get<BRSRStatutoryDisclosureResponse>(
        `/tenant/brsr/statutory-disclosure?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
    );
    return response.data?.data ?? null;
}

export async function saveBrsrStatutoryDisclosure(
    payload: BRSRStatutoryDisclosureData,
): Promise<BRSRStatutoryDisclosureData> {
    const response = await privateApi.put<BRSRStatutoryDisclosureResponse>(
        "/tenant/brsr/statutory-disclosure",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save statutory disclosures.");
    }
    return response.data.data;
}

// ==========================================
// PRINCIPLE 6: WATER DISCLOSURES & ZLD
// ==========================================

export async function getBrsrWaterDisclosure(
    reportingPeriodId: string,
): Promise<BRSRWaterDisclosureData | null> {
    if (!reportingPeriodId) return null;
    const response = await privateApi.get<BRSRWaterDisclosureResponse>(
        `/tenant/brsr/water-disclosure?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
    );
    return response.data?.data ?? null;
}

export async function saveBrsrWaterDisclosure(
    payload: BRSRWaterDisclosureSaveInput,
): Promise<BRSRWaterDisclosureData> {
    const response = await privateApi.put<BRSRWaterDisclosureResponse>(
        "/tenant/brsr/water-disclosure",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save water disclosure data.");
    }
    return response.data.data;
}

export async function postBrsrWaterDisclosure(
    payload: BRSRWaterDisclosureSaveInput,
): Promise<BRSRWaterDisclosureData> {
    return saveBrsrWaterDisclosure(payload);
}

export async function postBrsrWaterReport(
    payload: BRSRWaterDisclosureSaveInput,
): Promise<Blob> {
    const response = await privateApi.post(
        "/tenant/brsr/water-disclosure/report",
        payload,
        { responseType: "blob" },
    );
    return response.data as Blob;
}

// ==========================================
// PRINCIPLE 6: WASTE MANAGEMENT
// ==========================================

export async function getBrsrWasteDisclosure(
    reportingPeriodId: string,
): Promise<BRSRWasteDisclosureData | null> {
    if (!reportingPeriodId) return null;
    const response = await privateApi.get<BRSRWasteDisclosureResponse>(
        `/tenant/brsr/waste-disclosure?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
    );
    return response.data?.data ?? null;
}

export async function saveBrsrWasteDisclosure(
    payload: BRSRWasteDisclosureSaveInput,
): Promise<BRSRWasteDisclosureData> {
    const response = await privateApi.put<BRSRWasteDisclosureResponse>(
        "/tenant/brsr/waste-disclosure",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save waste disclosure data.");
    }
    return response.data.data;
}

export async function postBrsrWasteDisclosure(
    payload: BRSRWasteDisclosureSaveInput,
): Promise<BRSRWasteDisclosureData> {
    return saveBrsrWasteDisclosure(payload);
}

export async function postBrsrWasteReport(
    payload: BRSRWasteDisclosureSaveInput,
): Promise<Blob> {
    const response = await privateApi.post(
        "/tenant/brsr/waste-disclosure-report/export",
        payload,
        { responseType: "blob" },
    );
    return response.data as Blob;
}

// ==========================================
// PRINCIPLE 6: AIR STACK EMISSIONS
// ==========================================

export async function getBrsrAirDisclosure(
    reportingPeriodId: string,
): Promise<BRSRAirDisclosureData | null> {
    if (!reportingPeriodId) return null;
    const response = await privateApi.get<BRSRAirDisclosureResponse>(
        `/tenant/brsr/air-disclosure?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
    );
    return response.data?.data ?? null;
}

export async function saveBrsrAirDisclosure(
    payload: BRSRAirDisclosureSaveInput,
): Promise<BRSRAirDisclosureData> {
    const response = await privateApi.put<BRSRAirDisclosureResponse>(
        "/tenant/brsr/air-disclosure",
        payload,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to save air disclosure data.");
    }
    return response.data.data;
}

export async function postBrsrAirDisclosure(
    payload: BRSRAirDisclosureSaveInput,
): Promise<BRSRAirDisclosureData> {
    return saveBrsrAirDisclosure(payload);
}

export async function postBrsrAirReport(
    payload: BRSRAirDisclosureSaveInput,
): Promise<Blob> {
    const response = await privateApi.post(
        "/tenant/brsr/air/report",
        payload,
        { responseType: "blob" },
    );
    return response.data as Blob;
}

export async function getBrsrAirStackPresets(): Promise<BrsrAirStackPresetsData> {
    const response = await privateApi.get<BrsrAirStackPresetsResponse>(
        "/tenant/brsr/air/stack-presets",
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to fetch stack presets.");
    }
    return response.data.data;
}

// ==========================================
// PRINCIPLE 6: ENERGY CONSUMPTION
// ==========================================

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
    payload: BrsrEnergyConsumptionPayload,
): Promise<BrsrEnergyConsumptionData> {
    const body = {
        ...payload,
        physical_output: payload.physical_output ?? payload.physical_output_tonnes ?? null,
        physical_output_tonnes: payload.physical_output_tonnes ?? payload.physical_output ?? null,
    };
    const response = await privateApi.post<BrsrEnergyConsumptionResponse>(
        "/tenant/brsr/energy-consumption",
        body,
    );
    if (!response.data?.success || !response.data?.data) {
        throw new Error(response.data?.message ?? "Failed to fetch energy consumption data.");
    }
    return response.data.data;
}

export async function getBrsrEnergyReport(
    payload: BrsrEnergyConsumptionPayload,
): Promise<Blob> {
    const body = {
        ...payload,
        physical_output: payload.physical_output ?? payload.physical_output_tonnes ?? null,
        physical_output_tonnes: payload.physical_output_tonnes ?? payload.physical_output ?? null,
    };
    const response = await privateApi.post(
        "/tenant/brsr/energy-consumption/report",
        body,
        { responseType: "blob" },
    );
    return response.data as Blob;
}

// ==========================================
// PDF GENERATION & EXPORTS
// ==========================================

export async function getBrsrFullReportPdf(
    reportingPeriodId: string,
    optionalParams?: {
        turnover_inr?: number;
        ppp_conversion_factor?: number;
        physical_output?: number;
        physical_output_unit?: string;
    },
): Promise<Blob> {
    if (optionalParams && Object.keys(optionalParams).length > 0) {
        const response = await privateApi.post(
            "/tenant/brsr/full-report/pdf",
            {
                reporting_period_id: reportingPeriodId,
                ...optionalParams,
            },
            { responseType: "blob" },
        );
        return response.data as Blob;
    }

    const response = await privateApi.get(
        `/tenant/brsr/full-report/pdf?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
        { responseType: "blob" },
    );
    return response.data as Blob;
}

export async function getBrsrPrinciple6Pdf(
    reportingPeriodId: string,
): Promise<Blob> {
    const response = await privateApi.get(
        `/tenant/brsr/principle-6/pdf?reporting_period_id=${encodeURIComponent(reportingPeriodId)}`,
        { responseType: "blob" },
    );
    return response.data as Blob;
}
