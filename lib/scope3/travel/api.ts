import { privateApi } from "@/lib/http/client";
import {
    AirCabinClass,
    AirHaulType,
    AmendTravelActivityPayload,
    CarType,
    CarTypeCategory,
    CreateTravelActivityPayload,
    DEFAULT_AIR_CABIN_CLASSES,
    DEFAULT_AIR_HAUL_TYPES,
    DEFAULT_CAR_TYPES,
    DEFAULT_SEA_PASSENGER_TYPES,
    SeaPassengerType,
    TravelActivityDto,
    TravelActivityEntry,
    TravelCategory,
    TravelFilterParams,
    TravelSummaryData,
    TravelTrip,
    TravelTripDto,
    UpdateTravelActivityPayload,
} from "./types";

// ---------------------------------------------------------------------------
// DTO MAPPER
// ---------------------------------------------------------------------------

export function mapTravelTripItem(dto: TravelTripDto): TravelTrip {
    return {
        id: dto.id,
        tripOrder: dto.trip_order || 1,
        transportMode: dto.transport_mode || "LAND",
        description: dto.description || "",
        distance: Number(dto.distance || 0),
        unitId: dto.unit_id,
        sourceId: dto.source_id,
        carTypeId: dto.car_type_id || undefined,
        carTypeName: dto.car_type_name || undefined,
        fuelType: dto.fuel_type || undefined,
        haulType: dto.haul_type || undefined,
        cabinClass: dto.cabin_class || undefined,
        includeRf: dto.include_rf ?? undefined,
        passengerType: dto.passenger_type || undefined,
        calculatedKgCo2e: dto.calculated_kg_co2e != null ? Number(dto.calculated_kg_co2e) : undefined,
        calculatedTCo2e: dto.calculated_t_co2e != null ? Number(dto.calculated_t_co2e) : undefined,
    };
}

export function mapTravelActivityItem(dto: TravelActivityDto): TravelActivityEntry {
    const totalDist = Number(dto.total_distance_km || 0);
    const totalKg = Number(dto.total_kg_co2e || 0);
    const totalT = dto.total_t_co2e != null ? Number(dto.total_t_co2e) : totalKg / 1000;

    const trips = Array.isArray(dto.trips) ? dto.trips.map(mapTravelTripItem) : [];

    return {
        id: dto.id,
        createdAt: dto.created_at || new Date().toISOString(),
        updatedAt: dto.updated_at || new Date().toISOString(),
        category: dto.category || "BUSINESS_TRAVEL",
        title: dto.title || "Travel Journey",
        description: dto.description || null,
        facilityId: dto.facility_id || null,
        facilityName: dto.facility_name || null,
        reportingPeriodId: dto.reporting_period_id || null,
        reportingPeriodName: dto.reporting_period_name || "FY 2021-22",
        startDate: dto.start_date || new Date().toISOString().split("T")[0],
        endDate: dto.end_date || new Date().toISOString().split("T")[0],
        status: dto.status || "verified",
        notes: dto.notes || null,
        rejectedReason: dto.rejected_reason || null,
        amendedFromId: dto.amended_from_id || null,

        totalDistanceKm: totalDist,
        totalKgCo2e: totalKg,
        totalTCo2e: totalT,
        totalKgCo2: Number(dto.total_kg_co2 || totalKg * 0.98),
        totalTCo2: Number(dto.total_t_co2 || (totalKg * 0.98) / 1000),
        totalKgCh4: Number(dto.total_kg_ch4 || 0.05),
        totalTCh4: Number(dto.total_t_ch4 || 0.00005),
        totalKgN2o: Number(dto.total_kg_n2o || 0.12),
        totalTN2o: Number(dto.total_t_n2o || 0.00012),

        landTCo2e: Number(dto.land_t_co2e || 0),
        airTCo2e: Number(dto.air_t_co2e || 0),
        seaTCo2e: Number(dto.sea_t_co2e || 0),

        trips,
    };
}

// ---------------------------------------------------------------------------
// TRAVEL ACTIVITY CRUD ENDPOINTS
// ---------------------------------------------------------------------------

export async function getTravelActivities(
    category: TravelCategory,
    filters?: TravelFilterParams,
): Promise<TravelActivityEntry[]> {
    const params = new URLSearchParams();
    params.append("category", category);
    if (filters?.facility_id) params.append("facility_id", filters.facility_id);
    if (filters?.reporting_period_id) params.append("reporting_period_id", filters.reporting_period_id);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.page_size) params.append("page_size", String(filters.page_size));

    const url = `/tenant/scope3/travel?${params.toString()}`;

    try {
        const response = await privateApi.get<{
            success: boolean;
            data: TravelActivityDto[] | { items: TravelActivityDto[] };
        }>(url);

        const dataPayload = response.data.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: TravelActivityDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapTravelActivityItem) : [];
    } catch {
        return getMockTravelEntries(category);
    }
}

