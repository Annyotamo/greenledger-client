export type AccountingMethod = "location_based" | "market_based";

export type MarketAllocationDto = {
    contracted_electricity_kwh: number;
    contracted_electricity_mwh?: number;
    contracted_emission_factor: number;
    contracted_emission_factor_unit: string;
    uncovered_electricity_kwh?: number;
    uncovered_electricity_mwh?: number;
};

export type MarketAllocation = {
    contractedElectricityKwh: number;
    contractedElectricityMwh?: number;
    contractedEmissionFactor: number;
    contractedEmissionFactorUnit: string;
    uncoveredElectricityKwh?: number;
    uncoveredElectricityMwh?: number;
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

export type ElectricityActivityItemDto = {
    id: string;
    created_at?: string;
    updated_at?: string;
    context?: {
        tenant_id?: string;
        facility_id: string;
        reporting_period_id: string;
        activity_start_date: string;
        activity_end_date: string;
    };
    workflow?: {
        status: string;
        rejected_reason?: string | null;
        verified_by?: string | null;
        verified_at?: string | null;
    };
    activity?: {
        scope_type?: string;
        accounting_method?: AccountingMethod;
        electricity_activity_type: string;
        source_type: string;
        electricity_kwh: number | string;
        electricity_mwh: number | string;
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
        calculated_kg_co2e: number | string;
        calculated_t_co2e: number | string;
        calculation_method?: string | null;
    };
    documents?: {
        count: number;
    };
    factor?: {
        source?: {
            standard?: string | null;
            version?: string | null;
            region?: string | null;
        };
    };
    facility_id?: string;
    reporting_period_id?: string;
    activity_start_date?: string;
    activity_end_date?: string;
    accounting_method?: AccountingMethod;
    electricity_activity_type?: string;
    source_type?: string;
    electricity_kwh?: number | string;
    electricity_mwh?: number | string;
    supplier_name?: string | null;
    is_renewable_certified?: boolean;
    data_quality_tier?: string;
    notes?: string | null;
    workflow_status?: string;
    status?: string;
    calculated_t_co2e?: number | string;
    calculated_kg_co2e?: number | string;
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
    reportingPeriodId: string;
    activityStartDate: string;
    activityEndDate: string;
    scopeType: string;
    accountingMethod: AccountingMethod;
    electricityActivityType: string;
    sourceType: string;
    electricityKwh: number;
    electricityMwh: number;
    sourceFuelActivityId: string | null;
    supplierName: string | null;
    isRenewableCertified: boolean;
    dataQualityTier: string;
    estimationBasis: string | null;
    notes: string | null;
    workflowStatus: string;
    calculatedTCo2e: number;
    calculatedKgCo2e: number;
    documentsCount: number;
    factorSourceStandard?: string | null;
    factorSourceVersion?: string | null;
    factorSourceRegion?: string | null;
    marketAllocation?: MarketAllocation | null;
    marketCertificate?: MarketCertificate | null;
    includePurchasedEnergy?: boolean;
    purchasedEnergy?: PurchasedEnergy | null;
    calculationMethod?: string | null;
};

