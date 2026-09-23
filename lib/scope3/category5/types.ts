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
    treatment_methods: Record<string, WasteTreatmentFactorDetail | { kg_co2e: number; t_co2e?: number }> | WasteTreatmentFactorDetail[];
};

// ---------------------------------------------------------------------------
// DEFRA 2024/2025 STANDARD WASTE TREATMENT EMISSION FACTORS (kgCO₂e / tonne)
// ---------------------------------------------------------------------------

export const STANDARD_CATEGORY_FACTORS: Record<string, WasteTreatmentFactorDetail[]> = {
    organic: [
        {
            method: "composting",
            method_label: TREATMENT_METHOD_LABELS.composting,
            kg_co2e: 10.218,
            t_co2e: 0.010218,
            source_reference_code: "DEFRA_2025_ORGANIC_COMPOSTING",
        },
        {
            method: "anaerobic_digestion",
            method_label: TREATMENT_METHOD_LABELS.anaerobic_digestion,
            kg_co2e: 10.218,
            t_co2e: 0.010218,
            source_reference_code: "DEFRA_2025_ORGANIC_ANAEROBIC_DIGESTION",
        },
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 578.4,
            t_co2e: 0.5784,
            source_reference_code: "DEFRA_2025_ORGANIC_LANDFILL",
        },
        {
            method: "incineration_energy_recovery",
            method_label: TREATMENT_METHOD_LABELS.incineration_energy_recovery,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_ORGANIC_INCINERATION",
        },
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_ORGANIC_RECYCLING",
        },
    ],
    paper: [
        {
            method: "closed_loop",
            method_label: TREATMENT_METHOD_LABELS.closed_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_PAPER_CLOSED_LOOP",
        },
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_PAPER_OPEN_LOOP",
        },
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 1042.8,
            t_co2e: 1.0428,
            source_reference_code: "DEFRA_2025_PAPER_LANDFILL",
        },
        {
            method: "incineration_energy_recovery",
            method_label: TREATMENT_METHOD_LABELS.incineration_energy_recovery,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_PAPER_INCINERATION",
        },
        {
            method: "composting",
            method_label: TREATMENT_METHOD_LABELS.composting,
            kg_co2e: 10.22,
            t_co2e: 0.01022,
            source_reference_code: "DEFRA_2025_PAPER_COMPOSTING",
        },
    ],
    plastic: [
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_PLASTIC_OPEN_LOOP",
        },
        {
            method: "closed_loop",
            method_label: TREATMENT_METHOD_LABELS.closed_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_PLASTIC_CLOSED_LOOP",
        },
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 8.9,
            t_co2e: 0.0089,
            source_reference_code: "DEFRA_2025_PLASTIC_LANDFILL",
        },
        {
            method: "incineration_energy_recovery",
            method_label: TREATMENT_METHOD_LABELS.incineration_energy_recovery,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_PLASTIC_INCINERATION",
        },
    ],
    wood: [
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 925.34348,
            t_co2e: 0.92534348,
            source_reference_code: "DEFRA_2025_WOOD_LANDFILL",
        },
        {
            method: "incineration_energy_recovery",
            method_label: TREATMENT_METHOD_LABELS.incineration_energy_recovery,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_WOOD_INCINERATION",
        },
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_WOOD_RECYCLING",
        },
        {
            method: "closed_loop",
            method_label: TREATMENT_METHOD_LABELS.closed_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_WOOD_CLOSED_LOOP",
        },
    ],
    metal: [
        {
            method: "closed_loop",
            method_label: TREATMENT_METHOD_LABELS.closed_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_METALS_CLOSED_LOOP",
        },
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_METALS_OPEN_LOOP",
        },
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 8.9,
            t_co2e: 0.0089,
            source_reference_code: "DEFRA_2025_METALS_LANDFILL",
        },
    ],
    glass: [
        {
            method: "closed_loop",
            method_label: TREATMENT_METHOD_LABELS.closed_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_GLASS_CLOSED_LOOP",
        },
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_GLASS_OPEN_LOOP",
        },
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 8.9,
            t_co2e: 0.0089,
            source_reference_code: "DEFRA_2025_GLASS_LANDFILL",
        },
    ],
    textile: [
        {
            method: "closed_loop",
            method_label: TREATMENT_METHOD_LABELS.closed_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_TEXTILES_CLOSED_LOOP",
        },
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_TEXTILES_OPEN_LOOP",
        },
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 578.4,
            t_co2e: 0.5784,
            source_reference_code: "DEFRA_2025_TEXTILES_LANDFILL",
        },
        {
            method: "incineration_energy_recovery",
            method_label: TREATMENT_METHOD_LABELS.incineration_energy_recovery,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_TEXTILES_INCINERATION",
        },
    ],
    weee: [
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_WEEE_OPEN_LOOP",
        },
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 8.9,
            t_co2e: 0.0089,
            source_reference_code: "DEFRA_2025_WEEE_LANDFILL",
        },
        {
            method: "incineration_energy_recovery",
            method_label: TREATMENT_METHOD_LABELS.incineration_energy_recovery,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_WEEE_INCINERATION",
        },
    ],
    general: [
        {
            method: "landfill",
            method_label: TREATMENT_METHOD_LABELS.landfill,
            kg_co2e: 458.2,
            t_co2e: 0.4582,
            source_reference_code: "DEFRA_2025_REFUSE_LANDFILL",
        },
        {
            method: "incineration_energy_recovery",
            method_label: TREATMENT_METHOD_LABELS.incineration_energy_recovery,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_REFUSE_INCINERATION",
        },
        {
            method: "open_loop",
            method_label: TREATMENT_METHOD_LABELS.open_loop,
            kg_co2e: 21.45,
            t_co2e: 0.02145,
            source_reference_code: "DEFRA_2025_REFUSE_RECYCLING",
        },
        {
            method: "composting",
            method_label: TREATMENT_METHOD_LABELS.composting,
            kg_co2e: 10.22,
            t_co2e: 0.01022,
            source_reference_code: "DEFRA_2025_REFUSE_COMPOSTING",
        },
        {
            method: "anaerobic_digestion",
            method_label: TREATMENT_METHOD_LABELS.anaerobic_digestion,
            kg_co2e: 10.22,
            t_co2e: 0.01022,
            source_reference_code: "DEFRA_2025_REFUSE_ANAEROBIC_DIGESTION",
        },
    ],
};

