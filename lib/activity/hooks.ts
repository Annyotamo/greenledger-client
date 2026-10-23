import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getFuelActivities,
    getFuelActivityById,
    approveFuelActivity,
    verifyFuelActivity,
    rejectFuelActivity,
    submitFuelActivity,
    deleteFuelActivity,
    amendFuelActivity,
    getElectricityActivities,
    getElectricityActivityById,
} from "./api";

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

export function useApproveFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, string>({
        mutationFn: (activityId: string) => approveFuelActivity(activityId),
        onSuccess: (_data, activityId) => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activity", activityId] });
            queryClient.invalidateQueries({ queryKey: ["ghg-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["energy-dashboard"] });
        },
    });
}

/** Backward-compatible alias for useApproveFuelActivity */
export function useVerifyFuelActivity() {
    return useApproveFuelActivity();
}

export function useRejectFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, { activityId: string; rejectedReason: string }>({
        mutationFn: ({ activityId, rejectedReason }) => rejectFuelActivity(activityId, rejectedReason),
        onSuccess: (_data, { activityId }) => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activity", activityId] });
            queryClient.invalidateQueries({ queryKey: ["ghg-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["energy-dashboard"] });
        },
    });
}

export function useSubmitFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, string>({
        mutationFn: (activityId: string) => submitFuelActivity(activityId),
        onSuccess: (_data, activityId) => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activity", activityId] });
        },
    });
}

export function useDeleteFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, string>({
        mutationFn: (activityId: string) => deleteFuelActivity(activityId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["ghg-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["energy-dashboard"] });
        },
    });
}

export function useAmendFuelActivity() {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, { activityId: string; payload: Record<string, unknown> }>({
        mutationFn: ({ activityId, payload }) => amendFuelActivity(activityId, payload),
        onSuccess: (_data, { activityId }) => {
            queryClient.invalidateQueries({ queryKey: ["fuel-activities"] });
            queryClient.invalidateQueries({ queryKey: ["fuel-activity", activityId] });
            queryClient.invalidateQueries({ queryKey: ["ghg-dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["energy-dashboard"] });
        },
    });
}

export function useElectricityActivities(filters?: {
    status?: string;
    accounting_method?: string;
    electricity_activity_type?: string;
    has_market_instrument?: boolean;
    market_instrument_type?: string;
    data_quality_tier?: string;
    source_type?: string;
    facility_id?: string;
    reporting_period_id?: string;
    activity_start_date?: string;
    activity_end_date?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: string;
}) {
    return useQuery({
        queryKey: ["electricity-activities", filters],
        queryFn: () => getElectricityActivities(filters),
    });
}

export function useElectricityActivity(activityId: string | null) {
    return useQuery({
        queryKey: ["electricity-activity", activityId],
        queryFn: () => getElectricityActivityById(activityId!),
        enabled: Boolean(activityId),
    });
}


