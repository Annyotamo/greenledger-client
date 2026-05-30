export type FacilityDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
    name: string;
    facility_code: string;
    slug: string;
    description: string;
    facility_type: string;
    ownership_type: string;
    facility_status: string;
    country: string;
    state: string;
    city: string;
    address_line_1: string;
    address_line_2: string;
    postal_code: string;
    timezone: string;
    operational_since: string;
    operational_until: string;
    floor_area: string;
    floor_area_unit: string;
    employee_count: number;
    scope1_enabled: boolean;
    scope2_enabled: boolean;
    scope3_enabled: boolean;
    is_active: boolean;
};

export type Facility = {
    id: string;
    createdAt: string;
    updatedAt: string;
    tenantId: string;
    name: string;
    facilityCode: string;
    slug: string;
    description: string;
    facilityType: string;
    ownershipType: string;
    facilityStatus: string;
    country: string;
    state: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
    timezone: string;
    operationalSince: string;
    operationalUntil: string;
    floorArea: string;
    floorAreaUnit: string;
    employeeCount: number;
    scope1Enabled: boolean;
    scope2Enabled: boolean;
    scope3Enabled: boolean;
    isActive: boolean;
};

export type FacilitiesApiResponse<T = FacilityDto[]> = {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
    error: unknown | null;
    method: string;
    path: string;
    timestamp: string;
};

export type CreateFacilityPayload = Omit<
    Facility,
    "id" | "createdAt" | "updatedAt" | "tenantId" | "slug" | "facilityStatus" | "isActive" | "employeeCount"
> & {
    employeeCount: string | number;
};
