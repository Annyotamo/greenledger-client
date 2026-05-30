import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFuelActivities, getElectricityActivities } from "./api";

export function useFuelActivities() {
    return useQuery({
        queryKey: ["fuel-activities"],
        queryFn: getFuelActivities,
    });
}

export function useElectricityActivities() {
    return useQuery({
        queryKey: ["electricity-activities"],
        queryFn: getElectricityActivities,
    });
}
