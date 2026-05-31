import { publicApi } from "@/lib/http/client";

export type RegisterTenantPayload = {
    companyName: string;
    legalCompanyName: string;
    companyEmail: string;
    companyPhone: string;
    website: string;
    industryType: string;
    sector: string;
    organizationSize: string;
    country: string;
    state: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    adminFirstName: string;
    adminLastName: string;
    adminEmail: string;
    adminPassword: string;
    adminJobTitle?: string;
    adminPhoneNumber?: string;
    createReportingPeriod?: boolean;
    reportingPeriodName?: string;
    reportingYear?: number;
    reportingPeriodStart?: string;
    reportingPeriodEnd?: string;
    createFacility?: boolean;
    facilityName?: string;
    facilityCode?: string;
    facilityDescription?: string;
    facilityCountry?: string;
    facilityState?: string;
    facilityCity?: string;
    facilityAddressLine1?: string;
    facilityAddressLine2?: string;
    facilityPostalCode?: string;
    facilityTimezone?: string;
};

type AuthApiResponse = {
    success: boolean;
    message?: string;
    data?: Record<string, unknown>;
    status_code?: number;
    error?: unknown;
};

export async function registerTenant(payload: RegisterTenantPayload): Promise<AuthApiResponse> {
    const body = {
        company_name: payload.companyName,
        legal_company_name: payload.legalCompanyName,
        company_email: payload.companyEmail,
        company_phone: payload.companyPhone,
        website: payload.website,
        industry_type: payload.industryType,
        sector: payload.sector,
        organization_size: payload.organizationSize,
        country: payload.country,
        state: payload.state,
        city: payload.city,
        address_line_1: payload.addressLine1,
        address_line_2: payload.addressLine2,
        postal_code: payload.postalCode,
        admin_user: {
            first_name: payload.adminFirstName,
            last_name: payload.adminLastName,
            email: payload.adminEmail,
            password: payload.adminPassword,
            job_title: payload.adminJobTitle,
            phone_number: payload.adminPhoneNumber,
        },
        onboarding: {
            create_reporting_period: payload.createReportingPeriod,
            reporting_period: payload.createReportingPeriod
                ? {
                      name: payload.reportingPeriodName,
                      reporting_year: payload.reportingYear,
                      period_start: payload.reportingPeriodStart,
                      period_end: payload.reportingPeriodEnd,
                  }
                : undefined,
            create_facility: payload.createFacility,
            facility: payload.createFacility
                ? {
                      name: payload.facilityName,
                      facility_code: payload.facilityCode,
                      description: payload.facilityDescription,
                      country: payload.facilityCountry,
                      state: payload.facilityState,
                      city: payload.facilityCity,
                      address_line_1: payload.facilityAddressLine1,
                      address_line_2: payload.facilityAddressLine2,
                      postal_code: payload.facilityPostalCode,
                      timezone: payload.facilityTimezone,
                  }
                : undefined,
        },
    };

    const response = await publicApi.post<AuthApiResponse>('/user/auth/register', body);
    return response.data;
}
