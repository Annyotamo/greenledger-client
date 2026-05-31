"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateReportingPeriod } from "@/lib/reportingPeriods/hooks";

type CreateReportingPeriodFormProps = {
    onSuccess?: () => void;
};

const initialState = {
    name: "",
    reporting_year: new Date().getFullYear(),
    period_start: "",
    period_end: "",
};

export function CreateReportingPeriodForm({ onSuccess }: CreateReportingPeriodFormProps) {
    const router = useRouter();
    const { mutate, isPending, isError, error } = useCreateReportingPeriod();
    const [form, setForm] = useState(initialState);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleChange = (key: keyof typeof initialState, value: string | number) => {
        setForm((current) => ({ ...current, [key]: value }));
        setValidationError(null);
    };

    const validateForm = (): boolean => {
        if (!form.name.trim()) {
            setValidationError("Period name is required.");
            return false;
        }

        if (!form.period_start) {
            setValidationError("Period start date is required.");
            return false;
        }

        if (!form.period_end) {
            setValidationError("Period end date is required.");
            return false;
        }

        const startDate = new Date(form.period_start);
        const endDate = new Date(form.period_end);

        if (startDate >= endDate) {
            setValidationError("Period end date must be after period start date.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        mutate(
            {
                name: form.name.trim(),
                reporting_year: form.reporting_year,
                period_start: form.period_start,
                period_end: form.period_end,
            },
            {
                onSuccess: () => {
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        router.push("/reporting-period");
                    }
                },
            },
        );
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {(validationError || isError) && (
                <div className="flex items-start gap-3 rounded-lg border border-error/20 bg-error/5 p-4">
                    <MaterialIcon name="error" size="sm" className="text-error mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-label-md text-label-md text-error font-semibold uppercase">Error</p>
                        <p className="text-body-md text-error mt-1">
                            {validationError || error?.message || "Failed to create reporting period."}
                        </p>
                    </div>
                </div>
            )}

            {/* Basic Information Section */}
            <Card>
                <CardHeader bordered tone="strip">
                    <div className="flex items-center gap-3">
                        <MaterialIcon name="info" size="sm" className="text-on-secondary-container" />
                        <h3 className="text-headline-sm font-semibold text-primary">Basic Information</h3>
                    </div>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* Period Name */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="name"
                            className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                            Period Name
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                                <MaterialIcon name="edit" size="sm" />
                            </div>
                            <Input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="e.g., Reporting period 2025"
                                disabled={isPending}
                            />
                        </div>
                        <p className="text-body-md text-on-surface-variant">
                            A descriptive name for this reporting period.
                        </p>
                    </div>

                    {/* Reporting Year */}
                    <div className="grid gap-2">
                        <label
                            htmlFor="reporting_year"
                            className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                            Reporting Year
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                                <MaterialIcon name="calendar_today" size="sm" />
                            </div>
                            <Input
                                id="reporting_year"
                                type="number"
                                value={form.reporting_year}
                                onChange={(e) => handleChange("reporting_year", parseInt(e.target.value, 10))}
                                min="2000"
                                max="2100"
                                disabled={isPending}
                            />
                        </div>
                        <p className="text-body-md text-on-surface-variant">
                            The fiscal or calendar year for this period.
                        </p>
                    </div>
                </CardBody>
            </Card>

            {/* Date Range Section */}
            <Card>
                <CardHeader bordered tone="strip">
                    <div className="flex items-center gap-3">
                        <MaterialIcon name="date_range" size="sm" className="text-on-secondary-container" />
                        <h3 className="text-headline-sm font-semibold text-primary">Period Duration</h3>
                    </div>
                </CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Period Start Date */}
                        <div className="grid gap-2">
                            <label
                                htmlFor="period_start"
                                className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                Period Start
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                                    <MaterialIcon name="date_range" size="sm" />
                                </div>
                                <Input
                                    id="period_start"
                                    type="date"
                                    value={form.period_start}
                                    onChange={(e) => handleChange("period_start", e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        {/* Period End Date */}
                        <div className="grid gap-2">
                            <label
                                htmlFor="period_end"
                                className="text-label-md font-label-md uppercase tracking-[0.05em] text-on-surface">
                                Period End
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                                    <MaterialIcon name="date_range" size="sm" />
                                </div>
                                <Input
                                    id="period_end"
                                    type="date"
                                    value={form.period_end}
                                    onChange={(e) => handleChange("period_end", e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-body-md text-on-surface-variant">
                        Define the start and end dates for this reporting period. The end date must be after the start
                        date.
                    </p>
                </CardBody>
            </Card>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end">
                <Button type="button" variant="secondary" size="md" onClick={() => router.back()} disabled={isPending}>
                    <MaterialIcon name="close" size="sm" />
                    Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={isPending}>
                    <MaterialIcon name="check" size="sm" />
                    {isPending ? "Creating..." : "Create Period"}
                </Button>
            </div>
        </form>
    );
}
