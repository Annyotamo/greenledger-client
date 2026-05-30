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

export async function getFuelCategories() {
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: FuelCategoryDto[];
    }>("/user/fuel-categories");

    return response.data.data ?? [];
}

export async function getFuelsByCategory(categoryId: string) {
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: FuelDto[];
    }>(`/user/fuels?category_id=${categoryId}`);

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
