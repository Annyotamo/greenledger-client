import { privateApi } from "@/lib/http/client";

export type TotalCarbonInput = {
    carbon_percentage: number | null;
    carbon_content: number | null;
    carbon_content_unit: string | null;
};

export type FixedCarbonInput = {
    as_received_basis: number | null;
    dry_basis: number | null;
    total_moisture_percentage: number | null;
};

export type FuelPropertiesInput = {
    gcv: number | null;
    heat_content_unit: string | null;
    ncv: number | null;
    hydrogen_percentage: number | null;
    moisture_percentage: number | null;
    total_carbon: TotalCarbonInput;
    fixed_carbon: FixedCarbonInput;
    oxidation_factor: number | null;
    lab_report: string | null;
};

export type CreateCustomFuelPayload = {
    name: string;
    source_id: string;
    category_id: string;
    description?: string;
    fuel_properties: FuelPropertiesInput;
};

export type CustomFuelDto = {
    id: string;
    tenant_id?: string;
    name: string;
    source_id: string;
    category_id: string;
    description?: string;
    default_fuel_id?: string;
    is_active?: boolean;
    fuel_properties: {
        gcv?: string | number | null;
        ncv?: string | number | null;
        heat_content_unit?: string | null;
        hydrogen_percentage?: string | number | null;
        moisture_percentage?: string | number | null;
        total_carbon?: {
            carbon_content?: string | number | null;
            carbon_percentage?: string | number | null;
            carbon_content_unit?: string | null;
        };
        fixed_carbon?: {
            as_received_basis?: string | number | null;
            dry_basis?: string | number | null;
            total_moisture_percentage?: string | number | null;
        };
        oxidation_factor?: string | number | null;
        lab_report?: string | null;
    };
};

export async function getCustomFuels(sourceId?: string) {
    const query = sourceId ? `?source_id=${sourceId}` : "";
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: CustomFuelDto[];
    }>(`/tenant/custom-fuels${query}`);

    return response.data.data ?? [];
}

export async function createCustomFuel(payload: CreateCustomFuelPayload) {
    const response = await privateApi.post<{
        success: boolean;
        status_code: number;
        message: string;
        data: CustomFuelDto;
    }>("/tenant/custom-fuels", payload);

    return response.data;
}

export async function updateCustomFuel(customFuelId: string, payload: CreateCustomFuelPayload) {
    const response = await privateApi.put<{
        success: boolean;
        status_code: number;
        message: string;
        data: CustomFuelDto;
    }>(`/tenant/custom-fuels/${customFuelId}`, payload);

    return response.data;
}

export type CustomFuelUnitDto = {
    id: string;
    name: string;
    symbol: string;
    unit_type: string;
};

export async function getCustomFuelUnits(): Promise<CustomFuelUnitDto[]> {
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: CustomFuelUnitDto[];
    }>("/user/custom-fuels/units");

    return response.data.data ?? [];
}

