import { privateApi } from "@/lib/http/client";
import type {
    CBAMApiResponse,
    CBAMCalculatePreviewPayload,
    CBAMCalculatePreviewResponse,
    CBAMCategory,
    CBAMCNDetails,
    CBAMCountriesResponse,
    CBAMCountry,
    CBAMIPCCFuel,
    CBAMInstallationProfile,
    CBAMProductNamesResponse,
    CBAMProductionRoutesResponse,
    CBAMSourceStream,
    CBAMSourceStreamsSummary,
    CBAMSpecificationsResponse,
    CreateCBAMInstallationPayload,
    CreateCBAMSourceStreamPayload,
} from "./types";

// ==========================================
// SECTION 1: MASTER CATALOG & DROPDOWNS
// ==========================================

export async function getCbamCategories(sector?: string): Promise<CBAMCategory[]> {
    const params = sector ? { sector } : undefined;
    const res = await privateApi.get<CBAMApiResponse<CBAMCategory[]>>("/tenant/cbam/catalog/categories", { params });
    return res.data.data || [];
}

export async function getCbamCategoryDetail(categoryId: string): Promise<CBAMCategory | null> {
    if (!categoryId) return null;
    const res = await privateApi.get<CBAMApiResponse<CBAMCategory>>(`/tenant/cbam/catalog/categories/${categoryId}`);
    return res.data.data || null;
}

export async function getCbamProductionRoutes(categoryId: string): Promise<string[]> {
    if (!categoryId) return [];
    const res = await privateApi.get<CBAMApiResponse<CBAMProductionRoutesResponse>>(
        `/tenant/cbam/catalog/categories/${categoryId}/routes`,
    );
    return res.data.data?.production_routes || [];
}

export async function getCbamProductNames(categoryId: string): Promise<string[]> {
    if (!categoryId) return [];
    const res = await privateApi.get<CBAMApiResponse<CBAMProductNamesResponse>>(
        `/tenant/cbam/catalog/categories/${categoryId}/product-names`,
    );
    return res.data.data?.product_names || [];
}

export async function getCbamSpecifications(categoryId: string, productName: string): Promise<CBAMCNDetails[]> {
    if (!categoryId || !productName) return [];
    const res = await privateApi.get<CBAMApiResponse<CBAMSpecificationsResponse>>(
        `/tenant/cbam/catalog/categories/${categoryId}/specifications`,
        { params: { product_name: productName } },
    );
    return res.data.data?.specifications || [];
}

export async function getCbamCnCodes(params?: {
    category_id?: string;
    search?: string;
    limit?: number;
    offset?: number;
}): Promise<CBAMCNDetails[]> {
    const res = await privateApi.get<CBAMApiResponse<CBAMCNDetails[]>>("/tenant/cbam/catalog/cn-codes", { params });
    return res.data.data || [];
}

export async function getCbamCnCodeDetail(cnCode: string): Promise<CBAMCNDetails | null> {
    if (!cnCode) return null;
    const res = await privateApi.get<CBAMApiResponse<CBAMCNDetails>>(`/tenant/cbam/catalog/cn-codes/${cnCode}`);
    return res.data.data || null;
}

export async function getCbamCountries(search?: string): Promise<CBAMCountry[]> {
    const params = search ? { search } : undefined;
    const res = await privateApi.get<CBAMApiResponse<CBAMCountriesResponse>>("/tenant/cbam/catalog/countries", { params });
    return res.data.data?.countries || [];
}

export async function getCbamIpccFuels(search?: string): Promise<CBAMIPCCFuel[]> {
    const params = search ? { search } : undefined;
    const res = await privateApi.get<CBAMApiResponse<CBAMIPCCFuel[]>>("/tenant/cbam/catalog/ipcc-fuels", { params });
    return res.data.data || [];
}

// ==========================================
// SECTION 2: INSTALLATION SETUP (Sheet A_InstData)
// ==========================================

export async function getActiveCbamInstallation(): Promise<CBAMInstallationProfile | null> {
    try {
        const res = await privateApi.get<CBAMApiResponse<CBAMInstallationProfile>>("/tenant/cbam/installation");
        return res.data.data || null;
    } catch (err: unknown) {
        // If 404, tenant hasn't created an installation profile yet
        return null;
    }
}

