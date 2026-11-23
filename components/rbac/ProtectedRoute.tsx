"use client";

import type { ReactNode } from "react";
import type { AccessLevel, FeatureKey } from "@/lib/rbac/types";
import { usePermission } from "@/lib/rbac/hooks";
import { AccessDeniedDialog } from "./AccessDeniedDialog";

interface ProtectedRouteProps {
    feature: FeatureKey;
    requiredLevel?: AccessLevel;
    featureTitle: string;
    children: ReactNode;
}

export function ProtectedRoute({
    feature,
    requiredLevel = "read",
    featureTitle,
    children,
}: ProtectedRouteProps) {
    const { user, allowed, isLoading } = usePermission(feature, requiredLevel);

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                <p className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                    Verifying authorization...
                </p>
            </div>
        );
    }

    if (!allowed) {
        return (
            <AccessDeniedDialog
                featureTitle={featureTitle}
                userRole={user?.role}
                requiredLevel={requiredLevel}
            />
        );
    }

    return <>{children}</>;
}
