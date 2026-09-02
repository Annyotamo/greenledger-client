export type FuelProfileDto = {
    id?: string;
    net_cv_gj_per_tonne?: number | null;
    net_cv_kwh_per_tonne?: number | null;
    net_cv_kwh_per_litre?: number | null;
    gross_cv_gj_per_tonne?: number | null;
    gross_cv_kwh_per_tonne?: number | null;
    gross_cv_kwh_per_litre?: number | null;
    density_kg_per_metre_cube?: number | null;
    density_litres_per_tonne?: number | null;
    density_kg_per_litre?: number | null;
    density_tonne_per_litre?: number | null;
};

export type QuantityUnitDto = {
    id: string;
    name: string;
    symbol: string;
    unit_type: string;
    conversion_to_base?: number | null;
    base_unit_symbol?: string | null;
};

export type EmissionSourceDto = {
    id: string;
    standard: string;
    version: string;
    region: string;
    data_year?: number | null;
    published_at?: string | null;
    effective_from?: string | null;
    effective_to?: string | null;
    is_active?: boolean;
    emission_unit?: string;
    tablename?: string | null;
    gwp_basis?: string | null;
    description?: string | null;
    source_url?: string | null;
    type?: string | null;
};

export type FuelActivityDocumentItemDto = {
    id: string;
    created_at?: string;
    updated_at?: string;
    fuel_activity_id?: string | null;
    electricity_activity_id?: string | null;
    document_name: string;
    document_type: string;
    source_url: string;
    download_url?: string | null;
    view_url?: string | null;
    s3_presigned_url?: string | null;
    file_name?: string | null;
    file_extension?: string | null;
    mime_type?: string | null;
    document_date?: string | null;
    notes?: string | null;
    issued_by?: string | null;
    uploaded_by?: string | null;
};

export type UnitsConfigDto = {
    quantity_unit?: QuantityUnitDto | null;
    energy_content_unit?: string;
    generated_electricity_units?: string[];
    generated_steam_unit?: string;
    emission_factor_unit?: string;
    source_emission_unit?: string;
    emissions_mass_units?: Record<string, string>;
};

export type FuelActivityItemDto = {
    id: string;
    created_at: string;
    updated_at: string;
    context: {
        tenant_id: string;
        facility_id: string;
        facility?: {
            id: string;
            name: string;
            facility_code?: string;
            country?: string;
            city?: string;
        } | null;
        meter_id: string | null;
        meter?: unknown | null;
        reporting_period_id: string;
        reporting_period?: {
            id: string;
            name: string;
            period_status?: string;
            period_start?: string;
            period_end?: string;
            start_date?: string;
            end_date?: string;
        } | null;
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
        fuel_id: string | null;
        fuel?: {
            id: string;
            name: string;
            slug: string;
            renewable?: boolean;
            factor_type?: string;
            profile?: FuelProfileDto | null;
        } | null;
        custom_fuel_id?: string | null;
        custom_fuel?: unknown | null;
        quantity: string | number;
        quantity_unit_id: string;
        quantity_unit?: QuantityUnitDto | null;
        usage_type?: string;
        emission_type: string;
        energy_content_gj?: string | number | null;
        generator_efficiency_percentage?: string | number | null;
        generated_electricity_kwh?: string | number | null;
        generated_electricity_mwh?: string | number | null;
        generated_steam_gj?: string | number | null;
        electricity_activity_id?: string | null;
        cost?: string | number | null;
        data_quality_tier: string;
        estimation_basis: string | null;
        notes: string | null;
        source_id?: string | null;
        source?: EmissionSourceDto | null;
    };
    quantity_unit?: QuantityUnitDto | null;
    calculated: {
        calculated_kg_co2e: string | number;
        calculated_t_co2e: string | number;
        calculated_kg_co2: string | number;
        calculated_t_co2: string | number;
        calculated_kg_ch4: string | number;
        calculated_t_ch4: string | number;
        calculated_kg_n2o: string | number;
        calculated_t_n2o: string | number;
        biogenic_kg_co2: string | number | null;
        biogenic_t_co2: string | number | null;
        calculation_method?: string | null;
        calculation_details?: string | null;
    };
    source?: EmissionSourceDto | null;
    factor?: {
        id: string;
        created_at: string;
        updated_at: string;
        fuel?: {
            id: string;
            name: string;
            slug: string;
            factor_type: string;
            applicable_scopes: string[];
            is_active: boolean;
            renewable?: boolean;
            source_id?: string;
        };
        source: EmissionSourceDto;
        unit: QuantityUnitDto;
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
        source_reference_code?: string | null;
        calculation_method?: string | null;
        biogenic_factor_id?: string | null;
        is_active: boolean;
        is_deprecated?: boolean;
    };
    units?: UnitsConfigDto | null;
    fuel_profile?: FuelProfileDto | null;
    documents?: {
        count: number;
        items?: FuelActivityDocumentItemDto[];
    } | null;
};

