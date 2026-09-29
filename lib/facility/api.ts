import { privateApi } from "@/lib/http/client";
import type {
    CreateFacilityPayload,
    CreateSubUnitPayload,
    Facility,
    FacilityDto,
    FacilitiesApiResponse,
    FacilitySubUnit,
    FacilitySubUnitDto,
    FacilitySubUnitsApiResponse,
    UpdateSubUnitPayload,
} from "./types";

export function formatSubUnit(dto: FacilitySubUnitDto): FacilitySubUnit {
    return {
        id: dto.id || "",
        facilityId: dto.facility_id || "",
        name: dto.name || "",
        subUnitCode: dto.sub_unit_code || "",
        description: dto.description ?? null,
        subUnitType: dto.sub_unit_type || "other",
        status: dto.status || "active",
        floorArea: dto.floor_area != null ? Number(dto.floor_area) : null,
        floorAreaUnit: dto.floor_area_unit ?? null,
        isActive: dto.is_active ?? true,
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
    };
}

function formatFacility(dto: FacilityDto): Facility {
    return {
        id: dto.id || "",
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
        tenantId: dto.tenant_id || "",
        name: dto.name || "",
        facilityCode: dto.facility_code || "",
        slug: dto.slug || "",
        description: dto.description ?? null,
        facilityType: dto.facility_type || "",
        operationalControl: dto.operational_control ?? true,
        financialControl: dto.financial_control ?? false,
        ownershipPercent: dto.ownership_percent ?? 100,
        facilityStatus: dto.facility_status || "active",
        country: dto.country || "",
        state: dto.state ?? null,
        city: dto.city || "",
        addressLine1: dto.address_line_1 || "",
        addressLine2: dto.address_line_2 ?? null,
        postalCode: dto.postal_code ?? null,
        timezone: dto.timezone || "UTC",
        operationalSince: dto.operational_since ?? null,
        operationalUntil: dto.operational_until ?? null,
        floorArea: dto.floor_area ?? null,
        floorAreaUnit: dto.floor_area_unit ?? null,
        employeeCount: dto.employee_count ?? null,
        scope1Enabled: dto.scope1_enabled ?? true,
        scope2Enabled: dto.scope2_enabled ?? true,
        scope3Enabled: dto.scope3_enabled ?? true,
        isActive: dto.is_active ?? true,
        subUnits: Array.isArray(dto.sub_units) ? dto.sub_units.map(formatSubUnit) : undefined,
    };
}

function formatCreatePayload(payload: CreateFacilityPayload) {
    const body: Record<string, unknown> = {
        name: payload.name,
        facility_type: payload.facilityType,
        country: payload.country,
        city: payload.city,
        address_line_1: payload.addressLine1,
    };

    if (payload.facilityCode) body.facility_code = payload.facilityCode;
    if (payload.description !== undefined && payload.description !== null && payload.description.trim() !== "") {
        body.description = payload.description;
    }
    if (payload.ownershipPercent !== undefined && payload.ownershipPercent !== null && payload.ownershipPercent !== "") {
        body.ownership_percent = Number(payload.ownershipPercent);
    }
    if (payload.state !== undefined && payload.state !== null && payload.state.trim() !== "") {
        body.state = payload.state;
    }
    if (payload.addressLine2 !== undefined && payload.addressLine2 !== null && payload.addressLine2.trim() !== "") {
        body.address_line_2 = payload.addressLine2;
    }
    if (payload.postalCode !== undefined && payload.postalCode !== null && payload.postalCode.trim() !== "") {
        body.postal_code = payload.postalCode;
    }
    if (payload.timezone) body.timezone = payload.timezone;
    if (payload.operationalSince !== undefined && payload.operationalSince !== null && payload.operationalSince.trim() !== "") {
        body.operational_since = payload.operationalSince;
    }
    if (payload.operationalUntil !== undefined && payload.operationalUntil !== null && payload.operationalUntil.trim() !== "") {
        body.operational_until = payload.operationalUntil;
    } else if (payload.operationalUntil === null) {
        body.operational_until = null;
    }
    if (payload.floorArea !== undefined && payload.floorArea !== null && payload.floorArea !== "") {
        body.floor_area = Number(payload.floorArea);
    }
    if (payload.floorAreaUnit !== undefined && payload.floorAreaUnit !== null && payload.floorAreaUnit.trim() !== "") {
        body.floor_area_unit = payload.floorAreaUnit;
    }
    if (payload.employeeCount !== undefined && payload.employeeCount !== null && payload.employeeCount !== "") {
        body.employee_count = Number(payload.employeeCount);
    }
    if (payload.scope1Enabled !== undefined) body.scope1_enabled = payload.scope1Enabled;
    if (payload.scope2Enabled !== undefined) body.scope2_enabled = payload.scope2Enabled;
    if (payload.scope3Enabled !== undefined) body.scope3_enabled = payload.scope3Enabled;

    return body;
}

