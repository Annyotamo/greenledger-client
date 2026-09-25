import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import "@material-symbols/font-400/outlined.css";

import CookieConsentOverlay from "@/components/ui/CookieConsentOverlay";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    weight: ["300", "400", "500", "600", "700", "800"],
});

const displayFont = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
    weight: ["500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "GreenLedger Reporting Software, carbon accounting & supply chain traceability",
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
            className={`${inter.variable} ${displayFont.variable} ${jetbrains.variable} h-full antialiased`}
            suppressHydrationWarning>
            <body className="flex min-h-screen flex-col overflow-x-hidden font-sans text-on-surface">
                <QueryProvider>
                    {children}
                    <CookieConsentOverlay />
                </QueryProvider>
            </body>
        </html>
    );
}
