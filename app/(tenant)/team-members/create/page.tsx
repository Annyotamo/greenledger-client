"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CreateTeamMemberForm } from "@/components/teamMembers/CreateTeamMemberForm";

export default function CreateTeamMemberPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-container-margin">
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
                <Link href="/team-members" className="hover:text-primary transition-colors">
                    Team Members
                </Link>
                <MaterialIcon name="chevron_right" size="xs" />
                <span className="text-primary font-semibold">Create New Member</span>
            </div>

            <header className="mb-10">
                <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Create Team Member</h1>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Add a new user to your tenant and assign an appropriate role for access control.
                </p>
            </header>

            <CreateTeamMemberForm />
        </div>
    );
}