// ---------------------------------------------------------------------------
// METHOD NORMALIZATION UTILITIES
// ---------------------------------------------------------------------------

export function normalizeMethodKey(raw: unknown): WasteTreatmentMethodEnum | null {
    if (!raw || typeof raw !== "string") return null;
    const s = raw.toLowerCase().trim().replace(/[- /]/g, "_");
    if (s.includes("landfill")) return "landfill";
    if (s.includes("closed") && s.includes("loop")) return "closed_loop";
    if (s.includes("open") && s.includes("loop")) return "open_loop";
    if (s.includes("incinerat") || s.includes("combust") || s.includes("energy_recovery")) return "incineration_energy_recovery";
    if (s.includes("compost")) return "composting";
    if (s.includes("anaerobic") || s.includes("digest") || s.includes("_ad_")) return "anaerobic_digestion";
    if (s.includes("recycl")) return "open_loop";
    return null;
}

export function getFallbackFactorsForMaterial(categoryName = "", wasteTypeName = ""): WasteTreatmentFactorDetail[] {
    const text = `${wasteTypeName} ${categoryName}`.toLowerCase();

    if (text.includes("organic") || text.includes("garden") || text.includes("food") || text.includes("kitchen") || text.includes("green") || text.includes("compost") || text.includes("biodegradable")) {
        return STANDARD_CATEGORY_FACTORS.organic;
    }
    if (text.includes("paper") || text.includes("cardboard") || text.includes("carton") || text.includes("box") || text.includes("packaging")) {
        return STANDARD_CATEGORY_FACTORS.paper;
    }
    if (text.includes("plastic") || text.includes("polymer") || text.includes("pet") || text.includes("hdpe") || text.includes("pvc") || text.includes("film")) {
        return STANDARD_CATEGORY_FACTORS.plastic;
    }
    if (text.includes("wood") || text.includes("timber") || text.includes("pallet") || text.includes("lumber") || text.includes("construction")) {
        return STANDARD_CATEGORY_FACTORS.wood;
    }
    if (text.includes("metal") || text.includes("steel") || text.includes("alumin") || text.includes("copper") || text.includes("iron") || text.includes("scrap")) {
        return STANDARD_CATEGORY_FACTORS.metal;
    }
    if (text.includes("glass") || text.includes("bottle") || text.includes("cullet")) {
        return STANDARD_CATEGORY_FACTORS.glass;
    }
    if (text.includes("textile") || text.includes("cloth") || text.includes("garment") || text.includes("fabric")) {
        return STANDARD_CATEGORY_FACTORS.textile;
    }
    if (text.includes("weee") || text.includes("electronic") || text.includes("electrical") || text.includes("appliance") || text.includes("e-waste")) {
        return STANDARD_CATEGORY_FACTORS.weee;
    }
    return STANDARD_CATEGORY_FACTORS.general;
}

