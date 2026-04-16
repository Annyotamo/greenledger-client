import { privateApi } from "@/lib/http/client";
import type {
    Scope1IngestRequest,
    Scope1IngestResponse,
    Scope1ReportRecord,
    Scope1ReportResponse,
} from "@/types/report";

export async function getScope1Reports(): Promise<Scope1ReportRecord[]> {
    const { data } = await privateApi.get<Scope1ReportResponse>("/report/getAllReport/reportType=scope1");
    return data.data ?? [];
}

export async function ingestScope1Emission(payload: Scope1IngestRequest): Promise<void> {
    await privateApi.post<Scope1IngestResponse>("/scope1Ingest/ingestEmission", payload);
}
