"use client";

import { useTenantProfile } from "@/lib/tenantProfile/hooks";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function TenantDashboardBanner() {
    const { data: profile, isLoading, isError } = useTenantProfile();

    if (isLoading) {
        return (
            <div className="h-40 w-full animate-pulse rounded-xl border border-outline-variant bg-surface-container-low" />
        );
    }

    if (isError || !profile) {
        return null;
    }

    const bannerUrl = profile.bannerImageUrl;
    const logoUrl = profile.logoUrl;

    return (
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-sm">
            {/* Background Image or Fallback ESG Gradient */}
            {bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={bannerUrl}
                    alt={`${profile.companyName} Cover`}
                    className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900" />
            )}

            {/* Tint overlay for contrast and typography readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="flex items-center gap-4 md:gap-6">
                    {logoUrl && (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white p-1.5 shadow-md md:h-20 md:w-20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={logoUrl}
                                alt={`${profile.companyName} Logo`}
                                className="h-full w-full object-contain select-none"
                            />
                        </div>
                    )}
                    <div className="min-w-0 text-white">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-emerald-200">
                                Workspace
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider bg-emerald-500/30 px-2 py-0.5 rounded text-emerald-100">
                                {profile.tenantCode}
                            </span>
                        </div>
                        <h1 className="mt-1 truncate text-xl font-bold tracking-tight md:text-2xl lg:text-3xl text-white">
                            {profile.companyName}
                        </h1>
                        <p className="mt-1 truncate text-xs text-emerald-100/80 md:text-sm">
                            {profile.sector} • {profile.industryType} • {profile.city}, {profile.country}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
