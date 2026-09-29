export type SubUnitType =
    | "production_line"
    | "process_unit"
    | "boiler_house"
    | "building_block"
    | "warehouse_bay"
    | "office_section"
    | "data_hall"
    | "other";

export type SubUnitStatus = "active" | "inactive" | "decommissioned";

export type FacilitySubUnitDto = {
    id: string;
    facility_id: string;
    name: string;
    sub_unit_code: string;
    description?: string | null;
    sub_unit_type: SubUnitType;
    status: SubUnitStatus;
    floor_area?: number | null;
    floor_area_unit?: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

export type FacilitySubUnit = {
    id: string;
    facilityId: string;
    name: string;
    subUnitCode: string;
    description?: string | null;
    subUnitType: SubUnitType;
    status: SubUnitStatus;
    floorArea?: number | null;
    floorAreaUnit?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type FacilityDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id: string;
    name: string;
    facility_code?: string;
    slug?: string;
    description?: string | null;
    facility_type: string;
    operational_control?: boolean;
    financial_control?: boolean;
    ownership_percent?: number | null;
    facility_status?: string;
    country: string;
    state?: string | null;
    city: string;
    address_line_1: string;
    address_line_2?: string | null;
    postal_code?: string | null;
    timezone?: string;
    operational_since?: string | null;
    operational_until?: string | null;
    floor_area?: number | null;
    floor_area_unit?: string | null;
    employee_count?: number | null;
    scope1_enabled?: boolean | null;
    scope2_enabled?: boolean | null;
    scope3_enabled?: boolean | null;
    is_active?: boolean;
    sub_units?: FacilitySubUnitDto[];
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
    subUnits?: FacilitySubUnit[];
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

export type FacilitySubUnitsApiResponse<T = FacilitySubUnitDto[]> = {
    status: string;
    message: string;
    data: T;
};

export type CreateSubUnitPayload = {
    name: string;
    sub_unit_code?: string;
    sub_unit_type: SubUnitType;
    description?: string | null;
    floor_area?: number | string | null;
    floor_area_unit?: string | null;
};

export type UpdateSubUnitPayload = {
    name?: string;
    sub_unit_code?: string;
    sub_unit_type?: SubUnitType;
    status?: SubUnitStatus;
    description?: string | null;
    floor_area?: number | string | null;
    floor_area_unit?: string | null;
    is_active?: boolean;
};

export type CreateFacilityPayload = {
    name: string;
    facilityType: string;
    country: string;
    city: string;
    addressLine1: string;
    facilityCode?: string;
    description?: string | null;
    ownershipPercent?: number | string | null;
    state?: string | null;
    addressLine2?: string | null;
    postalCode?: string | null;
    timezone?: string;
    operationalSince?: string | null;
    operationalUntil?: string | null;
    floorArea?: number | string | null;
    floorAreaUnit?: string | null;
    employeeCount?: number | string | null;
    scope1Enabled?: boolean;
    scope2Enabled?: boolean;
    scope3Enabled?: boolean;
};


