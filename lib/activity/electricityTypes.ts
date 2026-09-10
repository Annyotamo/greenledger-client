export type AccountingMethod = "location_based" | "market_based";

export type MarketInstrumentType =
    | "renewable_ppa"
    | "non_renewable_ppa"
    | "rec"
    | "irec"
    | "green_tariff"
    | "supplier_specific"
    | "none";

export type MarketAllocationDto = {
    contracted_electricity_kwh: number;
    contracted_electricity_mwh?: number;
    contracted_emission_factor: number;
    contracted_emission_factor_unit: string;
    uncovered_electricity_kwh?: number;
    uncovered_electricity_mwh?: number;
    contracted_electricity_tco2e?: number;
    uncovered_electricity_tco2e?: number;
};

export type MarketAllocation = {
    contractedElectricityKwh: number;
    contractedElectricityMwh?: number;
    contractedEmissionFactor: number;
    contractedEmissionFactorUnit: string;
    uncoveredElectricityKwh?: number;
    uncoveredElectricityMwh?: number;
    contractedElectricityTco2e?: number;
    uncoveredElectricityTco2e?: number;
};

export type MarketCertificateDto = {
    serial_number?: string | null;
    date_acquired?: string | null;
    expiration_date?: string | null;
    quantity?: number | null;
    certificate_reference?: string | null;
    is_renewable_certified?: boolean | null;
};

export type MarketCertificate = {
    serialNumber?: string | null;
    dateAcquired?: string | null;
    expirationDate?: string | null;
    quantity?: number | null;
    certificateReference?: string | null;
    isRenewableCertified?: boolean | null;
};

export type PurchasedEnergyDto = {
    include_purchased_energy?: boolean;
    unit: string;
    steam?: number | null;
    heating?: number | null;
    cooling?: number | null;
    steam_emission_factor?: number | null;
    heating_emission_factor?: number | null;
    cooling_emission_factor?: number | null;
    emission_factor_unit?: string | null;
};

export type PurchasedEnergy = {
    includePurchasedEnergy?: boolean;
    unit: string;
    steam?: number | null;
    heating?: number | null;
    cooling?: number | null;
    steamEmissionFactor?: number | null;
    heatingEmissionFactor?: number | null;
    coolingEmissionFactor?: number | null;
    emissionFactorUnit?: string | null;
};