export type FuelProfile = {
    id?: string;
    netCvGjPerTonne?: number | null;
    netCvKwhPerTonne?: number | null;
    netCvKwhPerLitre?: number | null;
    grossCvGjPerTonne?: number | null;
    grossCvKwhPerTonne?: number | null;
    grossCvKwhPerLitre?: number | null;
    densityKgPerMetreCube?: number | null;
    densityLitresPerTonne?: number | null;
    densityKgPerLitre?: number | null;
    densityTonnePerLitre?: number | null;
};

export type EmissionSource = {
    id: string;
    standard: string;
    version: string;
    region: string;
    dataYear?: number | null;
    publishedAt?: string | null;
    effectiveFrom?: string | null;
    effectiveTo?: string | null;
    isActive: boolean;
    emissionUnit: string;
    tableName?: string | null;
    gwpBasis?: string | null;
    description?: string | null;
    sourceUrl?: string | null;
    type?: string | null;
};

export type FuelActivityDocumentItem = {
    id: string;
    documentType: string;
    documentName: string;
    sourceUrl: string;
    downloadUrl?: string | null;
    viewUrl?: string | null;
    s3PresignedUrl?: string | null;
    fileName?: string | null;
    fileExtension?: string | null;
    mimeType?: string | null;
    documentDate?: string | null;
    notes?: string | null;
    issuedBy?: string | null;
    uploadedBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    // Backward compatibility aliases
    document_name?: string;
    document_type?: string;
    document_date?: string | null;
    source_url?: string;
};

export type UnitsConfig = {
    quantityUnit?: {
        id: string;
        name: string;
        symbol: string;
        unitType: string;
        conversionToBase?: number | null;
        baseUnitSymbol?: string | null;
    } | null;
    energyContentUnit?: string;
    generatedElectricityUnits?: string[];
    generatedSteamUnit?: string;
    emissionFactorUnit?: string;
    sourceEmissionUnit?: string;
    emissionsMassUnits?: Record<string, string>;
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
    usageType?: string;
    emissionType: string;
    energyContentGJ: number;
    generatorEfficiencyPercentage: number;
    generatedElectricityKwh: number;
    generatedElectricityMwh: number;
    generatedSteamGJ: number | null;
    electricityActivityId?: string | null;
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
    biogenicFactorId?: string | null;
    // Facility & Period Context
    facilityName?: string;
    facilityCode?: string;
    facilityCity?: string;
    facilityCountry?: string;
    reportingPeriodName?: string;
    periodStatus?: string;
    periodStartDate?: string;
    periodEndDate?: string;
    meterId?: string | null;
    cost?: number | null;
    // Workflow metadata
    rejectedReason?: string | null;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    enteredBy?: string | null;
    isAmendment?: boolean;
    amendedFromId?: string | null;
    sourceReferenceCode?: string | null;
    // Factor & Fuel Details
    fuelIsRenewable?: boolean;
    fuelFactorType?: string;
    unitType?: string;
    factorDataYear?: number | null;
    factorEmissionUnit?: string | null;
    // Attached documents
    attachedDocuments?: FuelActivityDocumentItem[];
    // Full calculated data
    calculatedKgCo2: number;
    calculatedTCo2: number;
    calculatedKgCh4: number;
    calculatedTCh4: number;
    calculatedKgN2o: number;
    calculatedTN2o: number;
    biogenicKgCo2: number | null;
    biogenicTCo2: number | null;
    calculationMethod: string | null;
    calculationDetails: string | null;
    // Full factor data
    factorKgCo2e: number;
    factorKgCo2eOfCo2: number;
    factorKgCo2eOfCh4: number;
    factorKgCo2eOfN2o: number;
    factorOtherGhgKgCo2e: number | null;
    factorTCo2e: number;
    factorTCo2eOfCo2: number;
    factorTCo2eOfCh4: number;
    factorTCo2eOfN2o: number;
    factorOtherGhgTCo2e: number | null;
    // Extended Detailed Metadata from new API
    fuelProfile?: FuelProfile | null;
    source?: EmissionSource | null;
    units?: UnitsConfig | null;
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
