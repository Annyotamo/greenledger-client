"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Authorize } from "@/components/rbac/Authorize";
import type { TeamMember } from "@/lib/teamMembers/types";
import { ManagePermissionsDrawer } from "./ManagePermissionsDrawer";

function getStatusVariant(status: string) {
    switch (status) {
        case "ACTIVE":
            return "active";
        case "PENDING_VERIFICATION":
            return "tag";
        case "INACTIVE":
        case "SUSPENDED":
            return "negative";
        default:
            return "neutral";
    }
}

function getRoleBadge(role: string) {
    switch (role) {
        case "TENANT_OWNER":
        case "TENANT_ADMIN":
            return (
                <span className="inline-flex items-center rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-purple-700">
                    {role}
                </span>
            );
        case "ESG_TEAM":
            return (
                <span className="inline-flex items-center rounded-md border border-emerald-600/30 bg-emerald-600/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-800">
                    {role}
                </span>
            );
        case "FACILITY_HEAD":
            return (
                <span className="inline-flex items-center rounded-md border border-teal-600/30 bg-teal-600/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-teal-800">
                    {role}
                </span>
            );
        case "AUDITOR":
            return (
                <span className="inline-flex items-center rounded-md border border-blue-600/30 bg-blue-600/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-800">
                    {role}
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center rounded-md border border-outline-variant bg-surface-container-high px-2 py-0.5 font-mono text-[11px] font-semibold text-on-surface-variant">
                    {role}
                </span>
            );
    }
}

function formatDate(dateString: string | null) {
    if (!dateString) return "Never";
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(d);
}

export function TeamMembersTable({
    members,
    isLoading = false,
    isError = false,
}: {
    members: TeamMember[];
    isLoading?: boolean;
    isError?: boolean;
}) {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    if (isLoading) {
        return (
            <Card>
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="group" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Team Members
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-on-surface-variant">Loading team members...</div>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card>
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="group" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Team Members
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-error">Failed to load team members.</div>
            </Card>
        );
    }

    if (members.length === 0) {
        return (
            <Card>
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="group" size="sm" className="text-primary" />
                        <h3 className="text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Team Members
                        </h3>
                    </div>
                </CardHeader>
                <div className="p-card-padding text-center text-on-surface-variant">No team members found.</div>
            </Card>
        );
    }

    return (
        <>
            <Card className="flex flex-col">
                <CardHeader tone="flat">
                    <div className="flex items-center gap-2.5">
                        <MaterialIcon name="group" size="sm" className="text-primary" />
                        <h3 className="font-display text-headline-sm font-semibold uppercase tracking-tight text-primary">
                            Team Members
                        </h3>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((m) => {
                                const overrideCount = m.customPermissions
                                    ? Object.keys(m.customPermissions).length
                                    : 0;

                                return (
                                    <TableRow key={m.id}>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="font-sans font-semibold text-primary">{m.fullName}</p>
                                                <p className="font-sans text-[12px] text-on-surface-variant">{m.email}</p>
                                            </div>
                                        </TableCell>

                                        <TableCell>{getRoleBadge(m.role)}</TableCell>

                                        <TableCell>
                                            {m.role === "TENANT_OWNER" || m.role === "TENANT_ADMIN" ? (
                                                <Badge variant="tag" size="sm" className="bg-purple-500/10 text-purple-700 border-purple-500/30 font-mono">
                                                    Full Admin
                                                </Badge>
                                            ) : overrideCount > 0 ? (
                                                <Badge variant="tag" size="sm" className="bg-amber-500/10 text-amber-800 border-amber-500/30 font-mono">
                                                    Custom ({overrideCount})
                                                </Badge>
                                            ) : (
                                                <Badge variant="neutral" size="sm" className="font-mono">
                                                    Default Matrix
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={getStatusVariant(m.userStatus)} size="md">
                                                {m.userStatus.replaceAll("_", " ")}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={m.isVerified ? "positive" : "negative"} size="md">
                                                {m.isVerified ? "Verified" : "Unverified"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="font-sans text-xs text-on-surface-variant tabular-nums">
                                            {formatDate(m.lastLoginAt)}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Authorize
                                                    feature="team_members"
                                                    level="admin"
                                                    disabledTooltip="Requires Admin permission on Team Members">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => setSelectedMember(m)}
                                                        className="text-xs h-7.5 px-2.5">
                                                        <MaterialIcon name="tune" size="xs" />
                                                        Permissions
                                                    </Button>
                                                </Authorize>

                                                <Link
                                                    href={`mailto:${m.email}`}
                                                    className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors p-1"
                                                    title={`Email ${m.email}`}>
                                                    <MaterialIcon name="mail" size="sm" />
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <ManagePermissionsDrawer
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </>
    );
}
