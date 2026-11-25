// app/(tenant)/lwg/layout.tsx
"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export default function LwgLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute
            feature="lwg"
            requiredLevel="read"
            featureTitle="Leather Module">
            {/* High-priority browser resource hint for instant banner paint */}
            <link
                rel="preload"
                as="image"
                href="/images/lwg/leather-tannery-banner.webp"
                type="image/webp"
                fetchPriority="high"
            />
            {children}
        </ProtectedRoute>
    );
}
