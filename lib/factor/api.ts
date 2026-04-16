import { privateApi } from "@/lib/http/client";
import type { AddFactorRequest, AddFactorResponse } from "@/types/factor";

export async function addFactor(payload: AddFactorRequest): Promise<AddFactorResponse["data"]> {
    const { data } = await privateApi.post<AddFactorResponse>("/factor/addFactor", payload);
    return data.data;
}
