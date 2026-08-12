import { privateApi } from "@/lib/http/client";
import type { FuelActivity, FuelActivityApiResponse, FuelActivityItemDto } from "./types";
import type {
    ElectricityActivity,
    ElectricityActivityItemDto,
    MarketAllocation,
    MarketCertificate,
    PurchasedEnergy,
} from "./electricityTypes";

function mapFuelActivityItem(dto: FuelActivityItemDto): FuelActivity {
    return {
        id: dto.id,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        facilityId: dto.context.facility_id,
        reportingPeriodId: dto.context.reporting_period_id,
        activityStartDate: dto.context.activity_start_date,
        activityEndDate: dto.context.activity_end_date,
        scopeType: dto.activity.scope_type,
        fuelId: dto.activity.fuel_id || dto.activity.custom_fuel_id || "",
        fuelName: dto.factor?.fuel?.name ?? "Custom Fuel",
        fuelSlug: dto.factor?.fuel?.slug ?? "",
        quantity: Number(dto.activity.quantity),
        quantityUnitId: dto.activity.quantity_unit_id,
        unitName: dto.quantity_unit?.name ?? dto.factor?.unit?.name ?? "",
        unitSymbol: dto.quantity_unit?.symbol ?? dto.factor?.unit?.symbol ?? "",
        usageType: dto.activity.usage_type || undefined,
        emissionType: dto.activity.emission_type,
        energyContentGJ: dto.activity.energy_content_gj ? Number(dto.activity.energy_content_gj) : 0,
        generatorEfficiencyPercentage: dto.activity.generator_efficiency_percentage ? Number(dto.activity.generator_efficiency_percentage) : 0,
        generatedElectricityKwh: dto.activity.generated_electricity_kwh ? Number(dto.activity.generated_electricity_kwh) : 0,
        generatedElectricityMwh: dto.activity.generated_electricity_mwh ? Number(dto.activity.generated_electricity_mwh) : 0,
        generatedSteamGJ: dto.activity.generated_steam_gj ? Number(dto.activity.generated_steam_gj) : null,
        dataQualityTier: dto.activity.data_quality_tier,
        estimationBasis: dto.activity.estimation_basis,
        notes: dto.activity.notes,
        workflowStatus: dto.workflow.status,
        calculatedTCo2e: Number(dto.calculated.calculated_t_co2e),
        calculatedKgCo2e: Number(dto.calculated.calculated_kg_co2e),
        documentsCount: dto.documents.count,
        fuelFactorStandard: dto.factor?.source?.standard ?? "",
        fuelFactorVersion: dto.factor?.source?.version ?? "",
        fuelFactorRegion: dto.factor?.source?.region ?? "",
        // Additional calculated data
        calculatedKgCo2: Number(dto.calculated.calculated_kg_co2),
        calculatedTCo2: Number(dto.calculated.calculated_t_co2),
        calculatedKgCh4: Number(dto.calculated.calculated_kg_ch4),
        calculatedTCh4: Number(dto.calculated.calculated_t_ch4),
        calculatedKgN2o: Number(dto.calculated.calculated_kg_n2o),
        calculatedTN2o: Number(dto.calculated.calculated_t_n2o),
        biogenicKgCo2: dto.calculated.biogenic_kg_co2 ? Number(dto.calculated.biogenic_kg_co2) : null,
        biogenicTCo2: dto.calculated.biogenic_t_co2 ? Number(dto.calculated.biogenic_t_co2) : null,
        calculationMethod: dto.calculated.calculation_method,
        calculationDetails: dto.calculated.calculation_details,
        // Factor data
        factorKgCo2e: dto.factor?.factors?.kg ? Number(dto.factor.factors.kg.kg_co2e) : 0,
        factorKgCo2eOfCo2: dto.factor?.factors?.kg ? Number(dto.factor.factors.kg.kg_co2e_of_co2) : 0,
        factorKgCo2eOfCh4: dto.factor?.factors?.kg ? Number(dto.factor.factors.kg.kg_co2e_of_ch4) : 0,
        factorKgCo2eOfN2o: dto.factor?.factors?.kg ? Number(dto.factor.factors.kg.kg_co2e_of_n2o) : 0,
        factorOtherGhgKgCo2e: dto.factor?.factors?.kg?.other_ghg_kg_co2e
            ? Number(dto.factor.factors.kg.other_ghg_kg_co2e)
            : null,
        factorTCo2e: dto.factor?.factors?.tonnes ? Number(dto.factor.factors.tonnes.t_co2e) : 0,
        factorTCo2eOfCo2: dto.factor?.factors?.tonnes ? Number(dto.factor.factors.tonnes.t_co2e_of_co2) : 0,
        factorTCo2eOfCh4: dto.factor?.factors?.tonnes ? Number(dto.factor.factors.tonnes.t_co2e_of_ch4) : 0,
        factorTCo2eOfN2o: dto.factor?.factors?.tonnes ? Number(dto.factor.factors.tonnes.t_co2e_of_n2o) : 0,
        factorOtherGhgTCo2e: dto.factor?.factors?.tonnes?.other_ghg_t_co2e
            ? Number(dto.factor.factors.tonnes.other_ghg_t_co2e)
            : null,
    };
}

