"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateTeamMember } from "@/lib/teamMembers/hooks";

const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "TENANT_MEMBER",
    phone_number: "",
    job_title: "",
};

export function CreateTeamMemberForm() {
    const router = useRouter();
    const { mutate, isPending, isError, error } = useCreateTeamMember();
    const [form, setForm] = useState(initialState);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleChange = (key: keyof typeof initialState, value: string) => {
        setForm((c) => ({ ...c, [key]: value }));
        setValidationError(null);
    };

    const validate = () => {
        if (!form.first_name.trim() || !form.last_name.trim()) {
            setValidationError("First and last name are required.");
            return false;
        }
        if (!form.email.includes("@")) {
            setValidationError("A valid email is required.");
            return false;
        }
        if (form.password.length < 8) {
            setValidationError("Password must be at least 8 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        mutate(
            {
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role,
                phone_number: form.phone_number || undefined,
                job_title: form.job_title || undefined,
            },
            {
                onSuccess: () => router.push("/team-members"),
            },
        );
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            {(validationError || isError) && (
                <div className="flex items-start gap-3 rounded-lg border border-error/20 bg-error/5 p-4">
                    <MaterialIcon name="error" size="sm" className="text-error mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-label-md text-label-md text-error font-semibold uppercase">Error</p>
                        <p className="text-body-md text-error mt-1">
                            {validationError || (error as any)?.message || "Failed to create user."}
                        </p>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader bordered tone="strip">
                    <div className="flex items-center gap-3">
                        <MaterialIcon name="person_add" size="sm" className="text-on-secondary-container" />
                        <h3 className="text-headline-sm font-semibold text-primary">User Details</h3>
                    </div>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                First Name
                            </label>
                            <Input
                                value={form.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                Last Name
                            </label>
                            <Input value={form.last_name} onChange={(e) => handleChange("last_name", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                            Email
                        </label>
                        <Input
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            type="email"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                            Password
                        </label>
                        <Input
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            type="password"
                        />
                        <p className="text-body-md text-on-surface-variant">Min 8 characters.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                Role
                            </label>
                            <select
                                className="w-full rounded-lg border border-outline-variant bg-surface-container py-2 pl-3 pr-4 text-body-md"
                                value={form.role}
                                onChange={(e) => handleChange("role", e.target.value)}>
                                <option value="TENANT_OWNER">TENANT_OWNER</option>
                                <option value="TENANT_ADMIN">TENANT_ADMIN</option>
                                <option value="TENANT_MEMBER">TENANT_MEMBER</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                Job Title
                            </label>
                            <Input value={form.job_title} onChange={(e) => handleChange("job_title", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                            Phone Number
                        </label>
                        <Input
                            value={form.phone_number}
                            onChange={(e) => handleChange("phone_number", e.target.value)}
                        />
                    </div>
                </CardBody>
            </Card>

            <div className="flex gap-3 justify-end">
                <Button type="button" variant="secondary" size="md" onClick={() => router.back()} disabled={isPending}>
                    <MaterialIcon name="close" size="sm" />
                    Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={isPending}>
                    <MaterialIcon name="check" size="sm" />
                    {isPending ? "Creating..." : "Create User"}
                </Button>
            </div>
        </form>
    );
}
