import { privateApi } from "@/lib/http/client";
import type {
    Scope1DashboardData,
    Scope1DashboardResponse,
    Scope1EmissionsOverlayDropdownData,
    Scope1EmissionsOverlayResponse,
    Scope1IngestListResponse,
    Scope1IngestRecord,
    Scope1IngestRequest,
    Scope1IngestResponse,
    Scope1ReportRecord,
    Scope1ReportResponse,
    Scope2IngestListResponse,
    Scope2IngestRequest,
    Scope2IngestResponse,
    Scope2ActivityDataIngest,
    Scope2ReportRecord,
    Scope2ReportResponse,
    CompanyDetails,
    CompanyDetailsResponse,
} from "@/types/report";

export async function getScope1Reports(): Promise<Scope1ReportRecord[]> {
    const { data } = await privateApi.get<Scope1ReportResponse>("/report/getAllReport/scope1");
    return data.data ?? [];
}

export async function ingestScope1Emission(payload: Scope1IngestRequest): Promise<void> {
    await privateApi.post<Scope1IngestResponse>("/scope1Ingest/ingestEmission", payload);
}

export async function downloadScope1ReportCsv(startMonth: string, endMonth: string): Promise<Blob> {
    const { data } = await privateApi.get("/report/GenerateReport/scope1", {
        params: { startMonth, endMonth },
        responseType: "blob",
    });

    return data;
}

export async function getScope1EmissionsOverlayDropdownData(): Promise<Scope1EmissionsOverlayDropdownData> {
    const { data } = await privateApi.get<Scope1EmissionsOverlayResponse>("/fuel/getAllFuel");
    return data.data ?? {};
}

export async function getScope1Dashboard(startMonth: string, endMonth: string): Promise<Scope1DashboardData | null> {
    const { data } = await privateApi.get<Scope1DashboardResponse>(
        `/scope1Ingest/dashBoard/${encodeURIComponent(startMonth)}/${encodeURIComponent(endMonth)}`,
    );
    return data.data ?? null;
}

export async function getScope1IngestedRecords(): Promise<Scope1IngestRecord[]> {
    const { data } = await privateApi.get<Scope1IngestListResponse>("/scope1Ingest/getAllIngest");
    return data.data ?? [];
}

export async function getScope2Reports(): Promise<Scope2ReportRecord[]> {
    const { data } = await privateApi.get<Scope2ReportResponse>("/report/getAllReport/scope2");
    return data.data ?? [];
}

export async function ingestScope2Emission(payload: Scope2IngestRequest): Promise<void> {
    await privateApi.post<Scope2IngestResponse>("/scope2Ingest/ingestEmission", payload);
}

export async function getScope2IngestedRecords(): Promise<Scope2ActivityDataIngest[]> {
    const { data } = await privateApi.get<Scope2ActivityDataIngest[] | Scope2IngestListResponse>(
        "/scope2Ingest/getAll",
    );
    if (Array.isArray(data)) {
        return data;
    }
    return data?.data ?? [];
}

export async function downloadScope2ReportCsv(startMonth: string, endMonth: string): Promise<Blob> {
    const { data } = await privateApi.get("/report/GenerateReport/scope2", {
        params: { startMonth, endMonth },
        responseType: "blob",
    });

    return data;
}

export async function getCompanyDetails(): Promise<CompanyDetails | null> {
    const { data } = await privateApi.get<CompanyDetailsResponse>("/company/getDetails");
    return data.data?.[0] ?? null;
}
