export type GasEmissionsDto = {
    kg_co2e: string | number;
    t_co2e: string | number;
    kg_co2?: string | number;
    t_co2?: string | number;
    kg_ch4?: string | number;
    t_ch4?: string | number;
    kg_n2o?: string | number;
    t_n2o?: string | number;
};

export type FreightingGoodsType = {
    id: string;
    name: string;
    slug: string;
    activity_category: string;
    description?: string;
    is_active?: boolean;
};

export type FreightingGoodsFactor = {
    id: string;
    freighting_goods_type_id?: string;
    freighting_goods_type?: FreightingGoodsType;
    vehicle_type?: string;
    unit_id?: string;
    unit_name?: string;
    unit_symbol?: string;
    unit?: {
        id?: string;
        name?: string;
        symbol?: string;
        unit_type?: string;
    };
    source_id?: string;
    source_standard?: string;
    source?: {
        id?: string;
        standard?: string;
        version?: string;
        region?: string;
    };
    factors?: Record<string, GasEmissionsDto>;
    emission_factors?: Record<string, GasEmissionsDto>;
    
    // Top-level factor keys as returned by backend API
    diesel?: GasEmissionsDto | null;
    petrol?: GasEmissionsDto | null;
    cng?: GasEmissionsDto | null;
    lpg?: GasEmissionsDto | null;
    unknown?: GasEmissionsDto | null;
    plug_in_hybrid_electric_vehicle?: GasEmissionsDto | null;
    battery_electric_vehicle?: GasEmissionsDto | null;
    zero_percent_laden?: GasEmissionsDto | null;
    fifty_percent_laden?: GasEmissionsDto | null;
    hundred_percent_laden?: GasEmissionsDto | null;
    average_laden?: GasEmissionsDto | null;
    with_rf?: GasEmissionsDto | null;
    without_rf?: GasEmissionsDto | null;
    general?: GasEmissionsDto | null;
};

export const DEFAULT_FREIGHTING_CATEGORIES: string[] = [
    "Cargo ship",
    "Freight flights",
    "HGV (all diesel)",
    "HGV refrigerated (all diesel)",
    "Rail",
    "Sea tanker",
    "Vans",
];

export const DEFAULT_FREIGHTING_TYPES: FreightingGoodsType[] = [
    // Vans
    {
        id: "7ca648b2-4d1a-4638-b7eb-6c1c38547432",
        name: "Class I (up to 1.305 tonnes)",
        slug: "class-i-up-to-1-305-tonnes",
        activity_category: "Vans",
        description: "Class I van classification",
        is_active: true,
    },
    {
        id: "e44fc1a8-8e69-42b7-8db1-279cbe8784d1",
        name: "Class II (1.305 to 1.74 tonnes)",
        slug: "class-ii-1-305-to-1-74-tonnes",
        activity_category: "Vans",
        description: "Class II van classification",
        is_active: true,
    },
    {
        id: "d0efbc29-4509-4f76-8809-77f6bcf4bfd4",
        name: "Class III (1.74 to 3.5 tonnes)",
        slug: "class-iii-1-74-to-3-5-tonnes",
        activity_category: "Vans",
        description: "Class III van classification",
        is_active: true,
    },
    {
        id: "893d93cb-5a50-4ba1-b3b4-7b75f5bb2ef7",
        name: "Average (up to 3.5 tonnes)",
        slug: "average-up-to-3-5-tonnes",
        activity_category: "Vans",
        description: "Average van across all classes",
        is_active: true,
    },

    // HGV (all diesel)
    {
        id: "hgv-artics-type-id",
        name: "All artics",
        slug: "all-artics",
        activity_category: "HGV (all diesel)",
        description: "Articulated Heavy Goods Vehicles",
        is_active: true,
    },
    {
        id: "hgv-rigid-type-id",
        name: "All rigids",
        slug: "all-rigids",
        activity_category: "HGV (all diesel)",
        description: "Rigid Heavy Goods Vehicles",
        is_active: true,
    },

    // HGV refrigerated (all diesel)
    {
        id: "hgv-refrig-artics-type-id",
        name: "All artics",
        slug: "hgv-refrigerated-all-diesel-all-artics",
        activity_category: "HGV refrigerated (all diesel)",
        description: "Refrigerated Articulated HGVs",
        is_active: true,
    },

    // Freight flights
    {
        id: "flight-domestic-type-id",
        name: "Domestic freight",
        slug: "domestic-freight",
        activity_category: "Freight flights",
        description: "Domestic short-haul cargo flights",
        is_active: true,
    },
    {
        id: "flight-longhaul-type-id",
        name: "Long-haul freight",
        slug: "long-haul-freight",
        activity_category: "Freight flights",
        description: "International long-haul cargo flights",
        is_active: true,
    },

    // Rail
    {
        id: "rail-freight-type-id",
        name: "Freight train",
        slug: "freight-train",
        activity_category: "Rail",
        description: "National freight train logistics",
        is_active: true,
    },

    // Cargo ship
    {
        id: "cargo-bulk-type-id",
        name: "Bulk carrier - 10,000 to 34,999 dwt",
        slug: "bulk-carrier-10k-35k-dwt",
        activity_category: "Cargo ship",
        description: "Dry bulk ocean shipping",
        is_active: true,
    },
    {
        id: "cargo-container-type-id",
        name: "Container ship - 3,000 to 7,999 TEU",
        slug: "container-ship-3k-8k-teu",
        activity_category: "Cargo ship",
        description: "Containerized ocean freight",
        is_active: true,
    },

    // Sea tanker
    {
        id: "sea-tanker-crude-type-id",
        name: "Crude oil tanker - 60,000 to 79,999 dwt",
        slug: "crude-tanker-60k-80k-dwt",
        activity_category: "Sea tanker",
        description: "Crude oil ocean transport",
        is_active: true,
    },
];

