import { privateApi } from "@/lib/http/client";
import type { TenantProfile, TenantProfileApiResponse, TenantProfileDto } from "./types";

function mapTenantProfile(dto: TenantProfileDto): TenantProfile {
    return {
        companyName: dto.company_name,
        legalCompanyName: dto.legal_company_name,
        companyEmail: dto.company_email,
        companyPhone: dto.company_phone,
        website: dto.website,
        country: dto.country,
        state: dto.state,
        city: dto.city,
        addressLine1: dto.address_line_1,
        addressLine2: dto.address_line_2,
        postalCode: dto.postal_code,
        industryType: dto.industry_type,
        sector: dto.sector,
        organizationSize: dto.organization_size,
        id: dto.id,
        tenantCode: dto.tenant_code,
        slug: dto.slug,
        maxUsers: dto.max_users,
        maxFacilities: dto.max_facilities,
        tenantStatus: dto.tenant_status,
        isVerified: dto.is_verified,
        onboardingCompleted: dto.onboarding_completed,
        isActive: dto.is_active,
        logoUrl: dto.logo_url,
        bannerImageUrl: dto.banner_image_url,
    };
}

export async function getTenantProfile(): Promise<TenantProfile> {
    const response = await privateApi.get<TenantProfileApiResponse>("/tenant/profile");
    return mapTenantProfile(response.data.data);
}
