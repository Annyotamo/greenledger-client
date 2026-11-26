"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useCurrentUser } from "@/lib/rbac/hooks";
import { logoutUser } from "@/lib/auth/api";
import { cn } from "@/lib/utils/cn";

export function UserNavMenu() {
    const { data: user } = useCurrentUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logoutUser();
        } catch {
            if (typeof window !== "undefined") {
                window.location.replace("/login");
            }
        }
    };

    const avatarUrl = user?.logo || user?.avatar;
    const initials = user?.first_name || user?.last_name
        ? `${(user.first_name || "").charAt(0)}${(user.last_name || "").charAt(0)}`.toUpperCase()
        : "U";

    const fullName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : "User");
    const roleLabel = (user?.role || "USER").replace(/_/g, " ");

    return (
        <div ref={menuRef} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                    "relative flex items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    isOpen ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-outline-variant",
                )}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="User account menu">
                {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt={fullName}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full border border-outline-variant object-cover shadow-2xs"
                    />
                ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-on-secondary font-sans text-xs font-bold shadow-2xs">
                        {initials}
                    </div>
                )}
                {user?.mfa_enabled && (
                    <span
                        title="MFA Protected"
                        className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container ring-1 ring-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.14, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg z-50">
                        {/* Header Identity Block */}
                        <div className="flex items-start gap-3 rounded-lg bg-surface-container-low p-3">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt={fullName}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 shrink-0 rounded-full border border-outline-variant object-cover"
                                />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary font-sans text-sm font-bold">
                                    {initials}
                                </div>
                            )}

                            <div className="min-w-0 flex-1 overflow-hidden">
                                <p className="truncate font-sans text-sm font-bold text-primary">
                                    {fullName}
                                </p>
                                <p className="truncate font-sans text-xs text-on-surface-variant">
                                    {user?.email || "—"}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                    <span className="inline-flex items-center rounded-md border border-outline-variant bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] font-semibold text-on-surface-variant uppercase">
                                        {roleLabel}
                                    </span>
                                    {user?.mfa_enabled ? (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-secondary/30 bg-secondary/10 px-1.5 py-0.5 text-[10px] font-semibold text-secondary">
                                            <MaterialIcon name="verified_user" size="xs" />
                                            MFA
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <div className="mt-2 space-y-0.5">
                            {/* 1. User Profile */}
                            <Link
                                href="/user"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high">
                                <MaterialIcon name="person" size="sm" className="text-on-surface-variant" />
                                <div>
                                    <p className="font-semibold text-primary">User Profile</p>
                                    <p className="text-[11px] text-on-surface-variant">Profile, bio & MFA security</p>
                                </div>
                            </Link>

                            {/* 2. Tenant Profile */}
                            <Link
                                href="/tenant"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high">
                                <MaterialIcon name="business" size="sm" className="text-on-surface-variant" />
                                <div>
                                    <p className="font-semibold text-primary">Tenant Profile</p>
                                    <p className="text-[11px] text-on-surface-variant">Organization & corporate details</p>
                                </div>
                            </Link>

                            {/* 3. Facilities */}
                            <Link
                                href="/facilities"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high">
                                <MaterialIcon name="domain" size="sm" className="text-on-surface-variant" />
                                <div>
                                    <p className="font-semibold text-primary">Facilities</p>
                                    <p className="text-[11px] text-on-surface-variant">Operational centers & sites</p>
                                </div>
                            </Link>

                            {/* 4. Reporting Period */}
                            <Link
                                href="/reporting-period"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high">
                                <MaterialIcon name="calendar_month" size="sm" className="text-on-surface-variant" />
                                <div>
                                    <p className="font-semibold text-primary">Reporting Period</p>
                                    <p className="text-[11px] text-on-surface-variant">Fiscal cycles & statutory years</p>
                                </div>
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="my-1.5 border-t border-outline-variant" />

                        {/* 5. Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-semibold text-error transition-colors hover:bg-error-container/20 cursor-pointer disabled:opacity-60">
                            <MaterialIcon name="logout" size="sm" className="text-error" />
                            <span>{isLoggingOut ? "Signing out..." : "Log out"}</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
