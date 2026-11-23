"use client";

import { AuditLogsMainView } from "@/components/audit-logs/AuditLogsMainView";
import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";

export default function AuditLogsPage() {
    return (
        <ProtectedRoute feature="audit_trails" requiredLevel="read" featureTitle="Compliance Audit Trails">
            <AuditLogsMainView />
        </ProtectedRoute>
    );
}
