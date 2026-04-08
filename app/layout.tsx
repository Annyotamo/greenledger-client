import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Navbar from "@/components/Navbar";
import greenLedgerLogo from "@/assets/GLLogo.png";
import "./globals.css";

const RalewayFont = Raleway({
    variable: "--font-raleway",
    subsets: ["latin"],
});

const faviconUrl = `${greenLedgerLogo.src}?v=4`;

export const metadata: Metadata = {
    title: "GreenLedger — ESG reporting, carbon accounting & supply chain traceability",
    description:
        "Collect sustainability data, auto-generate CSRD, ESRS and BRSR-aligned reports, run carbon accounting across Scopes 1–3, and prove supply chain origin with consumer-ready traceability.",
    icons: {
        icon: [{ url: faviconUrl, type: "image/png" }],
        shortcut: [{ url: faviconUrl }],
        apple: [{ url: faviconUrl }],
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
                <Navbar />
                {children}
            </body>
        </html>
    );
}
