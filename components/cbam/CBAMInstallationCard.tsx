"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CBAMInstallationProfile } from "@/lib/cbam/types";

interface CBAMInstallationCardProps {
    installation: CBAMInstallationProfile | null;
    isLoading?: boolean;
}

export function CBAMInstallationCard({ installation, isLoading }: CBAMInstallationCardProps) {
    if (isLoading) {
        return (
            <Card className="p-6 border-outline-variant/60">
                <div className="flex animate-pulse space-y-4 flex-col">
                    <div className="h-6 w-1/3 bg-slate-200 rounded" />
                    <div className="h-4 w-1/2 bg-slate-200 rounded" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="h-16 bg-slate-100 rounded" />
                        <div className="h-16 bg-slate-100 rounded" />
                        <div className="h-16 bg-slate-100 rounded" />
                    </div>
                </div>
            </Card>
        );
    }

    if (!installation) {
        return (
            <Card className="p-8 border-dashed border-2 border-outline-variant/80 text-center bg-slate-50/50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 mb-3">
                    <MaterialIcon name="domain_add" size="md" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">No CBAM Installation Profile Configured</h3>
                <p className="font-sans text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                    Set up your industrial installation's master data (Sheet A_InstData), geographical coordinates, UNLOCODE, accredited verifier, and declare produced goods G1..G10.
                </p>
                <Link href="/tenant-cbam/installation">
                    <Button variant="primary" size="md" className="gap-2 font-sans text-xs font-semibold">
                        <MaterialIcon name="add" size="sm" />
                        <span>Create Installation Profile (Sheet A)</span>
                    </Button>
                </Link>
            </Card>
        );
    }

    return (
        <Card className="p-5 border-outline-variant/60 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/30 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-800 border border-emerald-700/20">
                        <MaterialIcon name="factory" size="md" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-display text-base font-bold text-slate-900">
                                {installation.installation_name_english}
                            </h3>
                            {installation.installation_name_local && (
                                <span className="font-sans text-xs text-slate-500">
                                    ({installation.installation_name_local})
                                </span>
                            )}
                            <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-sans text-[10px] font-bold text-emerald-800">
                                Active Profile
                            </span>
                        </div>
                        <p className="font-sans text-xs text-slate-500 mt-0.5">
                            {installation.economic_activity || "Industrial Manufacturing"} · {installation.city}, {installation.country}
                        </p>
                    </div>
                </div>

                <Link href="/tenant-cbam/installation">
                    <Button variant="secondary" size="sm" className="gap-1.5 font-sans text-xs font-semibold">
                        <MaterialIcon name="edit" size="xs" />
                        <span>Edit Installation Profile</span>
                    </Button>
                </Link>
            </div>

            {/* Installation Details Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4 font-sans text-xs">
                <div className="space-y-1 rounded-lg bg-surface-container-low/60 p-3 border border-outline-variant/30">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Location & UNLOCODE</span>
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <MaterialIcon name="pin_drop" size="xs" className="text-emerald-700" />
                        <span className="tabular-nums font-mono">{installation.unlocode || "N/A"}</span>
                        <span>({installation.city})</span>
                    </p>
                    <p className="text-[11px] text-slate-500 tabular-nums">
                        Lat: {installation.latitude.toFixed(4)}°, Long: {installation.longitude.toFixed(4)}°
                    </p>
                </div>

                <div className="space-y-1 rounded-lg bg-surface-container-low/60 p-3 border border-outline-variant/30">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Address & Postal</span>
                    <p className="font-semibold text-slate-900 truncate">
                        {installation.street_number || "Street N/A"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                        {installation.post_code ? `Postal: ${installation.post_code}` : "No post code"} {installation.po_box ? `· ${installation.po_box}` : ""}
                    </p>
                </div>

                <div className="space-y-1 rounded-lg bg-surface-container-low/60 p-3 border border-outline-variant/30">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Authorized Representative</span>
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                        <MaterialIcon name="person" size="xs" className="text-blue-700" />
                        {installation.authorized_rep_name || "Representative N/A"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                        {installation.authorized_rep_email || "No email"} · {installation.authorized_rep_telephone || ""}
                    </p>
                </div>

                <div className="space-y-1 rounded-lg bg-surface-container-low/60 p-3 border border-outline-variant/30">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Accredited Verifier</span>
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                        <MaterialIcon name="verified_user" size="xs" className="text-teal-700" />
                        {installation.verifier_company_name || "Verifier N/A"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                        {installation.verifier_accreditation_number ? `Accr: ${installation.verifier_accreditation_number}` : "Accreditation pending"}
                    </p>
                </div>
            </div>
        </Card>
    );
}