export async function getFuelActivities(filters?: {
    status?: string;
    emission_type?: string;
    facility_id?: string;
    page?: number;
}): Promise<FuelActivity[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.emission_type) params.append("emission_type", filters.emission_type);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.page) params.append("page", String(filters.page));

    const qs = params.toString();
    const url = `/tenant/activity/fuel${qs ? `?${qs}` : "?status=verified"}`;
    const response = await privateApi.get<FuelActivityApiResponse>(url);
    const rawItems = response.data.data?.items ?? [];
    return Array.isArray(rawItems) ? rawItems.map(mapFuelActivityItem) : [];
}

export async function createFuelActivity(payload: Record<string, unknown>) {
    const response = await privateApi.post("/tenant/activity/fuel", payload);
    return response.data;
}

export async function verifyFuelActivity(activityId: string) {
    const response = await privateApi.post(`/tenant/activity/fuel/${activityId}/verify`);
    return response.data;
}

export async function rejectFuelActivity(activityId: string, rejected_reason: string) {
    const response = await privateApi.post(`/tenant/activity/fuel/${activityId}/reject`, {
        rejected_reason,
    });
    return response.data;
}

export async function uploadS3File(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await privateApi.post("/tenant/upload/s3", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const data = response.data?.data;
    if (typeof data === "string") {
        return data;
    }
    return data?.url as string;
}

export async function uploadFuelActivityDocument(activityId: string, payload: Record<string, unknown>) {
    const response = await privateApi.post(`/tenant/activity/fuel/${activityId}/documents`, payload);
    return response.data;
}

function mapElectricityActivityItem(dto: ElectricityActivityItemDto): ElectricityActivity {
    const act = dto.activity ?? dto;
    const ctx = dto.context ?? dto;
    const wf = dto.workflow ?? dto;
    const calc = dto.calculated ?? dto;

    const marketAllocDto = act.market_allocation ?? dto.market_allocation;
    const marketAlloc: MarketAllocation | null = marketAllocDto
        ? {
              contractedElectricityKwh: Number(marketAllocDto.contracted_electricity_kwh || 0),
              contractedElectricityMwh: marketAllocDto.contracted_electricity_mwh != null ? Number(marketAllocDto.contracted_electricity_mwh) : Number(marketAllocDto.contracted_electricity_kwh || 0) / 1000,
              contractedEmissionFactor: Number(marketAllocDto.contracted_emission_factor || 0),
              contractedEmissionFactorUnit: marketAllocDto.contracted_emission_factor_unit || "tco2_per_mwh",
              uncoveredElectricityKwh: marketAllocDto.uncovered_electricity_kwh != null ? Number(marketAllocDto.uncovered_electricity_kwh) : undefined,
              uncoveredElectricityMwh: marketAllocDto.uncovered_electricity_mwh != null ? Number(marketAllocDto.uncovered_electricity_mwh) : undefined,
          }
        : null;

    const certDto = act.market_certificate ?? dto.market_certificate;
    const marketCert: MarketCertificate | null = certDto
        ? {
              serialNumber: certDto.serial_number || undefined,
              dateAcquired: certDto.date_acquired || undefined,
              expirationDate: certDto.expiration_date || undefined,
              quantity: certDto.quantity != null ? Number(certDto.quantity) : undefined,
              certificateReference: certDto.certificate_reference || undefined,
              isRenewableCertified: certDto.is_renewable_certified ?? true,
          }
        : null;

    const peDto = act.purchased_energy ?? dto.purchased_energy;
    const purchasedEnergy: PurchasedEnergy | null = peDto
        ? {
              includePurchasedEnergy: act.include_purchased_energy ?? dto.include_purchased_energy ?? peDto.include_purchased_energy ?? true,
              unit: peDto.unit || "gj",
              steam: peDto.steam != null ? Number(peDto.steam) : undefined,
              heating: peDto.heating != null ? Number(peDto.heating) : undefined,
              cooling: peDto.cooling != null ? Number(peDto.cooling) : undefined,
              steamEmissionFactor: peDto.steam_emission_factor != null ? Number(peDto.steam_emission_factor) : undefined,
              heatingEmissionFactor: peDto.heating_emission_factor != null ? Number(peDto.heating_emission_factor) : undefined,
              coolingEmissionFactor: peDto.cooling_emission_factor != null ? Number(peDto.cooling_emission_factor) : undefined,
              emissionFactorUnit: peDto.emission_factor_unit || "kgco2_per_gj",
          }
        : null;

    return {
        id: dto.id,
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
        facilityId: (ctx as any).facility_id || (dto as any).facility_id || "",
        reportingPeriodId: (ctx as any).reporting_period_id || (dto as any).reporting_period_id || "",
        activityStartDate: (ctx as any).activity_start_date || (dto as any).activity_start_date || "",
        activityEndDate: (ctx as any).activity_end_date || (dto as any).activity_end_date || "",
        scopeType: (act as any).scope_type || "scope_2",
        accountingMethod: (act as any).accounting_method || (dto as any).accounting_method || "location_based",
        electricityActivityType: (act as any).electricity_activity_type || (dto as any).electricity_activity_type || "",
        sourceType: (act as any).source_type || (dto as any).source_type || "",
        electricityKwh: Number((act as any).electricity_kwh ?? (dto as any).electricity_kwh ?? 0),
        electricityMwh: Number((act as any).electricity_mwh ?? (dto as any).electricity_mwh ?? 0),
        sourceFuelActivityId: (act as any).source_fuel_activity_id ?? null,
        supplierName: (act as any).supplier_name ?? (dto as any).supplier_name ?? null,
        isRenewableCertified: Boolean((act as any).is_renewable_certified ?? (dto as any).is_renewable_certified ?? false),
        dataQualityTier: (act as any).data_quality_tier || (dto as any).data_quality_tier || "measured",
        estimationBasis: (act as any).estimation_basis ?? null,
        notes: (act as any).notes ?? (dto as any).notes ?? null,
        workflowStatus: (wf as any).status || dto.workflow_status || dto.status || "pending",
        calculatedTCo2e: (calc as any).calculated_t_co2e != null ? Number((calc as any).calculated_t_co2e) : Number((dto as any).calculated_t_co2e ?? 0),
        calculatedKgCo2e: (calc as any).calculated_kg_co2e != null ? Number((calc as any).calculated_kg_co2e) : Number((dto as any).calculated_kg_co2e ?? 0),
        documentsCount: dto.documents?.count ?? 0,
        factorSourceStandard: dto.factor?.source?.standard ?? null,
        factorSourceVersion: dto.factor?.source?.version ?? null,
        factorSourceRegion: dto.factor?.source?.region ?? null,
        marketAllocation: marketAlloc,
        marketCertificate: marketCert,
        includePurchasedEnergy: Boolean((act as any).include_purchased_energy ?? (dto as any).include_purchased_energy ?? false),
        purchasedEnergy,
        calculationMethod: (calc as any).calculation_method ?? null,
    };
}

export async function getElectricityActivities(filters?: {
    status?: string;
    accounting_method?: string;
    electricity_activity_type?: string;
    data_quality_tier?: string;
    source_type?: string;
    facility_id?: string;
}): Promise<ElectricityActivity[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.accounting_method) params.append("accounting_method", filters.accounting_method);
    if (filters?.electricity_activity_type) {
        params.append("electricity_activity_type", filters.electricity_activity_type);
    }
    if (filters?.data_quality_tier) {
        params.append("data_quality_tier", filters.data_quality_tier);
    }
    if (filters?.source_type) params.append("source_type", filters.source_type);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);

    const qs = params.toString();
    const url = `/tenant/activity/electricity${qs ? `?${qs}` : ""}`;
    const response = await privateApi.get(url);
    const rawItems = response.data.data?.items ?? response.data.data ?? [];
    return Array.isArray(rawItems) ? rawItems.map(mapElectricityActivityItem) : [];
}

export async function createElectricityActivity(payload: Record<string, unknown>) {
    const response = await privateApi.post("/tenant/activity/electricity", payload);
    return response.data;
}

export async function uploadElectricityActivityDocument(activityId: string, payload: Record<string, unknown>) {
    const response = await privateApi.post(`/tenant/activity/electricity/${activityId}/documents`, payload);
    return response.data;
}

