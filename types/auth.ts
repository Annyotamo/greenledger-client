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

export type AuthUser = {
    role: string;
    name: string;
    id: string;
    userName: string;
    email: string;
};

export type LoginResponse = {
    // new format
    data?: AuthUser | string;
    token?: string;
    success?: boolean;
    status?: number;
    message?: string;
    timestamp?: string;

    // backward compat (older format used `data` as token)
    response?: string;
    stsCode?: number;
};

export type OtpVerifyResponse = {
    data?: AuthUser;
    token?: string;
    success?: boolean;
    status?: number;
    message?: string;
    timestamp?: string;
};

export interface OtpVerifyInput {
    email: string;
    otp: string;
}
