import { Scope3SpendStatus } from "../category1/types";

export type { Scope3SpendStatus };

export type TravelCategory = "BUSINESS_TRAVEL" | "EMPLOYEE_COMMUTING";
export type TransportMode = "LAND" | "AIR" | "SEA";

export type LandFuelType =
    | "diesel"
    | "petrol"
    | "hybrid"
    | "cng"
    | "lpg"
    | "unknown"
    | "phev"
    | "bev"
    | "general";

export type AirHaulType = "Domestic" | "Short-haul" | "Long-haul" | "International";
export type AirCabinClass =
    | "Average passenger"
    | "Economy class"
    | "Premium economy class"
    | "Business class"
    | "First class";

export type SeaPassengerType = "Foot passenger" | "Car passenger" | "Average (all passenger)";

export type TravelTripDto = {
    id?: string;
    trip_order: number;
    transport_mode: TransportMode;
    description: string;
    distance: number;
    unit_id?: string;
    source_id?: string;
    // LAND fields
    car_type_id?: string | null;
    car_type_name?: string | null;
    fuel_type?: LandFuelType | null;
    // AIR fields
    haul_type?: AirHaulType | null;
    cabin_class?: AirCabinClass | null;
    include_rf?: boolean | null;
    // SEA fields
    passenger_type?: SeaPassengerType | null;
    // Calculated trip emissions
    calculated_kg_co2e?: number;
    calculated_t_co2e?: number;
};

export type TravelTrip = {
    id?: string;
    tripOrder: number;
    transportMode: TransportMode;
    description: string;
    distance: number;
    unitId?: string;
    sourceId?: string;
    // LAND fields
    carTypeId?: string;
    carTypeName?: string;
    fuelType?: LandFuelType;
    // AIR fields
    haulType?: AirHaulType;
    cabinClass?: AirCabinClass;
    includeRf?: boolean;
    // SEA fields
    passengerType?: SeaPassengerType;
    // Calculated trip emissions
    calculatedKgCo2e?: number;
    calculatedTCo2e?: number;
};

export type TravelActivityDto = {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    category: TravelCategory;
    title: string;
    description: string | null;
    facility_id: string | null;
    facility_name?: string | null;
    reporting_period_id: string | null;
    reporting_period_name?: string | null;
    start_date: string;
    end_date: string;
    status: Scope3SpendStatus;
    notes?: string | null;
    rejected_reason?: string | null;
    amended_from_id?: string | null;

    // Aggregated Emissions & Distances
    total_distance_km: number;
    total_kg_co2e: number;
    total_t_co2e: number;
    total_kg_co2?: number;
    total_t_co2?: number;
    total_kg_ch4?: number;
    total_t_ch4?: number;
    total_kg_n2o?: number;
    total_t_n2o?: number;

    // Mode breakdowns
    land_t_co2e?: number;
    air_t_co2e?: number;
    sea_t_co2e?: number;

    trips: TravelTripDto[];
};

export type TravelActivityEntry = {
    id: string;
    createdAt: string;
    updatedAt: string;
    category: TravelCategory;
    title: string;
    description: string | null;
    facilityId: string | null;
    facilityName: string | null;
    reportingPeriodId: string | null;
    reportingPeriodName: string;
    startDate: string;
    endDate: string;
    status: Scope3SpendStatus;
    notes: string | null;
    rejectedReason: string | null;
    amendedFromId: string | null;

    totalDistanceKm: number;
    totalKgCo2e: number;
    totalTCo2e: number;
    totalKgCo2: number;
    totalTCo2: number;
    totalKgCh4: number;
    totalTCh4: number;
    totalKgN2o: number;
    totalTN2o: number;

    landTCo2e: number;
    airTCo2e: number;
    seaTCo2e: number;

    trips: TravelTrip[];
};

export type CreateTravelActivityPayload = {
    category: TravelCategory;
    title: string;
    description?: string | null;
    facility_id?: string | null;
    reporting_period_id?: string | null;
    start_date: string;
    end_date: string;
    status?: Scope3SpendStatus;
    notes?: string | null;
    trips: TravelTripDto[];
};

export type UpdateTravelActivityPayload = Partial<CreateTravelActivityPayload>;

export type AmendTravelActivityPayload = CreateTravelActivityPayload & {
    amended_from_id: string;
};

export type TravelFilterParams = {
    category?: TravelCategory;
    facility_id?: string;
    reporting_period_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    page_size?: number;
};

export type TravelSummaryData = {
    category: TravelCategory;
    reporting_period_id: string | null;
    total_activities_count: number;
    total_distance_km: number;
    total_kg_co2e: number;
    total_t_co2e: number;
    mode_breakdown: {
        LAND: number;
        AIR: number;
        SEA: number;
    };
};

export type CarTypeCategory = string;

export type CarType = {
    id: string;
    name: string;
    slug?: string;
    activity_category: string;
    source_id?: string;
    is_active?: boolean;
};

export const DEFAULT_CAR_TYPES: CarType[] = [
    {
        id: "8d0bbc29-5c0b-45ea-8f97-24d7e6b90df7",
        name: "Dual purpose 4X4",
        activity_category: "Cars (by market segment)",
    },
    {
        id: "car-type-medium",
        name: "Medium Car (Upper Medium)",
        activity_category: "Cars (by market segment)",
    },
    {
        id: "car-type-small",
        name: "Small Car (Compact)",
        activity_category: "Cars (by market segment)",
    },
    {
        id: "car-type-taxi",
        name: "Regular Black Cab / Taxi",
        activity_category: "Taxis",
    },
    {
        id: "car-type-bus",
        name: "Local Bus (Average passenger)",
        activity_category: "Bus",
    },
    {
        id: "car-type-rail",
        name: "National Rail / Intercity Train",
        activity_category: "Rail",
    },
];

export const DEFAULT_AIR_HAUL_TYPES: AirHaulType[] = ["Domestic", "Short-haul", "Long-haul", "International"];

export const DEFAULT_AIR_CABIN_CLASSES: AirCabinClass[] = [
    "Average passenger",
    "Economy class",
    "Premium economy class",
    "Business class",
    "First class",
];

export const DEFAULT_SEA_PASSENGER_TYPES: SeaPassengerType[] = [
    "Foot passenger",
    "Car passenger",
    "Average (all passenger)",
];
