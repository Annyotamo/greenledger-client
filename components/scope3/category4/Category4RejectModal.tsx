"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";

interface Category4RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    isSubmitting: boolean;
}

export function Category4RejectModal({
    isOpen,
    onClose,
    onConfirm,
    isSubmitting,
}: Category4RejectModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl z-10 p-6 space-y-4 my-auto">
                <div className="flex items-center gap-3 text-error">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-error-container/40">
                        <MaterialIcon name="warning" size="md" />
                    </div>
                    <div>
                        <h3 className="font-mono text-headline-sm font-bold text-primary">Reject Freight Spend Entry</h3>
                        <p className="font-mono text-[11px] text-on-surface-variant">Reviewer Rejection Action</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-mono text-xs font-semibold text-primary mb-1">
                            Rejection Reason <span className="text-error">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Freight invoice document or bill of lading reference is missing..."
                            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:ring-1 focus:ring-error"
                        />
                        {error && <p className="font-mono text-xs text-error mt-1">{error}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="danger" size="md" disabled={isSubmitting}>
                            {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
