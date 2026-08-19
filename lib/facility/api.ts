import { privateApi } from "@/lib/http/client";
import type { CreateFacilityPayload, Facility, FacilityDto, FacilitiesApiResponse } from "./types";

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

export async function createFacility(payload: CreateFacilityPayload): Promise<Facility> {
    const response = await privateApi.post<FacilitiesApiResponse<FacilityDto>>(
        "/tenant/facility",
        formatCreatePayload(payload),
    );

    const rawData = response.data.data;
    const facilityDto = Array.isArray(rawData) ? rawData[0] : rawData;

    return formatFacility(facilityDto ?? ({} as FacilityDto));
}
