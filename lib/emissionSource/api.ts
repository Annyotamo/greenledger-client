import { privateApi } from "@/lib/http/client";

export type EmissionSourceDto = {
    id: string;
    standard: string;
    version: string;
    region: string;
    type?: string;
    data_year?: number;
    is_active?: boolean;
    emission_unit?: string;
    tablename?: string;
};

export async function getActiveEmissionSources(type?: string) {
    const query = type ? `?type=${type}` : "";
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: EmissionSourceDto[];
    }>(`/user/emission-factor-sources/active${query}`);

    return response.data.data ?? [];
}

