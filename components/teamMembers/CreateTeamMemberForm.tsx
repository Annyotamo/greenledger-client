"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateTeamMember } from "@/lib/teamMembers/hooks";
import { CustomSelect } from "@/components/ui/select";
import { getCurrentUser, UserProfile } from "@/lib/user/api";

const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "ESG_TEAM",
    phone_number: "",
    job_title: "",
};

export function CreateTeamMemberForm() {
    const router = useRouter();
    const { mutate, isPending, isError, error } = useCreateTeamMember();
    const [form, setForm] = useState(initialState);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const profile = await getCurrentUser();
                if (mounted) {
                    setCurrentUser(profile);
                    const isOwnerOrAdmin = profile.role === "TENANT_OWNER" || profile.role === "TENANT_ADMIN";
                    if (!isOwnerOrAdmin) {
                        setForm((c) => ({ ...c, role: "ESG_TEAM" }));
                    }
                }
            } catch (err) {
                console.error("Failed to load current user", err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const getRoleOptions = () => {
        const options = [];
        const isOwnerOrAdmin = currentUser?.role === "TENANT_OWNER" || currentUser?.role === "TENANT_ADMIN";
        
        if (isOwnerOrAdmin) {
            options.push({ label: "Tenant Admin", value: "TENANT_ADMIN" });
        }
        
        options.push(
            { label: "ESG Team", value: "ESG_TEAM" },
            { label: "Facility Head", value: "FACILITY_HEAD" },
            { label: "Auditor", value: "AUDITOR" }
        );
        
        return options;
    };

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
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                First Name <span className="text-error">*</span>
                            </label>
                            <Input
                                value={form.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                placeholder="e.g., Jane"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Last Name <span className="text-error">*</span>
                            </label>
                            <Input
                                value={form.last_name}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                                placeholder="e.g., Doe"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                            Email <span className="text-error">*</span>
                        </label>
                        <Input
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            type="email"
                            placeholder="e.g., jane.doe@company.com"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                            Password <span className="text-error">*</span>
                        </label>
                        <Input
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            type="password"
                            placeholder="••••••••"
                        />
                        <p className="text-body-md text-on-surface-variant">Min 8 characters.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="grid gap-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Role <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={getRoleOptions()}
                                value={form.role}
                                onChange={(val) => handleChange("role", val)}
                                placeholder="Select role..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Job Title
                            </label>
                            <Input
                                value={form.job_title}
                                onChange={(e) => handleChange("job_title", e.target.value)}
                                placeholder="e.g., Sustainability Manager"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                            Phone Number
                        </label>
                        <Input
                            value={form.phone_number}
                            onChange={(e) => handleChange("phone_number", e.target.value)}
                            placeholder="e.g., +91 98765 43210"
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
