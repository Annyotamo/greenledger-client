"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser, UserProfile } from "@/lib/user/api";

export default function UserPage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const profile = await getCurrentUser();
                if (mounted) setUser(profile);
            } catch (err) {
                if (mounted && err instanceof Error) {
                    setError(err.message);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-headline-md font-bold">User Profile</h1>
                    <p className="font-mono text-label-md text-on-surface-variant">Account details and preferences</p>
                </div>
                <div>
                    <Link href="/dashboard" className="gl-button">
                        Back
                    </Link>
                </div>
            </div>

            <div className="gl-card p-6">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="text-error font-semibold">{error}</div>
                ) : !user ? (
                    <div>User not found.</div>
                ) : (
                    <div className="flex flex-col gap-6 sm:flex-row">
                        <div className="flex-shrink-0">
                            {user?.full_name ? (
                                <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-outline-variant">
                                    {/* no avatar from API; render initials */}
                                    <div className="flex h-full w-full items-center justify-center bg-secondary text-on-secondary text-3xl font-bold">
                                        {`${(user.first_name || "").charAt(0)}${(user.last_name || "").charAt(0)}`}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="text-headline-sm font-semibold">
                                {user.full_name ?? `${user.first_name} ${user.last_name}`}
                            </h2>
                            <p className="font-mono text-label-md text-on-surface-variant">
                                {user.job_title ?? user.role}
                            </p>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-on-surface-variant">Email</p>
                                    <p className="font-mono">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-on-surface-variant">Phone</p>
                                    <p className="font-mono">{user.phone_number ?? "—"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-on-surface-variant">Role</p>
                                    <p className="font-mono">{user.role}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-on-surface-variant">Status</p>
                                    <p className="font-mono">
                                        {user.user_status ?? (user.is_active ? "ACTIVE" : "INACTIVE")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-outline-variant pt-4">
                                <p className="text-sm font-medium text-on-surface-variant">Account created</p>
                                <p className="font-mono">
                                    {user.created_at ? new Date(user.created_at).toLocaleString() : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
