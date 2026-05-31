"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamMembersSummary } from "@/components/teamMembers/TeamMembersSummary";
import { TeamMembersTable } from "@/components/teamMembers/TeamMembersTable";
import { useTeamMembers } from "@/lib/teamMembers/hooks";

export default function TeamMembersPage() {
    const { data: members = [], isPending, isError } = useTeamMembers();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const roleOptions = useMemo(() => Array.from(new Set(members.map((m) => m.role))).sort(), [members]);

    const filtered = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return members.filter((member) => {
            const matchesSearch =
                !query || member.fullName.toLowerCase().includes(query) || member.email.toLowerCase().includes(query);
            const matchesRole = !selectedRole || member.role === selectedRole;
            return matchesSearch && matchesRole;
        });
    }, [members, searchTerm, selectedRole]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Team Members</h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        Manage user accounts and roles for your tenant.
                    </p>
                </div>

                <Link href="/team-members/create" className="inline-flex">
                    <Button variant="primary" size="md">
                        <MaterialIcon name="person_add" size="sm" />
                        New Member
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_260px] items-end">
                <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                        <MaterialIcon name="search" size="sm" />
                    </div>
                    <Input
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="grid gap-2">
                    <label
                        htmlFor="role-filter"
                        className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface-variant">
                        Role
                    </label>
                    <select
                        id="role-filter"
                        value={selectedRole}
                        onChange={(event) => setSelectedRole(event.target.value)}
                        className="w-full rounded-lg border border-outline-variant bg-surface-container py-2 px-3 text-body-md text-on-surface focus:ring-1 focus:ring-primary">
                        <option value="">All roles</option>
                        {roleOptions.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <TeamMembersSummary members={members} />

            <TeamMembersTable members={filtered} isLoading={isPending} isError={isError} />
        </div>
    );
}
