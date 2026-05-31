import { privateApi } from "@/lib/http/client";
import type {
    CreateReportingPeriodPayload,
    PaginatedReportingPeriodsResponse,
    ReportingPeriod,
    ReportingPeriodDto,
    ReportingPeriodsApiResponse,
} from "./types";

function mapReportingPeriod(dto: ReportingPeriodDto): ReportingPeriod {
    return {
        id: dto.id,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        tenantId: dto.tenant_id,
        name: dto.name,
        reportingYear: dto.reporting_year,
        periodStart: dto.period_start,
        periodEnd: dto.period_end,
        periodStatus: dto.period_status,
        lockedBy: dto.locked_by,
        lockedAt: dto.locked_at,
        scope1TotalKgCo2e: dto.scope1_total_kg_co2e ? Number(dto.scope1_total_kg_co2e) : null,
        scope1TotalTCo2e: dto.scope1_total_t_co2e ? Number(dto.scope1_total_t_co2e) : null,
        scope1KgCo2: dto.scope1_kg_co2 ? Number(dto.scope1_kg_co2) : null,
        scope1TCo2: dto.scope1_t_co2 ? Number(dto.scope1_t_co2) : null,
        scope1KgCh4: dto.scope1_kg_ch4 ? Number(dto.scope1_kg_ch4) : null,
        scope1TCh4: dto.scope1_t_ch4 ? Number(dto.scope1_t_ch4) : null,
        scope1KgN2o: dto.scope1_kg_n2o ? Number(dto.scope1_kg_n2o) : null,
        scope1TN2o: dto.scope1_t_n2o ? Number(dto.scope1_t_n2o) : null,
        scope1BiogenicKgCo2: dto.scope1_biogenic_kg_co2 ? Number(dto.scope1_biogenic_kg_co2) : null,
        scope1BiogenicTCo2: dto.scope1_biogenic_t_co2 ? Number(dto.scope1_biogenic_t_co2) : null,
        scope1StationaryKgCo2e: dto.scope1_stationary_kg_co2e ? Number(dto.scope1_stationary_kg_co2e) : null,
        scope1StationaryTCo2e: dto.scope1_stationary_t_co2e ? Number(dto.scope1_stationary_t_co2e) : null,
        scope1MobileKgCo2e: dto.scope1_mobile_kg_co2e ? Number(dto.scope1_mobile_kg_co2e) : null,
        scope1MobileTCo2e: dto.scope1_mobile_t_co2e ? Number(dto.scope1_mobile_t_co2e) : null,
        scope1ProcessKgCo2e: dto.scope1_process_kg_co2e ? Number(dto.scope1_process_kg_co2e) : null,
        scope1ProcessTCo2e: dto.scope1_process_t_co2e ? Number(dto.scope1_process_t_co2e) : null,
        scope1FugitiveKgCo2e: dto.scope1_fugitive_kg_co2e ? Number(dto.scope1_fugitive_kg_co2e) : null,
        scope1FugitiveTCo2e: dto.scope1_fugitive_t_co2e ? Number(dto.scope1_fugitive_t_co2e) : null,
        scope2LocationKgCo2e: dto.scope2_location_kg_co2e ? Number(dto.scope2_location_kg_co2e) : null,
        scope2LocationTCo2e: dto.scope2_location_t_co2e ? Number(dto.scope2_location_t_co2e) : null,
        scope2MarketKgCo2e: dto.scope2_market_kg_co2e ? Number(dto.scope2_market_kg_co2e) : null,
        scope2MarketTCo2e: dto.scope2_market_t_co2e ? Number(dto.scope2_market_t_co2e) : null,
        scope2TotalKwh: dto.scope2_total_kwh ? Number(dto.scope2_total_kwh) : null,
        selfGeneratedKwh: dto.self_generated_kwh ? Number(dto.self_generated_kwh) : null,
    };
}

export async function getReportingPeriods(): Promise<ReportingPeriod[]> {
    const response = await privateApi.get<PaginatedReportingPeriodsResponse>("/tenant/reporting-periods");
    const rawItems = response.data.data?.items ?? [];
    return Array.isArray(rawItems) ? rawItems.map(mapReportingPeriod) : [];
}

export async function createReportingPeriod(payload: CreateReportingPeriodPayload): Promise<ReportingPeriod> {
    const response = await privateApi.post<ReportingPeriodsApiResponse<ReportingPeriodDto>>(
        "/tenant/reporting-periods",
        payload,
    );

    const rawData = response.data.data;
    const periodDto = Array.isArray(rawData) ? rawData[0] : rawData;

    return mapReportingPeriod(periodDto ?? ({} as ReportingPeriodDto));
}
