"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import type { AuditLogItem, AuditTrailItem, AuditSeverity, AuditStatus } from "@/lib/audit-logs/types";
import {
    formatDateTime,
    formatEventType,
    getModuleInfo,
    SEVERITY_CONFIG,
    STATUS_CONFIG,
} from "@/lib/audit-logs/formatters";

type Props = {
    log: AuditLogItem | AuditTrailItem | null;
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
};

interface NormalizedDiff {
    field: string;
    oldValue: any;
    newValue: any;
}

export function AuditForensicDiffModal({ log, isOpen, isLoading = false, onClose }: Props) {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<"diff" | "details" | "raw">("diff");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when modal is open and handle ESC key
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Safely extract normalized field diffs
    const diffs: NormalizedDiff[] = useMemo(() => {
        if (!log) return [];

        const logItem = log as AuditLogItem;
        const normalized: NormalizedDiff[] = [];

        // 1. Check explicit `changes` object
        if (logItem.changes && typeof logItem.changes === "object" && !Array.isArray(logItem.changes)) {
            Object.entries(logItem.changes).forEach(([field, change]) => {
                if (change && typeof change === "object") {
                    normalized.push({
                        field,
                        oldValue: "old" in change ? change.old : null,
                        newValue: "new" in change ? change.new : null,
                    });
                } else {
                    normalized.push({
                        field,
                        oldValue: null,
                        newValue: change,
                    });
                }
            });
            return normalized;
        }

        // 2. Fallback: compare `old_values` and `new_values` objects
        const oldVals = logItem.old_values && typeof logItem.old_values === "object" ? logItem.old_values : {};
        const newVals = logItem.new_values && typeof logItem.new_values === "object" ? logItem.new_values : {};

        const allKeys = Array.from(new Set([...Object.keys(oldVals), ...Object.keys(newVals)]));

        allKeys.forEach((key) => {
            const oldValue = oldVals[key];
            const newValue = newVals[key];
            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                normalized.push({
                    field: key,
                    oldValue,
                    newValue,
                });
            }
        });

        return normalized;
    }, [log]);

    if (!isOpen || !mounted) return null;

    const moduleInfo = getModuleInfo(log?.module);
    const severityKey = ((log?.severity || "info").toLowerCase()) as AuditSeverity;
    const severityConfig = SEVERITY_CONFIG[severityKey] || SEVERITY_CONFIG.info;

    const statusKey = ((log?.status || "success").toLowerCase()) as AuditStatus;
    const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.success;

    const logItem = log as AuditLogItem | null;
    const hasDiffs = diffs.length > 0;

    const handleCopyJson = () => {
        if (!log) return;
        navigator.clipboard.writeText(JSON.stringify(log, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderValue = (val: any) => {
        if (val === null || val === undefined) {
            return <span className="italic text-slate-400">null</span>;
        }
        if (typeof val === "boolean") {
            return <span className="font-mono text-amber-600 font-semibold">{val ? "true" : "false"}</span>;
        }
        if (typeof val === "number") {
            return <span className="font-mono text-emerald-600 font-bold">{val}</span>;
        }
        if (typeof val === "object") {
            return (
                <pre className="text-[11px] font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {JSON.stringify(val, null, 2)}
                </pre>
            );
        }
        return <span className="font-mono text-slate-800 break-all">{String(val)}</span>;
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden font-sans z-10">
                
                {/* Header */}
                <div className="flex flex-col gap-3 px-6 py-5 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${moduleInfo.color}`}>
                                <MaterialIcon name={moduleInfo.icon} size="xs" />
                                {moduleInfo.label}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border ${severityConfig.badge}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${severityConfig.dot}`} />
                                {String(log?.severity || "info").toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border ${statusConfig.badge}`}>
                                <MaterialIcon name={statusConfig.icon} size="xs" />
                                {statusConfig.label}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors">
                            <MaterialIcon name="close" size="sm" />
                        </button>
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            {formatEventType(log?.event_type)}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                            {log?.description || "Forensic audit detail inspection"}
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs & Actions */}
                <div className="flex items-center justify-between px-6 border-b border-slate-200 bg-white">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab("diff")}
                            className={`flex items-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors ${
                                activeTab === "diff"
                                    ? "border-emerald-600 text-emerald-700 font-bold"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}>
                            <MaterialIcon name="compare_arrows" size="xs" />
                            <span>State Changes &amp; Diff</span>
                            {hasDiffs && (
                                <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 font-mono font-bold">
                                    {diffs.length}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("details")}
                            className={`flex items-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors ${
                                activeTab === "details"
                                    ? "border-emerald-600 text-emerald-700 font-bold"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}>
                            <MaterialIcon name="info" size="xs" />
                            <span>Forensic Details</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("raw")}
                            className={`flex items-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors ${
                                activeTab === "raw"
                                    ? "border-emerald-600 text-emerald-700 font-bold"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}>
                            <MaterialIcon name="data_object" size="xs" />
                            <span>Raw JSON</span>
                        </button>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyJson}
                        className="text-xs h-7 gap-1 px-2.5 rounded-lg border-slate-200">
                        <MaterialIcon name={copied ? "check" : "content_copy"} size="xs" />
                        <span>{copied ? "Copied" : "Copy Payload"}</span>
                    </Button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500/20 border-t-emerald-600" />
                            <p className="text-xs font-semibold text-slate-500 font-mono">
                                Loading forensic state diffs...
                            </p>
                        </div>
                    )}

                    {!isLoading && log && (
                        <>
                            {/* Tab 1: State Changes & Diff */}
                            {activeTab === "diff" && (
                                <div className="space-y-4">
                                    {hasDiffs ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                                                <span>Modified Field Property</span>
                                                <span>Before (Old) &rarr; After (New)</span>
                                            </div>

                                            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                                                {diffs.map(({ field, oldValue, newValue }) => (
                                                    <div key={field} className="p-4 space-y-2 hover:bg-slate-50/50 transition-colors">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                                {field}
                                                            </span>
                                                            <span className="text-[11px] font-semibold text-slate-400">
                                                                Field Modified
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                            {/* Old Value */}
                                                            <div className="rounded-lg border border-rose-200/80 bg-rose-50/40 p-3">
                                                                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1 flex items-center gap-1">
                                                                    <MaterialIcon name="remove_circle_outline" size="xs" />
                                                                    Original State (Old)
                                                                </div>
                                                                <div className="text-xs text-rose-950 font-mono line-through opacity-80 break-all">
                                                                    {renderValue(oldValue)}
                                                                </div>
                                                            </div>

                                                            {/* New Value */}
                                                            <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/40 p-3">
                                                                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                                                                    <MaterialIcon name="add_circle_outline" size="xs" />
                                                                    Updated State (New)
                                                                </div>
                                                                <div className="text-xs text-emerald-950 font-mono font-semibold break-all">
                                                                    {renderValue(newValue)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-2">
                                            <MaterialIcon name="info" size="md" className="text-slate-400 mx-auto" />
                                            <h4 className="text-sm font-bold text-slate-700">No Field Mutations Recorded</h4>
                                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                                This event represents an initial data creation, submission, authentication, or query without field modifications.
                                            </p>
                                        </div>
                                    )}

                                    {/* Reason / Error Banner if present */}
                                    {(log.reason || logItem?.error_message || logItem?.error_code) && (
                                        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-1 text-xs text-amber-900">
                                            <div className="font-bold flex items-center gap-1.5">
                                                <MaterialIcon name="warning" size="xs" className="text-amber-700" />
                                                {logItem?.error_code ? `Error Code: ${logItem.error_code}` : "Audit Reason / Exception"}
                                            </div>
                                            <p className="font-mono text-[11px] leading-relaxed">
                                                {log.reason || logItem?.error_message}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab 2: Forensic Details */}
                            {activeTab === "details" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                                            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                                <MaterialIcon name="person" size="xs" />
                                                Actor Identity
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Email:</span>
                                                    <span className="font-semibold text-slate-800 font-mono">{log.actor_email || "System"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Actor Type:</span>
                                                    <span className="font-semibold text-slate-800 uppercase text-[11px]">{log.actor_type || "USER"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">User UUID:</span>
                                                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[180px]">{log.actor_user_id || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                                            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                                <MaterialIcon name="dataset" size="xs" />
                                                Target Resource
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Resource Type:</span>
                                                    <span className="font-semibold text-slate-800 font-mono">{log.resource_type || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Resource ID:</span>
                                                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[180px]">
                                                        {log.resource_identifier || log.resource_id || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Timestamp:</span>
                                                    <span className="font-semibold text-slate-800">{formatDateTime(log.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {logItem?.metadata_json && Object.keys(logItem.metadata_json).length > 0 && (
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                                            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                                <MaterialIcon name="tune" size="xs" />
                                                Ingestion &amp; Calculation Metadata
                                            </div>
                                            <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-48">
                                                {JSON.stringify(logItem.metadata_json, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab 3: Raw JSON */}
                            {activeTab === "raw" && (
                                <div className="space-y-2">
                                    <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-[480px]">
                                        {JSON.stringify(log, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400">
                        Audit ID: {log?.id || "N/A"}
                    </span>
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </motion.div>
        </div>,
        document.body,
    );
}
