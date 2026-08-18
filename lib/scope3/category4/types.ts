import {
    Category1FilterParams,
    Category1SpendEntry,
    Category1SpendItemDto,
    CreateCategory1SpendPayload,
    EmissionFactorSource,
    Scope3SpendFactor,
    Scope3SpendFactorDto,
    Scope3SpendStatus,
    UpdateCategory1SpendPayload,
} from "../category1/types";

export type {
    EmissionFactorSource,
    Scope3SpendFactor,
    Scope3SpendFactorDto,
    Scope3SpendStatus,
};

export type Category4SpendDto = Category1SpendItemDto;
export type Category4SpendEntry = Category1SpendEntry;
export type CreateCategory4SpendPayload = CreateCategory1SpendPayload;
export type UpdateCategory4SpendPayload = UpdateCategory1SpendPayload;
export type AmendCategory4SpendPayload = CreateCategory1SpendPayload & {
    amended_from_id: string;
};
export type Category4SpendFilterParams = Category1FilterParams;
