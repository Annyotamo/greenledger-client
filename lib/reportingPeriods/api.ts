import { privateApi } from "@/lib/http/client";

export type ReportingPeriodDto = {
    id: string;
    name: string;
    reporting_year: number;
    period_start: string;
    period_end: string;
};

export async function getReportingPeriods() {
    const response = await privateApi.get<{
        success: boolean;
        status_code: number;
        message: string;
        data: { items: ReportingPeriodDto[] };
    }>("/tenant/reporting-periods");

    return response.data.data?.items ?? [];
}
