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
