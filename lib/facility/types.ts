export type FacilityDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
    name: string;
    facility_code: string;
    slug: string;
    description: string | null;
    facility_type: string;
    operational_control: boolean;
    financial_control: boolean;
    ownership_percent: number;
    facility_status: string;
    country: string;
    state: string | null;
    city: string;
    address_line_1: string;
    address_line_2: string | null;
    postal_code: string | null;
    timezone: string;
    operational_since: string | null;
    operational_until: string | null;
    floor_area: number | null;
    floor_area_unit: string | null;
    employee_count: number | null;
    scope1_enabled: boolean | null;
    scope2_enabled: boolean | null;
    scope3_enabled: boolean | null;
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
    description: string | null;
    facilityType: string;
    operationalControl: boolean;
    financialControl: boolean;
    ownershipPercent: number;
    facilityStatus: string;
    country: string;
    state: string | null;
    city: string;
    addressLine1: string;
    addressLine2: string | null;
    postalCode: string | null;
    timezone: string;
    operationalSince: string | null;
    operationalUntil: string | null;
    floorArea: number | null;
    floorAreaUnit: string | null;
    employeeCount: number | null;
    scope1Enabled: boolean | null;
    scope2Enabled: boolean | null;
    scope3Enabled: boolean | null;
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
    "id" | "createdAt" | "updatedAt" | "tenantId" | "slug" | "facilityStatus" | "isActive" | "employeeCount" | "floorArea"
> & {
    employeeCount: string | number;
    floorArea: string | number;
};
