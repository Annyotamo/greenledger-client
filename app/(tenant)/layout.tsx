import type { Metadata } from "next";
import type { ReactNode } from "react";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { TenantShell } from "@/components/layout/TenantShell";

export const metadata: Metadata = {
    title: "Dashboard | GreenLedger ESG Reporting",
    description: "Real-time environmental performance monitoring and GHG accounting.",
};

export default function TenantLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <TenantShell>{children}</TenantShell>
        </ThemeProvider>
    );
}
