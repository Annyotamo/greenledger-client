import { Scope3SpendStatus } from "../category1/types";

export type { Scope3SpendStatus };

export type WasteTreatmentMethodEnum =
    | "open_loop"
    | "closed_loop"
    | "incineration_energy_recovery"
    | "composting"
    | "landfill"
    | "anaerobic_digestion";

export const TREATMENT_METHOD_LABELS: Record<WasteTreatmentMethodEnum, string> = {
    open_loop: "Open-loop Recycling",
    closed_loop: "Closed-loop Recycling",
    incineration_energy_recovery: "Incineration with Energy Recovery",
    composting: "Composting / Organic Recycling",
    landfill: "Landfill Disposal",
    anaerobic_digestion: "Anaerobic Digestion",
};

export type WasteTreatmentFactorDetail = {
    method: WasteTreatmentMethodEnum;
    method_label: string;
    kg_co2e: number;
    t_co2e: number;
    source_reference_code?: string;
};

export type WasteType = {
    waste_type_id: string;
    waste_type_name: string;
    category_name: string;
    unit_symbol: string;
    treatment_methods: Record<string, WasteTreatmentFactorDetail | { kg_co2e: number; t_co2e: number }> | WasteTreatmentFactorDetail[];
};

export type Category5WasteActivityDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    facility_id: string | null;
    facility_name?: string | null;
    reporting_period: string;
    waste_type_id: string;
    waste_type_name?: string;
    category_name?: string;
    treatment_method: WasteTreatmentMethodEnum;
    treatment_method_label?: string;
    activity_date: string;
    waste_generated_tonnes: number;
    applied_kg_co2e_per_tonne?: number;
    calculated_kg_co2e: number;
    calculated_t_co2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejected_reason?: string | null;
    amended_from_id?: string | null;
};

export type Category5WasteActivityEntry = {
    id: string;
    createdAt: string;
    updatedAt: string;
    facilityId: string | null;
    facilityName: string | null;
    reportingPeriod: string;
    wasteTypeId: string;
    wasteTypeName: string;
    categoryName: string;
    treatmentMethod: WasteTreatmentMethodEnum;
    treatmentMethodLabel: string;
    activityDate: string;
    wasteGeneratedTonnes: number;
    appliedKgCo2ePerTonne: number;
    calculatedKgCo2e: number;
    calculatedTCo2e: number;
    status: Scope3SpendStatus;
    notes: string | null;
    rejectedReason: string | null;
    amendedFromId: string | null;
};

export type CreateCategory5WastePayload = {
    reporting_period: string;
    facility_id?: string | null;
    waste_type_id: string;
    treatment_method: WasteTreatmentMethodEnum;
    activity_date: string;
    waste_generated_tonnes: number;
    notes?: string | null;
};

export type UpdateCategory5WastePayload = Partial<CreateCategory5WastePayload>;

export type AmendCategory5WastePayload = CreateCategory5WastePayload & {
    amended_from_id: string;
};

export type Category5FilterParams = {
    reporting_period?: string;
    facility_id?: string;
    status?: string;
    activity_date?: string;
    start_date?: string;
    end_date?: string;
    category?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
};

// Fallback seed list for Waste Types
export const DEFAULT_WASTE_TYPES: WasteType[] = [
    {
        waste_type_id: "faa2ea7e-1fe8-46e4-a349-68562c882cf8",
        waste_type_name: "Wood & Construction Timber",
        category_name: "Construction",
        unit_symbol: "tonnes",
        treatment_methods: [
            {
                method: "landfill",
                method_label: "Landfill Disposal",
                kg_co2e: 925.34348,
                t_co2e: 0.92534348,
                source_reference_code: "DEFRA_2025_WOOD_LANDFILL",
            },
            {
                method: "incineration_energy_recovery",
                method_label: "Incineration with Energy Recovery",
                kg_co2e: 21.45000,
                t_co2e: 0.02145000,
                source_reference_code: "DEFRA_2025_WOOD_INCINERATION",
            },
            {
                method: "open_loop",
                method_label: "Open-loop Recycling",
                kg_co2e: 21.45000,
                t_co2e: 0.02145000,
                source_reference_code: "DEFRA_2025_WOOD_RECYCLING",
            },
        ],
    },
    {
        waste_type_id: "waste-type-commercial",
        waste_type_name: "Commercial & Industrial Refuse",
        category_name: "Refuse",
        unit_symbol: "tonnes",
        treatment_methods: [
            {
                method: "landfill",
                method_label: "Landfill Disposal",
                kg_co2e: 458.20000,
                t_co2e: 0.45820000,
                source_reference_code: "DEFRA_2025_COMMERCIAL_LANDFILL",
            },
            {
                method: "incineration_energy_recovery",
                method_label: "Incineration with Energy Recovery",
                kg_co2e: 21.45000,
                t_co2e: 0.02145000,
                source_reference_code: "DEFRA_2025_COMMERCIAL_INCINERATION",
            },
        ],
    },
    {
        waste_type_id: "waste-type-plastic",
        waste_type_name: "Mixed Rigid & Film Plastics",
        category_name: "Plastic",
        unit_symbol: "tonnes",
        treatment_methods: [
            {
                method: "open_loop",
                method_label: "Open-loop Recycling",
                kg_co2e: 21.45000,
                t_co2e: 0.02145000,
                source_reference_code: "DEFRA_2025_PLASTIC_RECYCLING",
            },
            {
                method: "landfill",
                method_label: "Landfill Disposal",
                kg_co2e: 8.90000,
                t_co2e: 0.00890000,
                source_reference_code: "DEFRA_2025_PLASTIC_LANDFILL",
            },
            {
                method: "incineration_energy_recovery",
                method_label: "Incineration with Energy Recovery",
                kg_co2e: 21.45000,
                t_co2e: 0.02145000,
                source_reference_code: "DEFRA_2025_PLASTIC_INCINERATION",
            },
        ],
    },
    {
        waste_type_id: "waste-type-paper",
        waste_type_name: "Cardboard & Packaging Paper",
        category_name: "Paper",
        unit_symbol: "tonnes",
        treatment_methods: [
            {
                method: "closed_loop",
                method_label: "Closed-loop Recycling",
                kg_co2e: 21.45000,
                t_co2e: 0.02145000,
                source_reference_code: "DEFRA_2025_PAPER_RECYCLING",
            },
            {
                method: "landfill",
                method_label: "Landfill Disposal",
                kg_co2e: 1042.80000,
                t_co2e: 1.04280000,
                source_reference_code: "DEFRA_2025_PAPER_LANDFILL",
            },
        ],
    },
];
