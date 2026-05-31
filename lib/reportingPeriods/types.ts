export type ReportingPeriodDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
    name: string;
    reporting_year: number;
    period_start: string;
    period_end: string;
    period_status: "open" | "closed" | "locked";
    locked_by: string | null;
    locked_at: string | null;
    scope1_total_kg_co2e: string | null;
    scope1_total_t_co2e: string | null;
    scope1_kg_co2: string | null;
    scope1_t_co2: string | null;
    scope1_kg_ch4: string | null;
    scope1_t_ch4: string | null;
    scope1_kg_n2o: string | null;
    scope1_t_n2o: string | null;
    scope1_biogenic_kg_co2: string | null;
    scope1_biogenic_t_co2: string | null;
    scope1_stationary_kg_co2e: string | null;
    scope1_stationary_t_co2e: string | null;
    scope1_mobile_kg_co2e: string | null;
    scope1_mobile_t_co2e: string | null;
    scope1_process_kg_co2e: string | null;
    scope1_process_t_co2e: string | null;
    scope1_fugitive_kg_co2e: string | null;
    scope1_fugitive_t_co2e: string | null;
    scope2_location_kg_co2e: string | null;
    scope2_location_t_co2e: string | null;
    scope2_market_kg_co2e: string | null;
    scope2_market_t_co2e: string | null;
    scope2_total_kwh: string | null;
    self_generated_kwh: string | null;
};

export type ReportingPeriod = {
    id: string;
    createdAt: string;
    updatedAt: string;
    tenantId: string;
    name: string;
    reportingYear: number;
    periodStart: string;
    periodEnd: string;
    periodStatus: "open" | "closed" | "locked";
    lockedBy: string | null;
    lockedAt: string | null;
    scope1TotalKgCo2e: number | null;
    scope1TotalTCo2e: number | null;
    scope1KgCo2: number | null;
    scope1TCo2: number | null;
    scope1KgCh4: number | null;
    scope1TCh4: number | null;
    scope1KgN2o: number | null;
    scope1TN2o: number | null;
    scope1BiogenicKgCo2: number | null;
    scope1BiogenicTCo2: number | null;
    scope1StationaryKgCo2e: number | null;
    scope1StationaryTCo2e: number | null;
    scope1MobileKgCo2e: number | null;
    scope1MobileTCo2e: number | null;
    scope1ProcessKgCo2e: number | null;
    scope1ProcessTCo2e: number | null;
    scope1FugitiveKgCo2e: number | null;
    scope1FugitiveTCo2e: number | null;
    scope2LocationKgCo2e: number | null;
    scope2LocationTCo2e: number | null;
    scope2MarketKgCo2e: number | null;
    scope2MarketTCo2e: number | null;
    scope2TotalKwh: number | null;
    selfGeneratedKwh: number | null;
};

export type CreateReportingPeriodPayload = {
    name: string;
    reporting_year: number;
    period_start: string;
    period_end: string;
};

export type ReportingPeriodsApiResponse<T = ReportingPeriodDto[]> = {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
    error: unknown | null;
    method: string;
    path: string;
    timestamp: string;
};

export type PaginatedReportingPeriodsResponse = {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        items: ReportingPeriodDto[];
        pagination: {
            total: number;
            page: number;
            page_size: number;
            total_pages: number;
        };
    };
    error: unknown | null;
    method: string;
    path: string;
    timestamp: string;
};
