import { useQuery } from "@tanstack/react-query";
import { getFuelActivities, getFuelActivityById, getElectricityActivities } from "./api";

export function useFuelActivities(filters?: {
    status?: string;
    usage_type?: string;
    emission_type?: string;
    facility_id?: string;
    reporting_period_id?: string;
    meter_id?: string;
    fuel_id?: string;
    data_quality_tier?: string;
    activity_start_date?: string;
    activity_end_date?: string;
    page?: number;
    page_size?: number;
}) {
    return useQuery({
        queryKey: ["fuel-activities", filters],
        queryFn: () => getFuelActivities(filters),
    });
}

export function useFuelActivity(activityId: string | null) {
    return useQuery({
        queryKey: ["fuel-activity", activityId],
        queryFn: () => getFuelActivityById(activityId!),
        enabled: Boolean(activityId),
    });
}

export function useElectricityActivities(filters?: {
    status?: string;
    electricity_activity_type?: string;
    data_quality_tier?: string;
    source_type?: string;
    facility_id?: string;
}) {
    return useQuery({
        queryKey: ["electricity-activities", filters],
        queryFn: () => getElectricityActivities(filters),
    });
}
