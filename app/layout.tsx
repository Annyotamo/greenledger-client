import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const RalewayFont = Raleway({
    variable: "--font-raleway",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GreenLedger — ESG reporting, carbon accounting & supply chain traceability",
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
        <html lang="en" className={`${RalewayFont.variable} h-full antialiased`}>
            <body className="flex min-h-screen flex-col overflow-x-hidden font-[family-name:var(--font-raleway),system-ui,sans-serif]">
                {children}
            </body>
        </html>
    );
}
