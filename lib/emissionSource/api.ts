import { privateApi } from "@/lib/http/client";

export type EmissionSourceDto = {
    id: string;
    standard: string;
    version: string;
    region: string;
    data_year: number;
    is_active: boolean;
};

export async function getActiveEmissionSources() {
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: EmissionSourceDto[];
    }>("/user/emission-factor-sources/active");

    return response.data.data ?? [];
}