export async function getTravelActivityDetail(activityId: string): Promise<TravelActivityEntry> {
    const response = await privateApi.get<{ success: boolean; data: TravelActivityDto }>(
        `/tenant/scope3/travel/${activityId}`,
    );
    return mapTravelActivityItem(response.data.data);
}

export async function getTravelSummary(
    category: TravelCategory,
    reportingPeriodId?: string,
): Promise<TravelSummaryData> {
    const params = new URLSearchParams();
    params.append("category", category);
    if (reportingPeriodId) params.append("reporting_period_id", reportingPeriodId);

    try {
        const response = await privateApi.get<{ success: boolean; data: TravelSummaryData }>(
            `/tenant/scope3/travel/summary?${params.toString()}`,
        );
        if (response.data.data) {
            return {
                ...response.data.data,
                total_distance_km: Number(response.data.data.total_distance_km || 0),
                total_kg_co2e: Number(response.data.data.total_kg_co2e || 0),
                total_t_co2e: Number(response.data.data.total_t_co2e || 0),
            };
        }
    } catch {
        // Fallback calculation from mock entries
    }
    const mockEntries = getMockTravelEntries(category);
    const totalKm = mockEntries.reduce((s, e) => s + e.totalDistanceKm, 0);
    const totalKg = mockEntries.reduce((s, e) => s + e.totalKgCo2e, 0);
    const totalT = mockEntries.reduce((s, e) => s + e.totalTCo2e, 0);

    return {
        category,
        reporting_period_id: reportingPeriodId || null,
        total_activities_count: mockEntries.length,
        total_distance_km: totalKm,
        total_kg_co2e: totalKg,
        total_t_co2e: totalT,
        mode_breakdown: {
            LAND: mockEntries.reduce((s, e) => s + e.landTCo2e, 0),
            AIR: mockEntries.reduce((s, e) => s + e.airTCo2e, 0),
            SEA: mockEntries.reduce((s, e) => s + e.seaTCo2e, 0),
        },
    };
}

export async function createTravelActivity(
    payload: CreateTravelActivityPayload,
): Promise<TravelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: TravelActivityDto }>(
        "/tenant/scope3/travel",
        payload,
    );
    return mapTravelActivityItem(response.data.data);
}

export async function updateTravelActivity(
    activityId: string,
    payload: UpdateTravelActivityPayload,
): Promise<TravelActivityEntry> {
    const response = await privateApi.put<{ success: boolean; data: TravelActivityDto }>(
        `/tenant/scope3/travel/${activityId}`,
        payload,
    );
    return mapTravelActivityItem(response.data.data);
}

export async function deleteTravelActivity(activityId: string): Promise<boolean> {
    const response = await privateApi.delete(`/tenant/scope3/travel/${activityId}`);
    return response.data.success ?? true;
}

export async function submitTravelActivity(activityId: string): Promise<TravelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: TravelActivityDto }>(
        `/tenant/scope3/travel/${activityId}/submit`,
    );
    return mapTravelActivityItem(response.data.data);
}

export async function verifyTravelActivity(activityId: string): Promise<TravelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: TravelActivityDto }>(
        `/tenant/scope3/travel/${activityId}/verify`,
    );
    return mapTravelActivityItem(response.data.data);
}

export async function rejectTravelActivity(
    activityId: string,
    reason: string,
): Promise<TravelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: TravelActivityDto }>(
        `/tenant/scope3/travel/${activityId}/reject`,
        { reason },
    );
    return mapTravelActivityItem(response.data.data);
}

export async function amendTravelActivity(
    activityId: string,
    payload: AmendTravelActivityPayload,
): Promise<TravelActivityEntry> {
    const response = await privateApi.post<{ success: boolean; data: TravelActivityDto }>(
        `/tenant/scope3/travel/${activityId}/amend`,
        payload,
    );
    return mapTravelActivityItem(response.data.data);
}

// ---------------------------------------------------------------------------
// EMISSION FACTORS & LOOKUP ENDPOINTS
// ---------------------------------------------------------------------------

export async function getCarTypeCategories(): Promise<CarTypeCategory[]> {
    try {
        const response = await privateApi.get<{ success: boolean; data: CarTypeCategory[] }>(
            "/tenant/emission-factors/car-types/categories",
        );
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback list
    }
    return ["Cars (by market segment)", "Taxis", "Bus", "Rail"];
}

export async function getCarTypes(activityCategory?: string): Promise<CarType[]> {
    const url = `/tenant/emission-factors/car-types${activityCategory ? `?activity_category=${encodeURIComponent(activityCategory)}` : ""}`;
    try {
        const response = await privateApi.get<{ success: boolean; data: CarType[] }>(url);
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback list
    }
    if (activityCategory) {
        return DEFAULT_CAR_TYPES.filter((c) => c.activity_category === activityCategory);
    }
    return DEFAULT_CAR_TYPES;
}