export function normalizeWasteTreatmentMethods(
    rawMethods: unknown,
    categoryName = "",
    wasteTypeName = "",
): WasteTreatmentFactorDetail[] {
    const fallbackList = getFallbackFactorsForMaterial(categoryName, wasteTypeName);
    const fallbackMap = new Map<WasteTreatmentMethodEnum, WasteTreatmentFactorDetail>();
    fallbackList.forEach((f) => fallbackMap.set(f.method, f));

    if (!rawMethods) {
        return fallbackList;
    }

    // Case 1: Array of items (either strings, partial factor objects, or full detail objects)
    if (Array.isArray(rawMethods)) {
        if (rawMethods.length === 0) {
            return fallbackList;
        }

        const list: WasteTreatmentFactorDetail[] = [];
        const seen = new Set<WasteTreatmentMethodEnum>();

        for (const item of rawMethods) {
            if (typeof item === "string") {
                const key = normalizeMethodKey(item);
                if (key && !seen.has(key)) {
                    seen.add(key);
                    const fb = fallbackMap.get(key) ?? {
                        method: key,
                        method_label: TREATMENT_METHOD_LABELS[key] || item,
                        kg_co2e: 21.45,
                        t_co2e: 0.02145,
                        source_reference_code: `DEFRA_2025_${key.toUpperCase()}`,
                    };
                    list.push(fb);
                }
            } else if (typeof item === "object" && item !== null) {
                const rawObj = item as Record<string, unknown>;
                const rawKey = rawObj.method || rawObj.treatment_method || rawObj.disposal_method || rawObj.name || rawObj.type || rawObj.key || rawObj.id;
                const key = normalizeMethodKey(rawKey as string);

                if (key && !seen.has(key)) {
                    seen.add(key);
                    const fb = fallbackMap.get(key);
                    const rawKg = rawObj.kg_co2e ?? rawObj.factor ?? rawObj.emission_factor ?? rawObj.applied_kg_co2e_per_tonne ?? rawObj.value;
                    const parsedKg = rawKg != null && !isNaN(Number(rawKg)) ? Number(rawKg) : (fb?.kg_co2e ?? 21.45);
                    const parsedT = rawObj.t_co2e != null && !isNaN(Number(rawObj.t_co2e)) ? Number(rawObj.t_co2e) : parsedKg / 1000;
                    const label = (rawObj.method_label || rawObj.label || rawObj.treatment_method_label || TREATMENT_METHOD_LABELS[key] || String(rawKey)) as string;
                    const refCode = (rawObj.source_reference_code || rawObj.reference_code || rawObj.source || fb?.source_reference_code) as string | undefined;

                    list.push({
                        method: key,
                        method_label: label,
                        kg_co2e: parsedKg,
                        t_co2e: parsedT,
                        source_reference_code: refCode,
                    });
                }
            }
        }

        if (list.length > 0) {
            return list;
        }
        return fallbackList;
    }

    // Case 2: Object dictionary { [method]: factorNumber | { kg_co2e: number } }
    if (typeof rawMethods === "object" && rawMethods !== null) {
        const entries = Object.entries(rawMethods as Record<string, unknown>);
        if (entries.length === 0) {
            return fallbackList;
        }

        const list: WasteTreatmentFactorDetail[] = [];
        const seen = new Set<WasteTreatmentMethodEnum>();

        for (const [keyRaw, val] of entries) {
            const key = normalizeMethodKey(keyRaw);
            if (key && !seen.has(key)) {
                seen.add(key);
                const fb = fallbackMap.get(key);
                let kg = fb?.kg_co2e ?? 21.45;
                let label = TREATMENT_METHOD_LABELS[key];
                let ref = fb?.source_reference_code;

                if (typeof val === "number" && !isNaN(val)) {
                    kg = val;
                } else if (typeof val === "object" && val !== null) {
                    const vObj = val as Record<string, unknown>;
                    const rawKg = vObj.kg_co2e ?? vObj.factor ?? vObj.emission_factor ?? vObj.value;
                    if (rawKg != null && !isNaN(Number(rawKg))) {
                        kg = Number(rawKg);
                    }
                    if (vObj.method_label) label = String(vObj.method_label);
                    if (vObj.source_reference_code) ref = String(vObj.source_reference_code);
                }

                list.push({
                    method: key,
                    method_label: label,
                    kg_co2e: kg,
                    t_co2e: kg / 1000,
                    source_reference_code: ref,
                });
            }
        }

        if (list.length > 0) {
            return list;
        }
    }

    return fallbackList;
}

