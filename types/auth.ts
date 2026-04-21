import type { ApiEnvelope } from "@/types/api/common";

export type LoginMode = "identity" | "email";

export interface LoginInput {
    identity: string;
    password: string;
}

export interface LoginByEmailPayload {
    email: string;
    password: string;
}

export interface LoginByUsernamePayload {
    userName: string;
    password: string;
}

export type LoginPayload = LoginByEmailPayload | LoginByUsernamePayload;

export type LoginResponse = ApiEnvelope<string>;