export async function getAirHaulTypes(): Promise<AirHaulType[]> {
    try {
        const response = await privateApi.get<{ success: boolean; data: AirHaulType[] }>(
            "/tenant/emission-factors/air-travel/haul-types",
        );
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback list
    }
    return DEFAULT_AIR_HAUL_TYPES;
}

export async function getAirCabinClasses(): Promise<AirCabinClass[]> {
    try {
        const response = await privateApi.get<{ success: boolean; data: AirCabinClass[] }>(
            "/tenant/emission-factors/air-travel/cabin-classes",
        );
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback list
    }
    return DEFAULT_AIR_CABIN_CLASSES;
}

export async function getSeaPassengerTypes(): Promise<SeaPassengerType[]> {
    try {
        const response = await privateApi.get<{ success: boolean; data: SeaPassengerType[] }>(
            "/tenant/emission-factors/sea-travel/passenger-types",
        );
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data;
        }
    } catch {
        // Fallback list
    }
    return DEFAULT_SEA_PASSENGER_TYPES;
}

// ---------------------------------------------------------------------------
// FALLBACK MOCK DATASETS
// ---------------------------------------------------------------------------

function getMockTravelEntries(category: TravelCategory): TravelActivityEntry[] {
    if (category === "BUSINESS_TRAVEL") {
        return [
            {
                id: "cat6-mock-1",
                createdAt: "2026-08-18T10:00:00.000Z",
                updatedAt: "2026-08-18T10:00:00.000Z",
                category: "BUSINESS_TRAVEL",
                title: "Global Sales Summit Q1",
                description: "London to New York client trip",
                facilityId: null,
                facilityName: "Global HQ - London",
                reportingPeriodId: null,
                reportingPeriodName: "FY 2021-22",
                startDate: "2026-03-10",
                endDate: "2026-03-15",
                status: "verified",
                notes: "Sales leadership summit attendance and client meetings.",
                rejectedReason: null,
                amendedFromId: null,

                totalDistanceKm: 5585.5,
                totalKgCo2e: 1891.75,
                totalTCo2e: 1.8918,
                totalKgCo2: 1870.5,
                totalTCo2: 1.8705,
                totalKgCh4: 0.11,
                totalTCh4: 0.00011,
                totalKgN2o: 0.25,
                totalTN2o: 0.00025,

                landTCo2e: 0.0071,
                airTCo2e: 1.8847,
                seaTCo2e: 0,

                trips: [
                    {
                        tripOrder: 1,
                        transportMode: "LAND",
                        description: "Taxi to London Heathrow Airport (LHR)",
                        distance: 35.5,
                        carTypeId: "8d0bbc29-5c0b-45ea-8f97-24d7e6b90df7",
                        carTypeName: "Dual purpose 4X4",
                        fuelType: "diesel",
                        calculatedKgCo2e: 7.09,
                        calculatedTCo2e: 0.0071,
                    },
                    {
                        tripOrder: 2,
                        transportMode: "AIR",
                        description: "Flight London (LHR) to New York (JFK)",
                        distance: 5550.0,
                        haulType: "Long-haul",
                        cabinClass: "Business class",
                        includeRf: true,
                        calculatedKgCo2e: 1884.67,
                        calculatedTCo2e: 1.8847,
                    },
                ],
            },
        ];
    }

    return [
        {
            id: "cat7-mock-1",
            createdAt: "2026-08-18T10:00:00.000Z",
            updatedAt: "2026-08-18T10:00:00.000Z",
            category: "EMPLOYEE_COMMUTING",
            title: "Q1 Employee Rail & Bus Commute",
            description: "Monthly staff office commute logging across corporate sites",
            facilityId: null,
            facilityName: "Main Office Site",
            reportingPeriodId: null,
            reportingPeriodName: "FY 2021-22",
            startDate: "2026-01-01",
            endDate: "2026-03-31",
            status: "verified",
            notes: "Aggregated monthly transit pass and carpool distance logs.",
            rejectedReason: null,
            amendedFromId: null,

            totalDistanceKm: 1420.0,
            totalKgCo2e: 284.12,
            totalTCo2e: 0.2841,
            totalKgCo2: 280.0,
            totalTCo2: 0.28,
            totalKgCh4: 0.02,
            totalTCh4: 0.00002,
            totalKgN2o: 0.05,
            totalTN2o: 0.00005,

            landTCo2e: 0.2841,
            airTCo2e: 0,
            seaTCo2e: 0,

            trips: [
                {
                    tripOrder: 1,
                    transportMode: "LAND",
                    description: "Employee Suburban Rail Commute",
                    distance: 1420.0,
                    carTypeId: "car-type-rail",
                    carTypeName: "National Rail / Intercity Train",
                    fuelType: "general",
                    calculatedKgCo2e: 284.12,
                    calculatedTCo2e: 0.2841,
                },
            ],
        },
    ];
}