export async function getCbamInstallationById(id: string): Promise<CBAMInstallationProfile | null> {
    if (!id) return null;
    const res = await privateApi.get<CBAMApiResponse<CBAMInstallationProfile>>(`/tenant/cbam/installation/${id}`);
    return res.data.data || null;
}

export async function createCbamInstallation(payload: CreateCBAMInstallationPayload): Promise<CBAMInstallationProfile> {
    const res = await privateApi.post<CBAMApiResponse<CBAMInstallationProfile>>("/tenant/cbam/installation", payload);
    return res.data.data;
}

export async function updateCbamInstallation(
    id: string,
    payload: Partial<CreateCBAMInstallationPayload>,
): Promise<CBAMInstallationProfile> {
    const res = await privateApi.put<CBAMApiResponse<CBAMInstallationProfile>>(`/tenant/cbam/installation/${id}`, payload);
    return res.data.data;
}

export async function downloadCbamExcelExport(installationId: string, filename?: string): Promise<void> {
    const res = await privateApi.get(`/tenant/cbam/installation/${installationId}/export-excel`, {
        responseType: "blob",
    });

    const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || `CBAM_SEE_Communication_${installationId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// ==========================================
// SECTION 3: SOURCE STREAMS & EMISSIONS (Sheet B_EmInst)
// ==========================================

export async function getCbamSourceStreams(installationId: string): Promise<CBAMSourceStream[]> {
    if (!installationId) return [];
    const res = await privateApi.get<CBAMApiResponse<CBAMSourceStream[]>>(
        `/tenant/cbam/installation/${installationId}/source-streams`,
    );
    return res.data.data || [];
}

export async function createCbamSourceStream(
    installationId: string,
    payload: CreateCBAMSourceStreamPayload,
): Promise<CBAMSourceStream> {
    const res = await privateApi.post<CBAMApiResponse<CBAMSourceStream>>(
        `/tenant/cbam/installation/${installationId}/source-streams`,
        payload,
    );
    return res.data.data;
}

export async function bulkSaveCbamSourceStreams(
    installationId: string,
    streams: CreateCBAMSourceStreamPayload[],
): Promise<CBAMSourceStream[]> {
    const res = await privateApi.post<CBAMApiResponse<CBAMSourceStream[]>>(
        `/tenant/cbam/installation/${installationId}/source-streams/bulk`,
        { streams },
    );
    return res.data.data || [];
}

export async function calculateCbamPreview(
    installationId: string,
    payload: CBAMCalculatePreviewPayload,
): Promise<CBAMCalculatePreviewResponse> {
    const res = await privateApi.post<CBAMApiResponse<CBAMCalculatePreviewResponse>>(
        `/tenant/cbam/installation/${installationId}/source-streams/calculate-preview`,
        payload,
    );
    return res.data.data;
}

export async function getCbamSourceStreamsSummary(installationId: string): Promise<CBAMSourceStreamsSummary | null> {
    if (!installationId) return null;
    const res = await privateApi.get<CBAMApiResponse<CBAMSourceStreamsSummary>>(
        `/tenant/cbam/installation/${installationId}/source-streams/summary`,
    );
    return res.data.data || null;
}

export async function getCbamSourceStreamDetail(
    installationId: string,
    streamId: string,
): Promise<CBAMSourceStream | null> {
    if (!installationId || !streamId) return null;
    const res = await privateApi.get<CBAMApiResponse<CBAMSourceStream>>(
        `/tenant/cbam/installation/${installationId}/source-streams/${streamId}`,
    );
    return res.data.data || null;
}

export async function updateCbamSourceStream(
    installationId: string,
    streamId: string,
    payload: Partial<CreateCBAMSourceStreamPayload>,
): Promise<CBAMSourceStream> {
    const res = await privateApi.put<CBAMApiResponse<CBAMSourceStream>>(
        `/tenant/cbam/installation/${installationId}/source-streams/${streamId}`,
        payload,
    );
    return res.data.data;
}

export async function deleteCbamSourceStream(installationId: string, streamId: string): Promise<void> {
    await privateApi.delete(`/tenant/cbam/installation/${installationId}/source-streams/${streamId}`);
}
