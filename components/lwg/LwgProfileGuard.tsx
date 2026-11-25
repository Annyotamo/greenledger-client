// components/lwg/LwgProfileGuard.tsx
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { useLwgProfile } from "@/lib/lwg/hooks";

interface LwgProfileGuardProps {
    children: ReactNode;
    /**
     * "operational" (default): Requires profile to exist. Redirects to /lwg/onboarding if null.
     * "onboarding": For the onboarding page. If profile already exists, redirects to /lwg.
     */
    mode?: "operational" | "onboarding";
}

export function LwgProfileGuard({
    children,
    mode = "operational",
}: LwgProfileGuardProps) {
    const router = useRouter();
    const { data: profile, isLoading, isError, error, refetch } = useLwgProfile();

    useEffect(() => {
        if (isLoading) return;

        if (mode === "operational" && profile === null) {
            router.replace("/lwg/onboarding");
        } else if (mode === "onboarding" && profile !== null) {
            router.replace("/lwg");
        }
    }, [isLoading, profile, mode, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                <p className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                    Verifying Tannery Profile Configuration...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto my-12 max-w-lg rounded-xl border border-error/30 bg-error/5 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                    <MaterialIcon name="warning" size="md" />
                </div>
                <h3 className="font-display text-base font-semibold text-primary">
                    Unable to load Leather Profile
                </h3>
                <p className="mt-1 text-xs text-on-surface-variant">
                    {error?.message || "An unexpected error occurred while communicating with the server."}
                </p>
                <div className="mt-4 flex justify-center">
                    <Button variant="secondary" size="sm" onClick={() => refetch()}>
                        <MaterialIcon name="refresh" size="xs" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    if (mode === "operational" && profile === null) {
        return (
            <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="font-sans text-xs text-on-surface-variant">
                    Redirecting to Tannery Setup Wizard...
                </p>
            </div>
        );
    }

    if (mode === "onboarding" && profile !== null) {
        return (
            <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="font-sans text-xs text-on-surface-variant">
                    Profile already configured. Redirecting to Leather Dashboard...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
