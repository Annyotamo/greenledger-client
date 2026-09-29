"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";
import { CBAMNavbar } from "./CBAMNavbar";
import { CBAMInstallationForm } from "./CBAMInstallationForm";
import {
    useActiveCbamInstallation,
    useCreateCbamInstallation,
    useUpdateCbamInstallation,
} from "@/lib/cbam/hooks";
import type { CreateCBAMInstallationPayload } from "@/lib/cbam/types";

export function CBAMInstallationView() {
    const { data: installation, isLoading } = useActiveCbamInstallation();
    const createMutation = useCreateCbamInstallation();
    const updateMutation = useUpdateCbamInstallation();

    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    function showNotification(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    async function handleSaveInstallation(payload: CreateCBAMInstallationPayload) {
        try {
            if (installation?.id) {
                await updateMutation.mutateAsync({
                    id: installation.id,
                    payload,
                });
                showNotification("success", "Installation profile (Sheet A_InstData) updated successfully.");
            } else {
                await createMutation.mutateAsync(payload);
                showNotification("success", "CBAM Installation profile created successfully.");
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to save installation profile.";
            showNotification("error", msg);
        }
    }

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 pb-12 font-sans">
            <CBAMNavbar />

            {notification && (
                <div
                    className={`flex items-center justify-between rounded-xl px-4 py-3 font-sans text-xs font-medium shadow-md border animate-in slide-in-from-top-2 duration-200 ${
                        notification.type === "success"
                            ? "bg-secondary-container/90 text-on-secondary-container border-secondary/30"
                            : "bg-error-container/90 text-on-error-container border-error/30"
                    }`}>
                    <div className="flex items-center gap-2">
                        <MaterialIcon name={notification.type === "success" ? "check_circle" : "error"} size="sm" />
                        <span>{notification.message}</span>
                    </div>
                    <button type="button" onClick={() => setNotification(null)}>
                        <MaterialIcon name="close" size="xs" />
                    </button>
                </div>
            )}

            {/* Breadcrumb & Header */}
            <div className="flex flex-col gap-2 border-b border-outline-variant/40 pb-4">
                <div className="flex items-center gap-2 font-sans text-xs text-slate-500 font-medium">
                    <Link href="/cbam" className="hover:text-primary transition-colors">
                        EU CBAM Declaration
                    </Link>
                    <span>/</span>
                    <span className="text-secondary font-semibold">Sheet A_InstData (Installation Setup)</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                    Installation Setup & Master Data
                </h1>
                <p className="font-sans text-xs text-slate-500 max-w-3xl leading-relaxed">
                    Configure official installation profile, geographic UNLOCODE and coordinates, authorized operator representative, accredited verification body, and declare produced goods (G1..G10) with verified production routes.
                </p>
            </div>

            {isLoading ? (
                <div className="py-20 text-center text-xs text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span>Loading installation profile...</span>
                    </div>
                </div>
            ) : (
                <CBAMInstallationForm
                    initialData={installation}
                    onSubmit={handleSaveInstallation}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}

            <AiAssistantFAB />
        </div>
    );
}
