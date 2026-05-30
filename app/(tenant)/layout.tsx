import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { TenantShell } from "@/components/layout/TenantShell";
import "@material-symbols/font-400/outlined.css";

const hanken = Hanken_Grotesk({
    subsets: ["latin"],
    variable: "--font-hanken",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
    weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
    title: "Dashboard | GreenLedger ESG Reporting",
    description: "Real-time environmental performance monitoring and GHG accounting.",
};

export default function TenantLayout({ children }: { children: ReactNode }) {
    return (
        <div className={`${hanken.variable} ${jetbrains.variable} font-sans`}>
            <ThemeProvider>
                <TenantShell>{children}</TenantShell>
            </ThemeProvider>
        </div>
    );
}
