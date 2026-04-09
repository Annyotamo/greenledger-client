"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import greenLedgerLogo from "@/assets/GLLogo.png";

const navLinks = [
    { href: "#pillars", label: "Platform" },
    { href: "#deep-dive", label: "Solutions" },
    { href: "#traceability", label: "Traceability" },
    { href: "#cta", label: "Demo" },
];

const Navbar = () => {
    const pathname = usePathname();
    const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
    const isScope = pathname === "/scope-1" || pathname.startsWith("/scope-1/");
    const isLogin = pathname === "/login" || pathname.startsWith("/login/");

    if (isDashboard || isScope) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-[#f6fff8]/85 backdrop-blur-md">
            <nav
                className={`mx-auto flex w-full max-w-400 items-center justify-between gap-4 px-4 py-3 sm:px-5 md:px-6 lg:px-7 ${
                    isDashboard ? "md:pl-72" : ""
                }`}>
                <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <Image
                        src={greenLedgerLogo}
                        width={56}
                        height={56}
                        alt="GreenLedger"
                        className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
                    />
                    <span className="truncate text-xl font-semibold tracking-tight text-[#1f5c2e] sm:text-2xl">
                        GreenLedger
                    </span>
                </Link>
                <ul className="hidden items-center gap-1 text-sm font-medium text-slate-700 md:flex md:gap-2">
                    {navLinks.map((l) => (
                        <li key={l.href}>
                            <a
                                href={l.href}
                                className="rounded-full px-3 py-2 transition hover:bg-emerald-100/80 hover:text-emerald-950">
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-2">
                    <a
                        href="#cta"
                        className="shrink-0 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:px-4 sm:text-sm">
                        Book demo
                    </a>
                    {!isLogin ? (
                        <Link
                            href="/login"
                            className="hidden shrink-0 rounded-full border border-emerald-900/15 bg-white/70 px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-700/25 hover:bg-white sm:inline-flex sm:px-4 sm:text-sm">
                            Client login
                        </Link>
                    ) : null}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
