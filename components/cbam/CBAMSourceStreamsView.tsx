"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";
import { CBAMNavbar } from "./CBAMNavbar";
import { CBAMKpiCards } from "./CBAMKpiCards";
import { CBAMSourceStreamsTable } from "./CBAMSourceStreamsTable";
import { CBAMSourceStreamModal } from "./CBAMSourceStreamModal";
import {
    useActiveCbamInstallation,
    useCreateCbamSourceStream,
    useDeleteCbamSourceStream,
    useCbamSourceStreams,
    useCbamSourceStreamsSummary,
    useUpdateCbamSourceStream,
} from "@/lib/cbam/hooks";
import type { CBAMSourceStream, CreateCBAMSourceStreamPayload } from "@/lib/cbam/types";

export function CBAMSourceStreamsView() {
    const { data: installation, isLoading: loadingInst } = useActiveCbamInstallation();
    const installationId = installation?.id || "";

    const { data: streams = [], isLoading: loadingStreams } = useCbamSourceStreams(installationId);
    const { data: summary = null } = useCbamSourceStreamsSummary(installationId);

    const createStreamMutation = useCreateCbamSourceStream();
    const updateStreamMutation = useUpdateCbamSourceStream();
    const deleteStreamMutation = useDeleteCbamSourceStream();

    const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
    const [editingStream, setEditingStream] = useState<CBAMSourceStream | null>(null);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    function showNotification(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    function handleOpenAddStream() {
        if (!installationId) {
            showNotification("error", "Please configure an installation profile (Sheet A) before adding source streams.");
            return;
        }
        setEditingStream(null);
        setIsStreamModalOpen(true);
    }

    function handleOpenEditStream(stream: CBAMSourceStream) {
        setEditingStream(stream);
        setIsStreamModalOpen(true);
    }

    async function handleSaveStream(payload: CreateCBAMSourceStreamPayload) {
        if (!installationId) return;
        try {
            if (editingStream) {
                await updateStreamMutation.mutateAsync({
                    installationId,
                    streamId: editingStream.id,
                    payload,
                });
                showNotification("success", `Source stream #${editingStream.slot_number} updated successfully.`);
            } else {
                await createStreamMutation.mutateAsync({
                    installationId,
                    payload,
                });
                showNotification("success", "New EU CBAM source stream created & emissions calculated.");
            }
            setIsStreamModalOpen(false);
            setEditingStream(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to save source stream.";
            showNotification("error", msg);
        }
    }

    async function handleDeleteStream(streamId: string) {
        if (!installationId) return;
        if (!confirm("Are you sure you want to delete this source stream?")) return;
        try {
            await deleteStreamMutation.mutateAsync({
                installationId,
                streamId,
            });
            showNotification("success", "Source stream deleted successfully.");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to delete source stream.";
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

            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-outline-variant/40 pb-4">
                <div className="flex items-center gap-2 font-sans text-xs text-slate-500 font-medium">
                    <Link href="/tenant-cbam" className="hover:text-primary transition-colors">
                        EU CBAM Declaration
                    </Link>
                    <span>/</span>
                    <span className="text-secondary font-semibold">Sheet B_EmInst (Source Streams)</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                    Source Streams & Emission Calculations
                </h1>
                <p className="font-sans text-xs text-slate-500 max-w-3xl leading-relaxed">
                    Deterministic greenhouse gas accounting across all 75 slots in Sheet B_EmInst (Section a). Quantify combustion fuels with NCV/EF splits and mass balance carbon flows with stoichiometric factor 3.664.
                </p>
            </div>

            {/* KPI Cards */}
            <CBAMKpiCards summary={summary} installation={installation ?? null} />

            {/* Main Table */}
            {installationId ? (
                <CBAMSourceStreamsTable
                    streams={streams}
                    isLoading={loadingStreams || loadingInst}
                    onAddStream={handleOpenAddStream}
                    onEditStream={handleOpenEditStream}
                    onDeleteStream={handleDeleteStream}
                />
            ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50">
                    <MaterialIcon name="domain_disabled" size="lg" className="text-slate-400 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-800 text-sm">Installation Profile Required</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                        Please set up your installation master profile in Sheet A before logging source streams.
                    </p>
                    <Link href="/tenant-cbam/installation">
                        <Button variant="primary" size="sm">
                            Setup Installation Profile
                        </Button>
                    </Link>
                </div>
            )}

            {/* Modal */}
            <CBAMSourceStreamModal
                isOpen={isStreamModalOpen}
                streamToEdit={editingStream}
                onClose={() => {
                    setIsStreamModalOpen(false);
                    setEditingStream(null);
                }}
                onSubmit={handleSaveStream}
                isSubmitting={createStreamMutation.isPending || updateStreamMutation.isPending}
            />

            <AiAssistantFAB />
        </div>
    );
}
