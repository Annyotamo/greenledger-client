import { AuditLogsMainView } from "@/components/audit-logs/AuditLogsMainView";

/**
 * Tenant Audit Logs & Forensic System
 * Displays lightweight activity trails, deep forensic diffs, and compliance logs.
 */
export const metadata = {
    title: "Audit Logs & Activity Trails | GreenLedger ESG Reporting",
    description: "Immutable activity trails, forensic state diffs, and compliance history.",
};

export default function AuditLogsPage() {
    return <AuditLogsMainView />;
}
