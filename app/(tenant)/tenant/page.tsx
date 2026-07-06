"use client";

import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { TenantProfileSummary } from "@/components/tenantProfile/TenantProfileSummary";
import { useTenantProfile } from "@/lib/tenantProfile/hooks";

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-outline-variant py-3 last:border-b-0">
            <span className="font-label-md uppercase tracking-[0.05em] text-on-surface-variant">{label}</span>
            <span className="text-body-md text-on-surface">{value}</span>
        </div>
    );
}

export default function TenantProfilePage() {
    const { data: profile, isPending, isError } = useTenantProfile();

    if (isPending) {
        return <div className="p-card-padding text-on-surface-variant">Loading tenant profile…</div>;
    }

    if (isError || !profile) {
        return <div className="p-card-padding text-error">Unable to load tenant profile.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Tenant Profile</h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Review your tenant information, organization settings and contact details.
                    </p>
                </div>
            </div>

            {/* Elegant Cover & Logo Card */}
            <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
                {/* Banner Cover Image / Gradient */}
                <div className="relative h-48 w-full md:h-64">
                    {profile.bannerImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={profile.bannerImageUrl}
                            alt={`${profile.companyName} Cover`}
                            className="h-full w-full object-cover select-none pointer-events-none"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900" />
                    )}
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-black/25" />
                </div>

                {/* Logo & Basic Info Container (Flex-based overlap layout) */}
                <div className="px-6 pb-6 pt-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
                        {/* Overlapping Logo */}
                        <div className="-mt-16 relative z-10 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-white p-1.5 shadow-md md:-mt-24 md:h-32 md:w-32">
                            {profile.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={profile.logoUrl}
                                    alt={`${profile.companyName} Logo`}
                                    className="h-full w-full object-contain select-none"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-secondary-container text-on-secondary-container text-2xl font-bold">
                                    {profile.companyName.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Text Details next to Logo */}
                        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-end md:justify-between pb-1">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                                        {profile.companyName}
                                    </h1>
                                    {profile.isVerified && (
                                        <span className="inline-flex items-center gap-1 rounded bg-secondary-container/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-on-secondary-container">
                                            <MaterialIcon name="verified" size="sm" className="text-secondary" />
                                            VERIFIED
                                        </span>
                                    )}
                                    <span className="inline-flex items-center rounded bg-surface-container-high px-2 py-0.5 font-mono text-[10px] font-semibold text-on-surface-variant">
                                        {profile.tenantStatus}
                                    </span>
                                </div>
                                <p className="mt-1 font-mono text-xs text-on-surface-variant">
                                    {profile.sector} • {profile.industryType}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 shrink-0">
                                {profile.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded border border-outline-variant bg-surface-container-low px-3 py-1.5 font-mono text-label-md text-on-surface transition-colors hover:bg-surface-container-high">
                                        <MaterialIcon name="language" size="sm" />
                                        Website
                                    </a>
                                )}
                                <a
                                    href={`mailto:${profile.companyEmail}`}
                                    className="inline-flex items-center gap-1.5 rounded border border-outline-variant bg-surface-container-low px-3 py-1.5 font-mono text-label-md text-on-surface transition-colors hover:bg-surface-container-high">
                                    <MaterialIcon name="mail" size="sm" />
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TenantProfileSummary profile={profile} />

            <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
                <Card>
                    <CardHeader tone="flat" bordered>
                        <div className="flex items-center gap-3">
                            <MaterialIcon name="business" size="sm" className="text-primary" />
                            <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                                Company Overview
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-label-md uppercase tracking-[0.05em] text-on-surface-variant">
                                    Company Name
                                </p>
                                <p className="text-headline-md font-semibold text-primary">{profile.companyName}</p>
                            </div>
                            <div>
                                <p className="text-label-md uppercase tracking-[0.05em] text-on-surface-variant">
                                    Legal Name
                                </p>
                                <p className="text-body-md text-on-surface">{profile.legalCompanyName}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <DetailRow label="Industry" value={profile.industryType} />
                            <DetailRow label="Sector" value={profile.sector} />
                            <DetailRow label="Org. Size" value={profile.organizationSize} />
                            <DetailRow label="Tenant Code" value={profile.tenantCode} />
                            <DetailRow label="Slug" value={profile.slug} />
                        </div>
                    </CardBody>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader tone="flat" bordered>
                            <div className="flex items-center gap-3">
                                <MaterialIcon name="contact_phone" size="sm" className="text-primary" />
                                <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                                    Contact & Location
                                </h3>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <DetailRow label="Email" value={profile.companyEmail} />
                            <DetailRow label="Phone" value={profile.companyPhone} />
                            <DetailRow
                                label="Website"
                                value={
                                    <a className="text-primary hover:underline" href={profile.website}>
                                        {profile.website}
                                    </a>
                                }
                            />
                            <DetailRow label="Address" value={`${profile.addressLine1}, ${profile.addressLine2}`} />
                            <DetailRow label="City" value={profile.city} />
                            <DetailRow label="State" value={profile.state} />
                            <DetailRow label="Postal Code" value={profile.postalCode} />
                            <DetailRow label="Country" value={profile.country} />
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader tone="flat" bordered>
                            <div className="flex items-center gap-3">
                                <MaterialIcon name="shield" size="sm" className="text-primary" />
                                <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                                    Tenant Health
                                </h3>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <DetailRow label="Status" value={profile.tenantStatus} />
                            <DetailRow label="Active" value={profile.isActive ? "Yes" : "No"} />
                            <DetailRow label="Verified" value={profile.isVerified ? "Yes" : "No"} />
                            <DetailRow
                                label="Onboarding"
                                value={profile.onboardingCompleted ? "Complete" : "Pending"}
                            />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
