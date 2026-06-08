import { privateApi } from "@/lib/http/client";
import type { FuelActivity, FuelActivityApiResponse, FuelActivityItemDto } from "./types";

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
        fuelId: dto.activity.fuel_id,
        fuelName: dto.factor.fuel.name,
        fuelSlug: dto.factor.fuel.slug,
        quantity: Number(dto.activity.quantity),
        quantityUnitId: dto.activity.quantity_unit_id,
        unitName: dto.factor.unit.name,
        unitSymbol: dto.factor.unit.symbol,
        usageType: dto.activity.usage_type,
        emissionType: dto.activity.emission_type,
        energyContentGJ: Number(dto.activity.energy_content_gj),
        generatorEfficiencyPercentage: Number(dto.activity.generator_efficiency_percentage),
        generatedElectricityKwh: Number(dto.activity.generated_electricity_kwh),
        generatedElectricityMwh: Number(dto.activity.generated_electricity_mwh),
        generatedSteamGJ: dto.activity.generated_steam_gj ? Number(dto.activity.generated_steam_gj) : null,
        dataQualityTier: dto.activity.data_quality_tier,
        estimationBasis: dto.activity.estimation_basis,
        notes: dto.activity.notes,
        workflowStatus: dto.workflow.status,
        calculatedTCo2e: Number(dto.calculated.calculated_t_co2e),
        calculatedKgCo2e: Number(dto.calculated.calculated_kg_co2e),
        documentsCount: dto.documents.count,
        fuelFactorStandard: dto.factor.source.standard,
        fuelFactorVersion: dto.factor.source.version,
        fuelFactorRegion: dto.factor.source.region,
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
        factorKgCo2e: Number(dto.factor.factors.kg.kg_co2e),
        factorKgCo2eOfCo2: Number(dto.factor.factors.kg.kg_co2e_of_co2),
        factorKgCo2eOfCh4: Number(dto.factor.factors.kg.kg_co2e_of_ch4),
        factorKgCo2eOfN2o: Number(dto.factor.factors.kg.kg_co2e_of_n2o),
        factorOtherGhgKgCo2e: dto.factor.factors.kg.other_ghg_kg_co2e
            ? Number(dto.factor.factors.kg.other_ghg_kg_co2e)
            : null,
        factorTCo2e: Number(dto.factor.factors.tonnes.t_co2e),
        factorTCo2eOfCo2: Number(dto.factor.factors.tonnes.t_co2e_of_co2),
        factorTCo2eOfCh4: Number(dto.factor.factors.tonnes.t_co2e_of_ch4),
        factorTCo2eOfN2o: Number(dto.factor.factors.tonnes.t_co2e_of_n2o),
        factorOtherGhgTCo2e: dto.factor.factors.tonnes.other_ghg_t_co2e
            ? Number(dto.factor.factors.tonnes.other_ghg_t_co2e)
            : null,
    };
}

export async function getFuelActivities(filters?: {
    status?: string;
    usage_type?: string;
    emission_type?: string;
    facility_id?: string;
    page?: number;
}): Promise<FuelActivity[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.usage_type) params.append("usage_type", filters.usage_type);
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

    return response.data.data?.url as string;
}

export async function uploadFuelActivityDocument(activityId: string, payload: Record<string, unknown>) {
    const response = await privateApi.post(`/tenant/activity/fuel/${activityId}/documents`, payload);
    return response.data;
}

function mapElectricityActivityItem(dto: any) {
    return {
        id: dto.id,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        facilityId: dto.context.facility_id,
        reportingPeriodId: dto.context.reporting_period_id,
        activityStartDate: dto.context.activity_start_date,
        activityEndDate: dto.context.activity_end_date,
        scopeType: dto.activity.scope_type,
        electricityActivityType: dto.activity.electricity_activity_type,
        sourceType: dto.activity.source_type,
        electricityKwh: Number(dto.activity.electricity_kwh),
        electricityMwh: Number(dto.activity.electricity_mwh),
        sourceFuelActivityId: dto.activity.source_fuel_activity_id,
        supplierName: dto.activity.supplier_name,
        isRenewableCertified: dto.activity.is_renewable_certified,
        dataQualityTier: dto.activity.data_quality_tier,
        estimationBasis: dto.activity.estimation_basis,
        notes: dto.activity.notes,
        workflowStatus: dto.workflow.status,
        calculatedTCo2e: dto.calculated ? Number(dto.calculated.calculated_t_co2e) : 0,
        calculatedKgCo2e: dto.calculated ? Number(dto.calculated.calculated_kg_co2e) : 0,
        documentsCount: dto.documents.count,
        factorSourceStandard: dto.factor?.source?.standard ?? null,
        factorSourceVersion: dto.factor?.source?.version ?? null,
        factorSourceRegion: dto.factor?.source?.region ?? null,
    };
}

export async function getElectricityActivities(filters?: {
    status?: string;
    electricity_activity_type?: string;
    data_quality_tier?: string;
    source_type?: string;
    facility_id?: string;
}) {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
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
    const rawItems = response.data.data?.items ?? [];
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
