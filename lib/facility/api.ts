import { privateApi } from "@/lib/http/client";
import type { CreateFacilityPayload, Facility, FacilityDto, FacilitiesApiResponse } from "./types";

function formatFacility(dto: FacilityDto): Facility {
    return {
        id: dto.id,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        tenantId: dto.tenant_id,
        name: dto.name,
        facilityCode: dto.facility_code,
        slug: dto.slug,
        description: dto.description,
        facilityType: dto.facility_type,
        operationalControl: dto.operational_control,
        financialControl: dto.financial_control,
        ownershipPercent: dto.ownership_percent,
        facilityStatus: dto.facility_status,
        country: dto.country,
        state: dto.state,
        city: dto.city,
        addressLine1: dto.address_line_1,
        addressLine2: dto.address_line_2,
        postalCode: dto.postal_code,
        timezone: dto.timezone,
        operationalSince: dto.operational_since,
        operationalUntil: dto.operational_until,
        floorArea: dto.floor_area,
        floorAreaUnit: dto.floor_area_unit,
        employeeCount: dto.employee_count,
        scope1Enabled: dto.scope1_enabled,
        scope2Enabled: dto.scope2_enabled,
        scope3Enabled: dto.scope3_enabled,
        isActive: dto.is_active,
    };
}

function formatCreatePayload(payload: CreateFacilityPayload) {
    return {
        name: payload.name,
        description: payload.description || null,
        facility_code: payload.facilityCode || undefined,
        facility_type: payload.facilityType,
        operational_control: payload.operationalControl,
        financial_control: payload.financialControl,
        ownership_percent: payload.ownershipPercent !== undefined ? Number(payload.ownershipPercent) : 100,
        country: payload.country,
        state: payload.state || null,
        city: payload.city,
        address_line_1: payload.addressLine1,
        address_line_2: payload.addressLine2 || null,
        postal_code: payload.postalCode || null,
        timezone: payload.timezone,
        operational_since: payload.operationalSince || null,
        operational_until: payload.operationalUntil || null,
        floor_area: payload.floorArea ? Number(payload.floorArea) : null,
        floor_area_unit: payload.floorAreaUnit || null,
        employee_count: payload.employeeCount ? Number(payload.employeeCount) : null,
        scope1_enabled: payload.scope1Enabled,
        scope2_enabled: payload.scope2Enabled,
        scope3_enabled: payload.scope3Enabled,
    };
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
