export type SubUnitType =
    | "raw_material_handling"
    | "coke_oven"
    | "sinter_plant"
    | "pellet_plant"
    | "lime_dolo_plant"
    | "blast_furnace"
    | "dri_plant"
    | "ferro_alloy_plant"
    | "steel_melt_shop"
    | "rolling_mill"
    | "power_plant"
    | "utilities"
    | "auxiliary"
    | "other";

export type SubUnitStatus = "active" | "inactive" | "decommissioned";

export const SUB_UNIT_TYPE_LABELS: Record<string, string> = {
    raw_material_handling: "Raw Material Handling",
    coke_oven: "Coke Oven",
    sinter_plant: "Sinter Plant",
    pellet_plant: "Pellet Plant",
    lime_dolo_plant: "Lime & Dolo Plant",
    blast_furnace: "Blast Furnace",
    dri_plant: "DRI Plant",
    ferro_alloy_plant: "Ferro Alloy Plant",
    steel_melt_shop: "Steel Melt Shop",
    rolling_mill: "Rolling Mill",
    power_plant: "Power Plant",
    utilities: "Utilities",
    auxiliary: "Auxiliary",
    other: "Other",
};

export function formatSubUnitTypeLabel(
    subUnitType?: string | null,
    customSubUnitType?: string | null
): string {
    if (!subUnitType) return "Sub-Unit";
    const normalizedType = subUnitType.toLowerCase();
    if (normalizedType === "other") {
        return customSubUnitType && customSubUnitType.trim()
            ? `Other (${customSubUnitType.trim()})`
            : "Other";
    }
    return SUB_UNIT_TYPE_LABELS[normalizedType] || subUnitType.replace(/_/g, " ");
}

export type FacilitySubUnitDto = {
    id: string;
    facility_id: string;
    name: string;
    sub_unit_code: string;
    description?: string | null;
    sub_unit_type: SubUnitType | string;
    custom_sub_unit_type?: string | null;
    status: SubUnitStatus | string;
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
    customSubUnitType?: string | null;
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
    sub_unit_type?: SubUnitType | string;
    custom_sub_unit_type?: string | null;
    description?: string | null;
    floor_area?: number | string | null;
    floor_area_unit?: string | null;
};

export type UpdateSubUnitPayload = {
    name?: string;
    sub_unit_code?: string;
    sub_unit_type?: SubUnitType | string;
    custom_sub_unit_type?: string | null;
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


