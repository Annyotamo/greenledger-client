"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFacility, getFacilities } from "./api";
import type { CreateFacilityPayload, Facility } from "./types";

export function useFacilities() {
    return useQuery<Facility[], Error>({
        queryKey: ["facilities"],
        queryFn: getFacilities,
    });
}

export function useCreateFacility() {
    const queryClient = useQueryClient();

    return useMutation<Facility, Error, CreateFacilityPayload>({
        mutationFn: createFacility,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["facilities"] }),
    });
}
