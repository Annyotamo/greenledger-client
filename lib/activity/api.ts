import { privateApi } from "@/lib/http/client";
import type { FuelActivity, FuelActivityApiResponse, FuelActivityItemDto } from "./types";
import type {
    ElectricityActivity,
    ElectricityActivityItemDto,
    MarketAllocation,
    MarketCertificate,
    PurchasedEnergy,
} from "./electricityTypes";

function mapFuelActivityItem(dto: any): FuelActivity {
    const ctx = dto.context || {};
    const act = dto.activity || {};
    const wf = dto.workflow || {};
    const calc = dto.calculated || {};
    const fac = dto.factor || {};
    const docs = dto.documents || {};

    const fuelObj = act.fuel || fac.fuel || {};
    const unitObj = dto.quantity_unit || act.quantity_unit || fac.unit || {};

    return {
        id: dto.id,
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
        facilityId: ctx.facility_id || ctx.facility?.id || "",
        facilityName: ctx.facility?.name,
        facilityCode: ctx.facility?.facility_code,
        facilityCity: ctx.facility?.city,
        facilityCountry: ctx.facility?.country,
        reportingPeriodId: ctx.reporting_period_id || ctx.reporting_period?.id || "",
        reportingPeriodName: ctx.reporting_period?.name,
        periodStatus: ctx.reporting_period?.period_status,
        periodStartDate: ctx.reporting_period?.period_start || ctx.reporting_period?.start_date,
        periodEndDate: ctx.reporting_period?.period_end || ctx.reporting_period?.end_date,
        meterId: ctx.meter_id || null,
        activityStartDate: ctx.activity_start_date || "",
        activityEndDate: ctx.activity_end_date || "",
        scopeType: act.scope_type || "SCOPE_1",
        fuelId: act.fuel_id || act.custom_fuel_id || fuelObj.id || "",
        fuelName: fuelObj.name || fac.fuel?.name || "Custom Fuel",
        fuelSlug: fuelObj.slug || fac.fuel?.slug || "",
        fuelIsRenewable: fuelObj.renewable ?? fac.fuel?.renewable ?? false,
        fuelFactorType: fuelObj.factor_type ?? fac.fuel?.factor_type ?? "COMBUSTION",
        quantity: Number(act.quantity || 0),
        quantityUnitId: act.quantity_unit_id || unitObj.id || "",
        unitName: unitObj.name || "",
        unitSymbol: unitObj.symbol || "",
        unitType: unitObj.unit_type || "energy",
        usageType: act.usage_type || undefined,
        emissionType: act.emission_type || "stationary",
        cost: act.cost ? Number(act.cost) : null,
        energyContentGJ: act.energy_content_gj ? Number(act.energy_content_gj) : 0,
        generatorEfficiencyPercentage: act.generator_efficiency_percentage ? Number(act.generator_efficiency_percentage) : 0,
        generatedElectricityKwh: act.generated_electricity_kwh ? Number(act.generated_electricity_kwh) : 0,
        generatedElectricityMwh: act.generated_electricity_mwh ? Number(act.generated_electricity_mwh) : 0,
        generatedSteamGJ: act.generated_steam_gj ? Number(act.generated_steam_gj) : null,
        dataQualityTier: act.data_quality_tier || "measured",
        estimationBasis: act.estimation_basis || null,
        notes: act.notes || null,
        workflowStatus: wf.status || "draft",
        rejectedReason: wf.rejected_reason || null,
        verifiedBy: wf.verified_by || null,
        verifiedAt: wf.verified_at || null,
        enteredBy: wf.entered_by || null,
        isAmendment: wf.is_amendment || false,
        sourceReferenceCode: fac.source_reference_code || fac.source?.reference_code || null,
        calculatedTCo2e: Number(calc.calculated_t_co2e || 0),
        calculatedKgCo2e: Number(calc.calculated_kg_co2e || 0),
        documentsCount: docs.count || (Array.isArray(docs.items) ? docs.items.length : 0),
        attachedDocuments: Array.isArray(docs.items) ? docs.items : undefined,
        fuelFactorStandard: fac.source?.standard || fac.source_reference_code || "",
        fuelFactorVersion: fac.source?.version || "",
        fuelFactorRegion: fac.source?.region || "",
        factorDataYear: fac.source?.data_year || null,
        factorEmissionUnit: fac.source?.emission_unit || "kg",
        calculatedKgCo2: Number(calc.calculated_kg_co2 || 0),
        calculatedTCo2: Number(calc.calculated_t_co2 || 0),
        calculatedKgCh4: Number(calc.calculated_kg_ch4 || 0),
        calculatedTCh4: Number(calc.calculated_t_ch4 || 0),
        calculatedKgN2o: Number(calc.calculated_kg_n2o || 0),
        calculatedTN2o: Number(calc.calculated_t_n2o || 0),
        biogenicKgCo2: calc.biogenic_kg_co2 ? Number(calc.biogenic_kg_co2) : null,
        biogenicTCo2: calc.biogenic_t_co2 ? Number(calc.biogenic_t_co2) : null,
        calculationMethod: calc.calculation_method || null,
        calculationDetails: calc.calculation_details || null,
        factorKgCo2e: fac.factors?.kg ? Number(fac.factors.kg.kg_co2e) : 0,
        factorKgCo2eOfCo2: fac.factors?.kg ? Number(fac.factors.kg.kg_co2e_of_co2) : 0,
        factorKgCo2eOfCh4: fac.factors?.kg ? Number(fac.factors.kg.kg_co2e_of_ch4) : 0,
        factorKgCo2eOfN2o: fac.factors?.kg ? Number(fac.factors.kg.kg_co2e_of_n2o) : 0,
        factorOtherGhgKgCo2e: fac.factors?.kg?.other_ghg_kg_co2e ? Number(fac.factors.kg.other_ghg_kg_co2e) : null,
        factorTCo2e: fac.factors?.tonnes ? Number(fac.factors.tonnes.t_co2e) : 0,
        factorTCo2eOfCo2: fac.factors?.tonnes ? Number(fac.factors.tonnes.t_co2e_of_co2) : 0,
        factorTCo2eOfCh4: fac.factors?.tonnes ? Number(fac.factors.tonnes.t_co2e_of_ch4) : 0,
        factorTCo2eOfN2o: fac.factors?.tonnes ? Number(fac.factors.tonnes.t_co2e_of_n2o) : 0,
        factorOtherGhgTCo2e: fac.factors?.tonnes?.other_ghg_t_co2e ? Number(fac.factors.tonnes.other_ghg_t_co2e) : null,
    };
}

