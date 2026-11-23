"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";

interface AccessDeniedDialogProps {
    featureTitle: string;
    userRole?: string;
    requiredLevel?: string;
    onDismiss?: () => void;
}

const COUNTDOWN_SECONDS = 5;

export function AccessDeniedDialog({
    featureTitle,
    userRole = "USER",
    requiredLevel = "read",
}: AccessDeniedDialogProps) {
    const router = useRouter();
    const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.replace("/dashboard");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    const progressPercentage = ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="access-denied-title"
                className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl">
                {/* Header with warning icon */}
                <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        <MaterialIcon name="lock" size="lg" className="!text-[24px]" />
                    </div>
                    <div>
                        <h3 id="access-denied-title" className="text-headline-sm font-bold text-primary font-display">
                            Access Restricted
                        </h3>
                        <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-on-surface-variant/70">
                            HTTP 403 Forbidden • Access Control Policy
                        </p>
                    </div>
                </div>

                {/* Explanation text */}
                <div className="mt-4 space-y-2 text-sm text-on-surface-variant font-sans">
                    <p>
                        You do not have permission to view the{" "}
                        <strong className="text-primary font-semibold">{featureTitle}</strong> module.
                    </p>
                    <p className="text-xs text-on-surface-variant/80">
                        Your role (<span className="font-mono font-semibold text-primary">{userRole}</span>) requires at
                        least <span className="font-mono font-semibold text-primary uppercase">{requiredLevel}</span> access
                        for this component. Please contact your organization administrator if you need access.
                    </p>
                </div>

                {/* Progress bar countdown */}
                <div className="mt-5 rounded-lg border border-outline-variant/50 bg-surface-container-low p-3">
                    <div className="flex items-center justify-between text-xs font-medium text-on-surface-variant font-sans">
                        <span>Redirecting to Dashboard</span>
                        <span className="font-mono font-bold text-primary">{secondsLeft}s</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                        <div
                            className="h-full bg-amber-500 transition-all duration-1000 ease-linear rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, 100 - progressPercentage))}%` }}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex items-center gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => router.back()}
                        className="flex-1 font-semibold text-xs">
                        <MaterialIcon name="arrow_back" size="sm" />
                        Go Back
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={() => router.replace("/dashboard")}
                        className="flex-1 font-semibold text-xs">
                        <MaterialIcon name="dashboard" size="sm" />
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
