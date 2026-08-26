"use client";

import { AuditLogsFilterBar } from "./AuditLogsFilterBar";
import type { AuditQueryParams } from "@/lib/audit-logs/types";

type Props = {
    onFiltersChange: (filters: AuditQueryParams) => void;
    isLoading?: boolean;
};

export function AuditLogsFilters({ onFiltersChange, isLoading = false }: Props) {
    return (
        <AuditLogsFilterBar
            filters={{}}
            onFiltersChange={onFiltersChange}
            activeView="timeline"
            isLoading={isLoading}
        />
    );
}