export type ElectricityActivityDocumentItemDto = {
    id: string;
    created_at?: string;
    updated_at?: string;
    electricity_activity_id?: string | null;
    fuel_activity_id?: string | null;
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

export type ElectricityActivityDocumentItem = {
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
    document_name?: string;
    document_type?: string;
    document_date?: string | null;
    source_url?: string;
};

export type ElectricityActivityItemDto = {
    id: string;
    created_at?: string;
    updated_at?: string;
    context?: {
        tenant_id?: string;
        facility_id: string;
        facility?: {
            id: string;
            name: string;
            facility_code?: string;
            country?: string;
            city?: string;
        } | null;
        meter_id?: string | null;
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
    workflow?: {
        status: string;
        rejected_reason?: string | null;
        verified_by?: string | null;
        verified_at?: string | null;
        is_amendment?: boolean;
        amended_from_id?: string | null;
        entered_by?: string | null;
    };
    activity?: {
        scope_type?: string | null;
        accounting_method?: AccountingMethod | null;
        electricity_activity_type: string;
        source_type: string;
        electricity_kwh: number | string;
        electricity_mwh: number | string;
        has_market_instrument?: boolean | null;
        market_instrument_type?: MarketInstrumentType | string | null;
        location_source_id?: string | null;
        market_source_id?: string | null;
        source_fuel_activity_id?: string | null;
        supplier_name?: string | null;
        is_renewable_certified?: boolean;
        data_quality_tier: string;
        estimation_basis?: string | null;
        notes?: string | null;
        market_allocation?: MarketAllocationDto | null;
        market_certificate?: MarketCertificateDto | null;
        include_purchased_energy?: boolean;
        purchased_energy?: PurchasedEnergyDto | null;
    };
    calculated?: {
        calculated_kg_co2e?: number | string | null;
        calculated_t_co2e?: number | string | null;
        location_calculated_kg_co2e?: number | string | null;
        location_calculated_t_co2e?: number | string | null;
        location_kg_co2?: number | string | null;
        location_kg_ch4?: number | string | null;
        location_kg_n2o?: number | string | null;
        market_calculated_kg_co2e?: number | string | null;
        market_calculated_t_co2e?: number | string | null;
        has_market_instrument?: boolean | null;
        market_instrument_type?: MarketInstrumentType | string | null;
        calculation_method?: string | null;
    };
    documents?: {
        count: number;
        items?: ElectricityActivityDocumentItemDto[];
    } | null;
    factor?: {
        source?: {
            id?: string;
            standard?: string | null;
            version?: string | null;
            region?: string | null;
            gwp_basis?: string | null;
        };
    };
    // Flat properties for backward compatibility
    facility_id?: string;
    reporting_period_id?: string;
    activity_start_date?: string;
    activity_end_date?: string;
    accounting_method?: AccountingMethod | null;
    electricity_activity_type?: string;
    source_type?: string;
    electricity_kwh?: number | string;
    electricity_mwh?: number | string;
    has_market_instrument?: boolean;
    market_instrument_type?: MarketInstrumentType | string | null;
    supplier_name?: string | null;
    is_renewable_certified?: boolean;
    data_quality_tier?: string;
    notes?: string | null;
    workflow_status?: string;
    status?: string;
    calculated_t_co2e?: number | string;
    calculated_kg_co2e?: number | string;
    location_calculated_t_co2e?: number | string | null;
    location_calculated_kg_co2e?: number | string | null;
    market_calculated_t_co2e?: number | string | null;
    market_calculated_kg_co2e?: number | string | null;
    market_allocation?: MarketAllocationDto | null;
    market_certificate?: MarketCertificateDto | null;
    include_purchased_energy?: boolean;
    purchased_energy?: PurchasedEnergyDto | null;
};

export type ElectricityActivity = {
    id: string;
    createdAt: string;
    updatedAt: string;
    facilityId: string;
    facilityName?: string;
    facilityCode?: string;
    facilityCity?: string;
    facilityCountry?: string;
    reportingPeriodId: string;
    reportingPeriodName?: string;
    periodStatus?: string;
    periodStartDate?: string;
    periodEndDate?: string;
    meterId?: string | null;
    activityStartDate: string;
    activityEndDate: string;
    scopeType: string | null;
    accountingMethod: AccountingMethod | null;
    electricityActivityType: string;
    sourceType: string;
    electricityKwh: number;
    electricityMwh: number;
    hasMarketInstrument: boolean;
    marketInstrumentType: MarketInstrumentType | null;
    locationSourceId: string | null;
    marketSourceId: string | null;
    sourceFuelActivityId: string | null;
    supplierName: string | null;
    isRenewableCertified: boolean;
    dataQualityTier: string;
    estimationBasis: string | null;
    notes: string | null;
    workflowStatus: string;
    rejectedReason: string | null;
    verifiedBy: string | null;
    verifiedAt: string | null;
    isAmendment: boolean;
    amendedFromId: string | null;
    enteredBy: string | null;
    calculatedTCo2e: number;
    calculatedKgCo2e: number;
    locationCalculatedTCo2e: number | null;
    locationCalculatedKgCo2e: number | null;
    locationKgCo2: number | null;
    locationKgCh4: number | null;
    locationKgN2o: number | null;
    marketCalculatedTCo2e: number | null;
    marketCalculatedKgCo2e: number | null;
    documentsCount: number;
    attachedDocuments?: ElectricityActivityDocumentItem[];
    factorSourceStandard?: string | null;
    factorSourceVersion?: string | null;
    factorSourceRegion?: string | null;
    marketAllocation?: MarketAllocation | null;
    marketCertificate?: MarketCertificate | null;
    includePurchasedEnergy?: boolean;
    purchasedEnergy?: PurchasedEnergy | null;
    calculationMethod?: string | null;
};

export type ElectricityActivityPagination = {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
};

export type ElectricityActivityApiResponse<T = ElectricityActivityItemDto> = {
    success: boolean;
    status_code: number;
    message: string;
    data: {
        items: T[];
        pagination?: ElectricityActivityPagination;
    };
    error: null | unknown;
    method: string;
    path: string;
    timestamp: string;
};