export async function getFuelActivities(filters?: {
    status?: string;
    emission_type?: string;
    facility_id?: string;
    reporting_period_id?: string;
    meter_id?: string;
    fuel_id?: string;
    data_quality_tier?: string;
    activity_start_date?: string;
    activity_end_date?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: string;
}): Promise<FuelActivity[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status.toUpperCase());
    if (filters?.emission_type) params.append("emission_type", filters.emission_type.toUpperCase());
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.reporting_period_id) params.append("reporting_period_id", filters.reporting_period_id);
    if (filters?.meter_id) params.append("meter_id", filters.meter_id);
    if (filters?.fuel_id) params.append("fuel_id", filters.fuel_id);
    if (filters?.data_quality_tier) params.append("data_quality_tier", filters.data_quality_tier);
    if (filters?.activity_start_date) params.append("activity_start_date", filters.activity_start_date);
    if (filters?.activity_end_date) params.append("activity_end_date", filters.activity_end_date);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));
    if (filters?.sort_by) params.append("sort_by", filters.sort_by);
    if (filters?.sort_order) params.append("sort_order", filters.sort_order);

    const qs = params.toString();
    const url = `/tenant/activity/fuel${qs ? `?${qs}` : ""}`;
    const response = await privateApi.get<FuelActivityApiResponse>(url);
    const rawItems = response.data.data?.items ?? response.data.data ?? [];
    return Array.isArray(rawItems) ? rawItems.map(mapFuelActivityItem) : [];
}

export async function getFuelActivityById(activityId: string): Promise<FuelActivity> {
    const response = await privateApi.get(`/tenant/activity/fuel/${activityId}`);
    const data = response.data?.data ?? response.data;
    return mapFuelActivityItem(data);
}

export async function createFuelActivity(payload: Record<string, unknown>) {
    const response = await privateApi.post("/tenant/activity/fuel", payload);
    return response.data;
}

export async function updateFuelActivity(activityId: string, payload: Record<string, unknown>) {
    const response = await privateApi.patch(`/tenant/activity/fuel/${activityId}`, payload);
    return response.data;
}

export async function deleteFuelActivity(activityId: string) {
    const response = await privateApi.delete(`/tenant/activity/fuel/${activityId}`);
    return response.data;
}

export async function submitFuelActivity(activityId: string) {
    const response = await privateApi.post(`/tenant/activity/fuel/${activityId}/submit`);
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

export async function amendFuelActivity(activityId: string, payload: Record<string, unknown>) {
    const response = await privateApi.post(`/tenant/activity/fuel/${activityId}/amend`, payload);
    return response.data;
}

export async function getFuelActivityDocuments(activityId: string) {
    const response = await privateApi.get(`/tenant/activity/fuel/${activityId}/documents`);
    return response.data?.data ?? response.data;
}

export async function presignFuelActivityDocumentUrl(activityId: string, payload: { document_name: string; document_type: string }) {
    const response = await privateApi.post(`/tenant/activity/fuel/${activityId}/documents/presign`, payload);
    return response.data?.data ?? response.data;
}

export async function deleteFuelActivityDocument(activityId: string, documentId: string) {
    const response = await privateApi.delete(`/tenant/activity/fuel/${activityId}/documents/${documentId}`);
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

