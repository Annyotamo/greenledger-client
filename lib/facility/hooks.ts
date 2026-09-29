"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createFacility,
    createSubUnit,
    deleteSubUnit,
    getFacilities,
    getFacilityById,
    getSubUnitById,
    getSubUnits,
    updateSubUnit,
} from "./api";
import type {
    CreateFacilityPayload,
    CreateSubUnitPayload,
    Facility,
    FacilitySubUnit,
    UpdateSubUnitPayload,
} from "./types";

export function useFacilities() {
    return useQuery<Facility[], Error>({
        queryKey: ["facilities"],
        queryFn: getFacilities,
    });
}

export function useFacility(facilityId: string) {
    return useQuery<Facility, Error>({
        queryKey: ["facility", facilityId],
        queryFn: () => getFacilityById(facilityId),
        enabled: Boolean(facilityId),
    });
}

export function useCreateFacility() {
    const queryClient = useQueryClient();

    return useMutation<Facility, Error, CreateFacilityPayload>({
        mutationFn: createFacility,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["facilities"] }),
    });
}

export function useSubUnits(
    facilityId: string,
    filters?: {
        active_only?: boolean;
        sub_unit_type?: string;
        status?: string;
    }
) {
    return useQuery<FacilitySubUnit[], Error>({
        queryKey: ["facility-sub-units", facilityId, filters],
        queryFn: () => getSubUnits(facilityId, filters),
        enabled: Boolean(facilityId),
    });
}

export function useSubUnit(facilityId: string, subUnitId: string) {
    return useQuery<FacilitySubUnit, Error>({
        queryKey: ["facility-sub-unit", facilityId, subUnitId],
        queryFn: () => getSubUnitById(facilityId, subUnitId),
        enabled: Boolean(facilityId && subUnitId),
    });
}

export function useCreateSubUnit(facilityId: string) {
    const queryClient = useQueryClient();

    return useMutation<FacilitySubUnit, Error, CreateSubUnitPayload>({
        mutationFn: (payload) => createSubUnit(facilityId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["facility-sub-units", facilityId] });
            queryClient.invalidateQueries({ queryKey: ["facility", facilityId] });
            queryClient.invalidateQueries({ queryKey: ["facilities"] });
        },
    });
}

export function useUpdateSubUnit(facilityId: string) {
    const queryClient = useQueryClient();

    return useMutation<FacilitySubUnit, Error, { subUnitId: string; payload: UpdateSubUnitPayload }>({
        mutationFn: ({ subUnitId, payload }) => updateSubUnit(facilityId, subUnitId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["facility-sub-units", facilityId] });
            queryClient.invalidateQueries({ queryKey: ["facility", facilityId] });
            queryClient.invalidateQueries({ queryKey: ["facilities"] });
        },
    });
}

export function useDeleteSubUnit(facilityId: string) {
    const queryClient = useQueryClient();

    return useMutation<{ id: string; is_active: boolean; status: string }, Error, string>({
        mutationFn: (subUnitId) => deleteSubUnit(facilityId, subUnitId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["facility-sub-units", facilityId] });
            queryClient.invalidateQueries({ queryKey: ["facility", facilityId] });
            queryClient.invalidateQueries({ queryKey: ["facilities"] });
        },
    });
}

