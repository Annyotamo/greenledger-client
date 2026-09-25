"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";

interface Category6RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    isSubmitting: boolean;
}

export function Category6RejectModal({
    isOpen,
    onClose,
    onConfirm,
    isSubmitting,
}: Category6RejectModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!reason.trim()) {
            setError("Please provide a rejection reason.");
            return;
        }
        setError("");
        await onConfirm(reason.trim());
        setReason("");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-4 my-auto">
                <div className="flex items-center gap-3 text-error">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-error-container/40">
                        <MaterialIcon name="warning" size="md" />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold text-primary tracking-tight">Reject Business Travel Record</h3>
                        <p className="font-sans text-xs text-slate-500 font-medium">Reviewer Rejection Action</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-sans text-xs font-semibold text-slate-700 mb-1">
                            Rejection Reason <span className="text-error">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Flight ticket receipts or travel expense documentation missing..."
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-sans text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-error leading-relaxed"
                        />
                        {error && <p className="font-sans text-xs text-error mt-1">{error}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 font-sans">
                        <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting} className="font-semibold text-xs">
                            Cancel
                        </Button>
                        <Button type="submit" variant="danger" size="md" disabled={isSubmitting} className="font-semibold text-xs">
                            {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
