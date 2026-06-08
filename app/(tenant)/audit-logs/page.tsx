import { AuditLogsTimeline } from "@/components/audit-logs/AuditLogsTimeline";

/**
 * Audit Logs Page
 *
 * Displays system activity and user action history with timeline view.
 * Clean, sleek aesthetic with proper filtering and pagination.
 */
export const metadata = {
    title: "Audit Logs | GreenLedger ESG Reporting",
    description: "View system activity and user action history",
};

export default function AuditLogsPage() {
    return <AuditLogsTimeline />;
}
