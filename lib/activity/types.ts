export type FuelActivityItemDto = {
    id: string;
    created_at: string;
    updated_at: string;
    context: {
        tenant_id: string;
        facility_id: string;
        meter_id: string | null;
        reporting_period_id: string;
        activity_start_date: string;
        activity_end_date: string;
    };
    workflow: {
        status: string;
        rejected_reason: string | null;
        verified_by: string | null;
        verified_at: string | null;
        is_amendment: boolean;
        amended_from_id: string | null;
        entered_by: string;
    };
    activity: {
        scope_type: string;
        fuel_id: string;
        quantity: string;
        quantity_unit_id: string;
        usage_type: string;
        emission_type: string;
        energy_content_gj: string;
        generator_efficiency_percentage: string;
        generated_electricity_kwh: string;
        generated_electricity_mwh: string;
        generated_steam_gj: string | null;
        data_quality_tier: string;
        estimation_basis: string | null;
        notes: string | null;
    };
    calculated: {
        calculated_kg_co2e: string;
        calculated_t_co2e: string;
        calculated_kg_co2: string;
        calculated_t_co2: string;
        calculated_kg_ch4: string;
        calculated_t_ch4: string;
        calculated_kg_n2o: string;
        calculated_t_n2o: string;
        biogenic_kg_co2: string | null;
        biogenic_t_co2: string | null;
        calculation_method: string | null;
        calculation_details: string | null;
    };
    factor: {
        id: string;
        created_at: string;
        updated_at: string;
        fuel: {
            id: string;
            name: string;
            slug: string;
            factor_type: string;
            applicable_scopes: string[];
            is_active: boolean;
        };
        source: {
            id: string;
            standard: string;
            version: string;
            region: string;
            data_year: number;
            is_active: boolean;
            emission_unit: string;
        };
        unit: {
            id: string;
            name: string;
            symbol: string;
            unit_type: string;
        };
        factors: {
            kg: {
                kg_co2e: string;
                kg_co2e_of_co2: string;
                kg_co2e_of_ch4: string;
                kg_co2e_of_n2o: string;
                other_ghg_kg_co2e: string | null;
            };
            tonnes: {
                t_co2e: string;
                t_co2e_of_co2: string;
                t_co2e_of_ch4: string;
                t_co2e_of_n2o: string;
                other_ghg_t_co2e: string | null;
            };
        };
        source_reference_code: string | null;
        calculation_method: string | null;
        is_active: boolean;
        is_deprecated: boolean;
    };
    documents: {
        count: number;
    };
};

export type FuelActivity = {
    id: string;
    createdAt: string;
    updatedAt: string;
    facilityId: string;
    reportingPeriodId: string;
    activityStartDate: string;
    activityEndDate: string;
    scopeType: string;
    fuelId: string;
    fuelName: string;
    fuelSlug: string;
    quantity: number;
    quantityUnitId: string;
    unitName: string;
    unitSymbol: string;
    usageType: string;
    emissionType: string;
    energyContentGJ: number;
    generatorEfficiencyPercentage: number;
    generatedElectricityKwh: number;
    generatedElectricityMwh: number;
    generatedSteamGJ: number | null;
    dataQualityTier: string;
    estimationBasis: string | null;
    notes: string | null;
    workflowStatus: string;
    calculatedTCo2e: number;
    calculatedKgCo2e: number;
    documentsCount: number;
    fuelFactorStandard: string;
    fuelFactorVersion: string;
    fuelFactorRegion: string;
};

export type FuelActivityPagination = {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
};

export type FuelActivityApiResponse<T = FuelActivityItemDto> = {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        items: T[];
        pagination: FuelActivityPagination;
    };
    error: null | unknown;
    method: string;
    path: string;
    timestamp: string;
};
