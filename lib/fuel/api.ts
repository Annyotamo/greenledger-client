import { privateApi } from "@/lib/http/client";

export type FuelCategoryDto = {
    id: string;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
};

export type FuelDto = {
    id: string;
    name: string;
    slug: string;
    category: { id: string; name: string };
    is_active: boolean;
};

export type FuelUnitsDto = {
    id: string;
    name: string;
    symbol: string;
    unit_type: string;
};

export type FuelQueryType = "FUEL" | "REFRIGERANT";

export async function getFuelCategories(type: FuelQueryType = "FUEL", sourceId?: string, wtt: boolean = false) {
    const query = new URLSearchParams({ type });
    if (sourceId) query.append("source_id", sourceId);
    if (wtt !== undefined) query.append("wtt", String(wtt));
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: FuelCategoryDto[];
    }>(`/user/fuel-categories?${query.toString()}`);

    return response.data.data ?? [];
}

export async function getFuels(type: FuelQueryType = "FUEL", categoryId?: string, sourceId?: string) {
    const query = new URLSearchParams({ type });
    if (categoryId) query.append("category_id", categoryId);
    if (sourceId) query.append("source_id", sourceId);
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: FuelDto[];
    }>(`/user/fuels?${query.toString()}`);

    return response.data.data ?? [];
}

export async function getUnitsForFuel(fuelId: string, customFuel?: boolean): Promise<FuelUnitsDto[]> {
    const query = new URLSearchParams();
    if (customFuel) {
        query.append("custom_fuel", "true");
    }
    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: { available_units?: FuelUnitsDto[] } | FuelUnitsDto[];
    }>(`/user/fuels/${fuelId}/units${queryString}`);

    const data = response.data.data;
    if (Array.isArray(data)) {
        return data;
    }
    if (data && typeof data === "object" && "available_units" in data && Array.isArray(data.available_units)) {
        return data.available_units;
    }
    return [];
}