export type Category5WasteActivityDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    reporting_period_id?: string | null;
    reporting_period_name?: string | null;
    reporting_period?: string;
    facility_id: string | null;
    facility_name?: string | null;
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
    reportingPeriodId: string | null;
    reportingPeriodName: string;
    reportingPeriod: string;
    facilityId: string | null;
    facilityName: string | null;
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
    reporting_period_id?: string | null;
    facility_id?: string | null;
    waste_type_id: string;
    treatment_method: WasteTreatmentMethodEnum;
    activity_date: string;
    waste_generated_tonnes: number;
    status?: Scope3SpendStatus;
    notes?: string | null;
};

export type UpdateCategory5WastePayload = Partial<CreateCategory5WastePayload>;

export type AmendCategory5WastePayload = CreateCategory5WastePayload & {
    amended_from_id: string;
};

export type Category5FilterParams = {
    reporting_period_id?: string;
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
        treatment_methods: STANDARD_CATEGORY_FACTORS.wood,
    },
    {
        waste_type_id: "waste-type-commercial",
        waste_type_name: "Commercial & Industrial Refuse",
        category_name: "Refuse",
        unit_symbol: "tonnes",
        treatment_methods: STANDARD_CATEGORY_FACTORS.general,
    },
    {
        waste_type_id: "waste-type-organic",
        waste_type_name: "Organic: garden waste",
        category_name: "Refuse",
        unit_symbol: "tonnes",
        treatment_methods: STANDARD_CATEGORY_FACTORS.organic,
    },
    {
        waste_type_id: "waste-type-food",
        waste_type_name: "Organic: food and drink waste",
        category_name: "Refuse",
        unit_symbol: "tonnes",
        treatment_methods: STANDARD_CATEGORY_FACTORS.organic,
    },
    {
        waste_type_id: "waste-type-plastic",
        waste_type_name: "Mixed Rigid & Film Plastics",
        category_name: "Plastic",
        unit_symbol: "tonnes",
        treatment_methods: STANDARD_CATEGORY_FACTORS.plastic,
    },
    {
        waste_type_id: "waste-type-paper",
        waste_type_name: "Cardboard & Packaging Paper",
        category_name: "Paper",
        unit_symbol: "tonnes",
        treatment_methods: STANDARD_CATEGORY_FACTORS.paper,
    },
];
