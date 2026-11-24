// app/(tenant)/lwg/layout.tsx
"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export default function LwgLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute
            feature="lwg"
            requiredLevel="read"
            featureTitle="Leather Working Group (LWG)">
            {children}
        </ProtectedRoute>
    );
}
