import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import "@material-symbols/font-400/outlined.css";

import CookieConsentOverlay from "@/components/ui/CookieConsentOverlay";

const hanken = Hanken_Grotesk({
    subsets: ["latin"],
    variable: "--font-hanken",
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
    title: "GreenLedger ESG reporting, carbon accounting & supply chain traceability",
    description:
        "Collect sustainability data, auto-generate CSRD, ESRS and BRSR-aligned reports, run carbon accounting across Scopes 1–3, and prove supply chain origin with consumer-ready traceability.",
    icons: {
        icon: "/GLLogo3.ico",
        shortcut: "/GLLogo3.ico",
        apple: "/GLLogo3.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={`${hanken.variable} ${jetbrains.variable} h-full antialiased`}
            suppressHydrationWarning>
            <body className="flex min-h-screen flex-col overflow-x-hidden font-[var(--font-hanken),Inter,system-ui,sans-serif]">
                <QueryProvider>
                    {children}
                    <CookieConsentOverlay />
                </QueryProvider>
            </body>
        </html>
    );
}