export const DEFAULT_FREIGHTING_FACTORS: FreightingGoodsFactor[] = [
    // Vans (Class I)
    {
        id: "18f8e02d-05e8-4a94-916c-03d36b801a61",
        freighting_goods_type_id: "7ca648b2-4d1a-4638-b7eb-6c1c38547432",
        vehicle_type: "Class I (up to 1.305 tonnes)",
        unit_symbol: "tonne.km",
        unit: { id: "5cb348ae", name: "Tonne-kilometer", symbol: "tonne.km" },
        source_standard: "DEFRA",
        diesel: { kg_co2e: "0.60155", t_co2e: "0.00060155" },
        petrol: { kg_co2e: "0.78184", t_co2e: "0.00078184" },
        plug_in_hybrid_electric_vehicle: { kg_co2e: "0.33418", t_co2e: "0.00033418" },
        battery_electric_vehicle: { kg_co2e: "0.0", t_co2e: "0.0" },
        unknown: { kg_co2e: "0.60337", t_co2e: "0.00060337" },
    },
    // HGV All Artics (tonne.km)
    {
        id: "c1a2f9dd-fb4b-41ae-b508-fe7578097dd4",
        freighting_goods_type_id: "hgv-artics-type-id",
        vehicle_type: "All artics",
        unit_symbol: "tonne.km",
        unit: { id: "5cb348ae", name: "Tonne-kilometer", symbol: "tonne.km" },
        source_standard: "DEFRA",
        zero_percent_laden: { kg_co2e: "0.12450", t_co2e: "0.00012450" },
        fifty_percent_laden: { kg_co2e: "0.11189", t_co2e: "0.00011189" },
        hundred_percent_laden: { kg_co2e: "0.06966", t_co2e: "0.00006966" },
        average_laden: { kg_co2e: "0.09020", t_co2e: "0.00009020" },
    },
    // HGV All Artics (km)
    {
        id: "06000976-8c12-4a82-bc44-3afed7fca50e",
        freighting_goods_type_id: "hgv-artics-type-id",
        vehicle_type: "All artics",
        unit_symbol: "km",
        unit: { id: "cc1a1096", name: "Kilometer", symbol: "km" },
        source_standard: "DEFRA",
        zero_percent_laden: { kg_co2e: "0.74715", t_co2e: "0.00074715" },
        fifty_percent_laden: { kg_co2e: "0.98913", t_co2e: "0.00098913" },
        hundred_percent_laden: { kg_co2e: "1.23112", t_co2e: "0.00123112" },
        average_laden: { kg_co2e: "1.07395", t_co2e: "0.00107395" },
    },
    // HGV All Artics (miles)
    {
        id: "48ff8d5c-9440-41e7-b34a-f9a4d3f7bc8d",
        freighting_goods_type_id: "hgv-artics-type-id",
        vehicle_type: "All artics",
        unit_symbol: "miles",
        unit: { id: "ba517654", name: "Miles", symbol: "miles" },
        source_standard: "DEFRA",
        zero_percent_laden: { kg_co2e: "1.20241", t_co2e: "0.00120241" },
        fifty_percent_laden: { kg_co2e: "1.59184", t_co2e: "0.00159184" },
        hundred_percent_laden: { kg_co2e: "1.98128", t_co2e: "0.00198128" },
        average_laden: { kg_co2e: "1.72834", t_co2e: "0.00172834" },
    },
    // Freight Flights Domestic
    {
        id: "flight-domestic-factor-id",
        freighting_goods_type_id: "flight-domestic-type-id",
        vehicle_type: "Domestic freight",
        unit_symbol: "tonne.km",
        unit: { id: "5cb348ae", name: "Tonne-kilometer", symbol: "tonne.km" },
        source_standard: "DEFRA",
        with_rf: { kg_co2e: "2.25700", t_co2e: "0.00225700" },
        without_rf: { kg_co2e: "1.14200", t_co2e: "0.00114200" },
    },
    // Cargo ship bulk carrier
    {
        id: "cargo-bulk-factor-id",
        freighting_goods_type_id: "cargo-bulk-type-id",
        vehicle_type: "Bulk carrier - 10,000 to 34,999 dwt",
        unit_symbol: "tonne.km",
        unit: { id: "5cb348ae", name: "Tonne-kilometer", symbol: "tonne.km" },
        source_standard: "DEFRA",
        general: { kg_co2e: "0.00760", t_co2e: "0.00000760" },
    },
    // Rail
    {
        id: "rail-freight-factor-id",
        freighting_goods_type_id: "rail-freight-type-id",
        vehicle_type: "Freight train",
        unit_symbol: "tonne.km",
        unit: { id: "5cb348ae", name: "Tonne-kilometer", symbol: "tonne.km" },
        source_standard: "DEFRA",
        general: { kg_co2e: "0.02750", t_co2e: "0.00002750" },
    },
];
