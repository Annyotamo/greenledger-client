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

export async function getFuelCategories(type: FuelQueryType = "FUEL") {
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: FuelCategoryDto[];
    }>(`/user/fuel-categories?type=${type}`);

    return response.data.data ?? [];
}

export async function getFuels(type: FuelQueryType = "FUEL", categoryId?: string) {
    const query = new URLSearchParams({ type });
    if (categoryId) query.append("category_id", categoryId);
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: FuelDto[];
    }>(`/user/fuels?${query.toString()}`);

    return response.data.data ?? [];
}

export async function getUnitsForFuel(fuelId: string) {
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: { available_units: FuelUnitsDto[] } | { available_units?: FuelUnitsDto[] } | any;
    }>(`/user/fuels/${fuelId}/units`);

    // API returns object with available_units inside data
    return response.data.data?.available_units ?? response.data.data ?? [];
}
