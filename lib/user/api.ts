import { privateApi } from "@/lib/http/client";

type UserPermissionMode = "WRITE" | "READ_ONLY" | "NO_ACCESS";

export type UserPermissions = {
    scope1: UserPermissionMode;
    scope2: UserPermissionMode;
    facilities: UserPermissionMode;
    users: UserPermissionMode;
    company: UserPermissionMode;
    reports: UserPermissionMode;
};

export type UserRecord = {
    id: string;
    name: string;
    email: string;
    company: string;
    facilityName: string | null;
    facilityId: string | null;
    tenantId: string;
    role: string;
    phNo: number | string | null;
    active: boolean;
    validatedUser: boolean;
    creationDate: string;
    updateDate: string;
    userName: string;
    permissions: UserPermissions | null;
    superAdmin: boolean;
    lastLogin: string;
};

export type NewUserInput = {
    name: string;
    email: string;
    company: string;
    tenantId: string;
    role: string;
    facilityName: string;
    facilityId: string;
    phNo: number | string;
    userName: string;
    password: string;
    superAdmin: boolean;
    permissions: UserPermissions;
};

const responseData = <T>(data: unknown): T => {
    return data as T;
};

export async function getAllUsers(): Promise<UserRecord[]> {
    const res = await privateApi.get("/user/getAllUser");
    const data = res.data?.data ?? res.data;
    if (!Array.isArray(data)) {
        throw new Error("Unexpected users response format");
    }
    return responseData<UserRecord[]>(data);
}

export async function addUser(input: NewUserInput): Promise<UserRecord> {
    const payload = {
        ...input,
        phNo: input.phNo === "" ? null : Number(input.phNo),
    };
    const res = await privateApi.post("/user/addUser", payload);
    const data = res.data?.data ?? res.data;
    if (!data || typeof data !== "object") {
        throw new Error("Unexpected add user response format");
    }
    return responseData<UserRecord>(data as UserRecord);
}
