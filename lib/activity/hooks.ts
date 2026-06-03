import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFuelActivities, getElectricityActivities } from "./api";

export function useFuelActivities(filters?: {
    status?: string;
    usage_type?: string;
    emission_type?: string;
    facility_id?: string;
    page?: number;
}) {
    return useQuery({
        queryKey: ["fuel-activities", filters],
        queryFn: () => getFuelActivities(filters),
    });
}

export function useElectricityActivities() {
    return useQuery({
        queryKey: ["electricity-activities"],
        queryFn: getElectricityActivities,
    });
}
