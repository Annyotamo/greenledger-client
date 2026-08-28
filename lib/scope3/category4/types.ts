export type Scope3Status = "draft" | "submitted" | "verified" | "rejected";

export type Category4TransportActivityDto = {
    id: string;
    tenant_id?: string;
    reporting_period_id?: string | null;
    reporting_period_name?: string | null;
    facility_id?: string | null;
    facility_name?: string | null;
    freighting_goods_emission_factor_id: string;
    factor_group: string;
    activity_date: string;
    activity_value: string | number;
    description?: string | null;
    applied_factor_kg_co2e?: string | number;
    applied_factor_t_co2e?: string | number;
    applied_factor_kg_co2?: string | number;
    applied_factor_t_co2?: string | number;
    applied_factor_kg_ch4?: string | number;
    applied_factor_t_ch4?: string | number;
    applied_factor_kg_n2o?: string | number;
    applied_factor_t_n2o?: string | number;
    calculated_kg_co2e?: string | number;
    calculated_t_co2e?: string | number;
    calculated_kg_co2?: string | number;
    calculated_t_co2?: string | number;
    calculated_kg_ch4?: string | number;
    calculated_t_ch4?: string | number;
    calculated_kg_n2o?: string | number;
    calculated_t_n2o?: string | number;
    calculation_details?: string | null;
    status: Scope3Status;
    notes?: string | null;
    rejected_reason?: string | null;
    entered_by?: string | null;
    entered_by_email?: string | null;
    verified_by?: string | null;
    verified_by_email?: string | null;
    verified_at?: string | null;
    is_amendment?: boolean;
    amended_from_id?: string | null;
    created_at: string;
    updated_at: string;
    activity_category?: string | null;
    vehicle_type?: string | null;
    unit_symbol?: string | null;
    source_standard?: string | null;
};

export type Category4TransportActivityEntry = {
    id: string;
    createdAt: string;
    updatedAt: string;
    facilityId: string | null;
    facilityName: string | null;
    reportingPeriodId: string | null;
    reportingPeriodName: string;
    freightingGoodsEmissionFactorId: string;
    factorGroup: string;
    activityDate: string;
    activityValue: number;
    description: string | null;
    appliedFactorKgCo2e: number;
    appliedFactorTCo2e: number;
    calculatedKgCo2e: number;
    calculatedTCo2e: number;
    calculatedKgCo2?: number;
    calculatedKgCh4?: number;
    calculatedKgN2o?: number;
    calculationDetails: string | null;
    status: Scope3Status;
    notes: string | null;
    rejectedReason: string | null;
    enteredByEmail?: string | null;
    verifiedByEmail?: string | null;
    verifiedAt?: string | null;
    isAmendment?: boolean;
    amendedFromId: string | null;
    activityCategory: string;
    vehicleType: string;
    unitSymbol: string;
    sourceStandard: string;
};

export type CreateCategory4TransportPayload = {
    reporting_period_id: string;
    facility_id?: string | null;
    freighting_goods_emission_factor_id: string;
    factor_group: string;
    activity_date: string;
    activity_value: number;
    description?: string | null;
    status?: Scope3Status;
    notes?: string | null;
};

export type UpdateCategory4TransportPayload = Partial<CreateCategory4TransportPayload>;

export type AmendCategory4TransportPayload = CreateCategory4TransportPayload & {
    amended_from_id: string;
};

export type Category4TransportFilterParams = {
    reporting_period_id?: string;
    facility_id?: string;
    status?: string;
    activity_category?: string;
    vehicle_type?: string;
    factor_group?: string;
    activity_date?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
};

export type Category4SummaryRollup = {
    total_records: number;
    total_calculated_kg_co2e: string | number;
    total_calculated_t_co2e: string | number;
    total_calculated_kg_co2?: string | number;
    total_calculated_kg_ch4?: string | number;
    total_calculated_kg_n2o?: string | number;
    category_breakdown?: Array<{
        activity_category: string;
        total_records: number;
        total_activity_value: string | number;
        total_kg_co2e: string | number;
        total_t_co2e: string | number;
    }>;
};
