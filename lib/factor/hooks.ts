"use client";

import { useMutation } from "@tanstack/react-query";
import { addFactor } from "@/lib/factor/api";
import type { AddFactorRequest } from "@/types/factor";

export function useAddFactorMutation() {
    return useMutation({
        mutationFn: (payload: AddFactorRequest) => addFactor(payload),
    });
}
