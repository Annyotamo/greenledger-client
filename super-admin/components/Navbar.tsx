"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiBars3BottomRight } from "react-icons/hi2";
import { FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import greenLedgerLogo from "@/assets/GLLogo.png";

type NavItem = {
    label: string;
    href?: string;
    children?: NavItem[];
};

const NAV: NavItem[] = [
    {
        label: "GHG",
        href: "/ghg",
        children: [
            {
                label: "Scope 1",
                href: "/ghg/scope-1",
                children: [{ label: "Factors", href: "/ghg/scope-1/factors" }],
            },
            {
                label: "Scope 2",
                href: "/ghg/scope-2",
                children: [{ label: "Factors", href: "/ghg/scope-2/factors" }],
            },
        ],
    },
];

function isActive(pathname: string, href?: string) {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

function findBreadcrumb(pathname: string, items: NavItem[]): NavItem[] {
    for (const item of items) {
        if (isActive(pathname, item.href)) {
            if (!item.children?.length) return [item];
            const child = findBreadcrumb(pathname, item.children);
            return [item, ...child];
        }

        if (item.children?.length) {
            const child = findBreadcrumb(pathname, item.children);
            if (child.length) return [item, ...child];
        }
    }
    return [];
}

export function Navbar() {
    const pathname = usePathname() || "/";
    const router = useRouter();
    const [accountOpen, setAccountOpen] = useState(false);
    const [navOpen, setNavOpen] = useState(false);

    const crumbs = useMemo(() => findBreadcrumb(pathname, NAV), [pathname]);
    const activeTop = useMemo(() => crumbs[0]?.label ?? null, [crumbs]);
    const ghg = NAV[0];

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.replace("/login");
        router.refresh();
    }

    return (
        <div className="sticky top-0 z-50">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(ellipse_70%_80%_at_20%_0%,rgba(37,99,235,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(ellipse_60%_80%_at_85%_0%,rgba(16,185,129,0.12),transparent_60%)]" />
            <div className="bg-white/55 backdrop-blur-xl shadow-[0_10px_40px_-30px_rgba(15,23,42,0.55)]">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <Image src={greenLedgerLogo} alt="GreenLedger" width={50} height={50} />
                            <div className="leading-tight">
                                <div className="text-[0.95rem] font-semibold tracking-tight text-black/90">
                                    GreenLedger
                                </div>
                                <div className="text-[11px] text-(--muted) -mt-0.5">Super Admin</div>
                            </div>
                        </Link>
                    </div>

                    <nav className="hidden md:flex min-w-0 flex-1 items-center justify-center">
                        <div
                            className="relative inline-flex items-center gap-1.5 rounded-full bg-white/65 px-2 py-1.5 ring-1 ring-black/5 shadow-[0_18px_50px_-45px_rgba(15,23,42,0.35)]"
                            onMouseEnter={() => setNavOpen(true)}
                            onMouseLeave={() => setNavOpen(false)}>
                            <button
                                type="button"
                                onClick={() => setNavOpen((v) => !v)}
                                className={[
                                    "px-3 py-1.5 rounded-full text-sm font-semibold tracking-tight transition inline-flex items-center gap-1.5",
                                    isActive(pathname, ghg?.href)
                                        ? "bg-black/6 text-black shadow-[0_10px_30px_-24px_rgba(15,23,42,0.6)]"
                                        : "text-black/70 hover:bg-black/5 hover:text-black/90",
                                ].join(" ")}
                                aria-label="Open navigation">
                                {ghg?.label ?? "Menu"}
                                <FiChevronDown
                                    className={["text-black/45 transition", navOpen ? "rotate-180" : ""].join(" ")}
                                />
                            </button>

                            {crumbs.slice(1).map((c, idx) => (
                                <div key={`${c.label}-${c.href ?? idx}`} className="flex items-center">
                                    <FiChevronDown className="-rotate-90 mx-1 text-black/35" />
                                    <Link
                                        href={c.href ?? "#"}
                                        className={[
                                            "px-3 py-1.5 rounded-full text-sm font-semibold tracking-tight transition",
                                            isActive(pathname, c.href)
                                                ? "bg-black/6 text-black shadow-[0_10px_30px_-24px_rgba(15,23,42,0.6)]"
                                                : "text-black/70 hover:bg-black/5 hover:text-black/90",
                                        ].join(" ")}>
                                        {c.label}
                                    </Link>
                                </div>
                            ))}

                            <AnimatePresence>
                                {navOpen && ghg?.children?.length ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.14 }}
                                        className="absolute left-0 top-full mt-2 w-[320px] rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-black/5 p-2 shadow-[0_32px_90px_-70px_rgba(15,23,42,0.75)]">
                                        <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                                            Navigation
                                        </p>
                                        <div className="grid gap-1">
                                            {ghg.children.map((c) => (
                                                <NavRow
                                                    key={`${c.label}-${c.href ?? ""}`}
                                                    item={c}
                                                    pathname={pathname}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </nav>

                    <div className="relative shrink-0">
                        <button
                            className={[
                                "inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-black/85 ring-1 ring-black/5 shadow-[0_10px_35px_-30px_rgba(15,23,42,0.55)] transition",
                                "hover:bg-white/85 hover:text-black",
                                accountOpen ? "bg-white/90" : "",
                            ].join(" ")}
                            onClick={() => setAccountOpen((v) => !v)}
                            aria-label="Account menu">
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.25),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.18),transparent_60%)] ring-1 ring-black/5">
                                <HiBars3BottomRight className="text-[1.05rem] opacity-90" />
                            </span>
                            <span className="hidden sm:inline">
                                {activeTop ? <span className="text-black/55 font-medium">Account · </span> : null}
                                {activeTop ?? "Menu"}
                            </span>
                        </button>

                        <AnimatePresence>
                            {accountOpen ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-48 gl-card p-2 shadow-[0_28px_70px_-55px_rgba(15,23,42,0.6)]">
                                    <Link
                                        href="/login"
                                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-black/80 hover:bg-black/5 hover:text-black transition"
                                        onClick={() => setAccountOpen(false)}>
                                        Login
                                    </Link>
                                    <button
                                        className="w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-black/80 hover:bg-black/5 hover:text-black transition"
                                        onClick={logout}>
                                        Logout
                                    </button>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavRow({ item, pathname }: { item: NavItem; pathname: string }) {
    const active = isActive(pathname, item.href);
    return (
        <div className="grid gap-1">
            <Link
                href={item.href ?? "#"}
                className={[
                    "flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition",
                    active ? "bg-black/6" : "hover:bg-black/5",
                ].join(" ")}>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-black/85 truncate">{item.label}</p>
                    {item.href ? <p className="text-[11px] text-black/45 truncate">{item.href}</p> : null}
                </div>
                {item.children?.length ? <FiChevronDown className="-rotate-90 text-black/35" /> : null}
            </Link>

            {item.children?.length ? (
                <div className="ml-2 pl-3 border-l border-black/5 grid gap-1 pb-1">
                    {item.children.map((c) => {
                        const childActive = isActive(pathname, c.href);
                        return (
                            <Link
                                key={`${c.label}-${c.href ?? ""}`}
                                href={c.href ?? "#"}
                                className={[
                                    "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                                    childActive
                                        ? "bg-black/6 text-black"
                                        : "text-black/70 hover:bg-black/5 hover:text-black/90",
                                ].join(" ")}>
                                <span className="truncate">{c.label}</span>
                                {c.children?.length ? <FiChevronDown className="-rotate-90 text-black/35" /> : null}
                            </Link>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