export async function getFacilities(): Promise<Facility[]> {
    const response = await privateApi.get<FacilitiesApiResponse>("/tenant/facility");
    return Array.isArray(response.data.data) ? response.data.data.map(formatFacility) : [];
}

export async function getFacilityById(facilityId: string): Promise<Facility> {
    const response = await privateApi.get<FacilitiesApiResponse<FacilityDto>>(`/tenant/facility/${facilityId}`);
    const rawData = response.data.data;
    const facilityDto = Array.isArray(rawData) ? rawData[0] : rawData;
    return formatFacility(facilityDto ?? ({} as FacilityDto));
}

export async function createFacility(payload: CreateFacilityPayload): Promise<Facility> {
    const response = await privateApi.post<FacilitiesApiResponse<FacilityDto>>(
        "/tenant/facility",
        formatCreatePayload(payload),
    );

    const rawData = response.data.data;
    const facilityDto = Array.isArray(rawData) ? rawData[0] : rawData;

    return formatFacility(facilityDto ?? ({} as FacilityDto));
}

export async function getSubUnits(
    facilityId: string,
    filters?: {
        active_only?: boolean;
        sub_unit_type?: string;
        status?: string;
    }
): Promise<FacilitySubUnit[]> {
    if (!facilityId) return [];
    const params = new URLSearchParams();
    if (filters?.active_only !== undefined) params.append("active_only", String(filters.active_only));
    if (filters?.sub_unit_type) params.append("sub_unit_type", filters.sub_unit_type);
    if (filters?.status) params.append("status", filters.status);

    const qs = params.toString();
    const url = `/tenant/facility/${facilityId}/sub-units${qs ? `?${qs}` : ""}`;
    const response = await privateApi.get<FacilitySubUnitsApiResponse>(url);
    const rawData = response.data?.data;
    return Array.isArray(rawData) ? rawData.map(formatSubUnit) : [];
}

export async function getSubUnitById(facilityId: string, subUnitId: string): Promise<FacilitySubUnit> {
    const response = await privateApi.get<FacilitySubUnitsApiResponse<FacilitySubUnitDto>>(
        `/tenant/facility/${facilityId}/sub-units/${subUnitId}`
    );
    const rawData = response.data?.data;
    const dto = Array.isArray(rawData) ? rawData[0] : rawData;
    return formatSubUnit(dto ?? ({} as FacilitySubUnitDto));
}

export async function createSubUnit(facilityId: string, payload: CreateSubUnitPayload): Promise<FacilitySubUnit> {
    const body: Record<string, unknown> = {
        name: payload.name,
        sub_unit_type: payload.sub_unit_type,
    };
    if (payload.sub_unit_code?.trim()) body.sub_unit_code = payload.sub_unit_code.trim();
    if (payload.description?.trim()) body.description = payload.description.trim();
    if (payload.floor_area !== undefined && payload.floor_area !== null && payload.floor_area !== "") {
        body.floor_area = Number(payload.floor_area);
    }
    if (payload.floor_area_unit?.trim()) body.floor_area_unit = payload.floor_area_unit.trim();

    const response = await privateApi.post<FacilitySubUnitsApiResponse<FacilitySubUnitDto>>(
        `/tenant/facility/${facilityId}/sub-units`,
        body
    );
    const rawData = response.data?.data;
    const dto = Array.isArray(rawData) ? rawData[0] : rawData;
    return formatSubUnit(dto ?? ({} as FacilitySubUnitDto));
}

export async function updateSubUnit(
    facilityId: string,
    subUnitId: string,
    payload: UpdateSubUnitPayload
): Promise<FacilitySubUnit> {
    const body: Record<string, unknown> = {};
    if (payload.name !== undefined) body.name = payload.name;
    if (payload.sub_unit_code !== undefined) body.sub_unit_code = payload.sub_unit_code;
    if (payload.sub_unit_type !== undefined) body.sub_unit_type = payload.sub_unit_type;
    if (payload.status !== undefined) body.status = payload.status;
    if (payload.description !== undefined) body.description = payload.description;
    if (payload.floor_area !== undefined && payload.floor_area !== null && payload.floor_area !== "") {
        body.floor_area = Number(payload.floor_area);
    } else if (payload.floor_area === null) {
        body.floor_area = null;
    }
    if (payload.floor_area_unit !== undefined) body.floor_area_unit = payload.floor_area_unit;
    if (payload.is_active !== undefined) body.is_active = payload.is_active;

    const response = await privateApi.patch<FacilitySubUnitsApiResponse<FacilitySubUnitDto>>(
        `/tenant/facility/${facilityId}/sub-units/${subUnitId}`,
        body
    );
    const rawData = response.data?.data;
    const dto = Array.isArray(rawData) ? rawData[0] : rawData;
    return formatSubUnit(dto ?? ({} as FacilitySubUnitDto));
}

export async function deleteSubUnit(
    facilityId: string,
    subUnitId: string
): Promise<{ id: string; is_active: boolean; status: string }> {
    const response = await privateApi.delete(`/tenant/facility/${facilityId}/sub-units/${subUnitId}`);
    return response.data?.data ?? response.data;
}

