"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { AiAssistantFAB } from "@/components/dashboard/AiAssistantFAB";
import { CBAMNavbar } from "./CBAMNavbar";
import { CBAMHeader } from "./CBAMHeader";
import { CBAMKpiCards } from "./CBAMKpiCards";
import { CBAMInstallationCard } from "./CBAMInstallationCard";
import { CBAMGoodsSummaryTable } from "./CBAMGoodsSummaryTable";
import { CBAMProcessesSummaryTable } from "./CBAMProcessesSummaryTable";
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

export function CBAMExecutiveView() {
    // Queries
    const { data: installation, isLoading: loadingInst } = useActiveCbamInstallation();
    const installationId = installation?.id || "";

    const { data: streams = [], isLoading: loadingStreams } = useCbamSourceStreams(installationId);
    const { data: summary = null } = useCbamSourceStreamsSummary(installationId);

    // Mutations
    const createStreamMutation = useCreateCbamSourceStream();
    const updateStreamMutation = useUpdateCbamSourceStream();
    const deleteStreamMutation = useDeleteCbamSourceStream();

    // Modal state
    const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
    const [editingStream, setEditingStream] = useState<CBAMSourceStream | null>(null);

    // Notifications
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
            {/* Sticky Navigation Bar */}
            <CBAMNavbar />

            {/* Notification Banner */}
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

            {/* CBAM Header */}
            <CBAMHeader onOpenStreamModal={handleOpenAddStream} />

            {/* KPI Cards */}
            <CBAMKpiCards summary={summary} installation={installation ?? null} />

            {/* Installation Profile Summary */}
            <CBAMInstallationCard installation={installation ?? null} isLoading={loadingInst} />

            {/* Produced Goods & Production Processes Grid */}
            {installation && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <CBAMGoodsSummaryTable goods={installation.goods || []} />
                    <CBAMProcessesSummaryTable processes={installation.processes || []} />
                </div>
            )}

            {/* Source Streams Table (Sheet B_EmInst) */}
            {installation ? (
                <CBAMSourceStreamsTable
                    streams={streams}
                    isLoading={loadingStreams}
                    onAddStream={handleOpenAddStream}
                    onEditStream={handleOpenEditStream}
                    onDeleteStream={handleDeleteStream}
                />
            ) : null}

            {/* Source Stream Add/Edit Modal */}
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
