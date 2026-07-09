"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

interface FormErrorSummaryProps {
    errors: Record<string, string>;
    submitError?: string | null;
    fieldLabels?: Record<string, string>;
}

const DEFAULT_FIELD_LABELS: Record<string, string> = {
    reportingPeriod: "Reporting Period",
    facility: "Facility",
    activityStartDate: "Activity Start Date",
    activityEndDate: "Activity End Date",
    usageType: "Usage Type",
    emissionType: "Emission Type",
    generatorEfficiency: "Generator Efficiency",
    fuelType: "Fuel Type",
    fuelCategory: "Fuel Category",
    cost: "Price / Cost",
    quantity: "Quantity",
    unit: "Unit",
    collectionType: "Collection Type",
    estimationBasis: "Estimation Basis",
    electricityKwh: "Electricity Amount",
    electricityUnit: "Electricity Unit",
    electricityActivityType: "Activity Type",
    sourceType: "Source Type",
    dataQualityTier: "Data Quality",
    notes: "Notes",
    // Facility registration labels
    name: "Facility Name",
    facilityCode: "Facility Code",
    facilityType: "Facility Type",
    operationalControl: "Operational Control",
    financialControl: "Financial Control",
    ownershipPercent: "Ownership Percentage",
    country: "Country",
    city: "City",
    addressLine1: "Address Line 1",
    operationalSince: "Operational Since",
    operationalUntil: "Operational Until",
    floorArea: "Floor Area",
    floorAreaUnit: "Floor Area Unit",
    employeeCount: "Employee Count",
};

function getFieldLabel(key: string, labels?: Record<string, string>): string {
    if (labels && labels[key]) return labels[key];
    if (DEFAULT_FIELD_LABELS[key]) return DEFAULT_FIELD_LABELS[key];
    if (key.startsWith("doc-")) {
        const parts = key.split("-");
        const type = parts[parts.length - 1];
        if (type === "type") return "Document Type";
        if (type === "name") return "Document Name";
        if (type === "date") return "Document Date";
        if (type === "source") return "Document Upload/Link";
        return "Supporting Document";
    }
    return key;
}

export function FormErrorSummary({ errors, submitError, fieldLabels }: FormErrorSummaryProps) {
    const errorKeys = Object.keys(errors).filter((k) => k !== "submit" && errors[k]);
    const hasErrors = errorKeys.length > 0;
    const displaySubmitError = submitError || errors.submit;

    if (!hasErrors && !displaySubmitError) return null;

    const handleScrollToField = (key: string) => {
        const element = document.getElementById(`form-field-${key}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            // Add a temporary subtle highlight/pulse or focus to the element
            element.classList.add("ring-2", "ring-error/50", "transition-all", "duration-300");
            setTimeout(() => {
                element.classList.remove("ring-2", "ring-error/50");
            }, 2000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 overflow-hidden rounded-xl border border-[#ffdad6] bg-[#ffdad6]/20 p-5 backdrop-blur-xs"
        >
            <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ffdad6] text-[#93000a]">
                    <MaterialIcon name="error" size="sm" />
                </div>
                <div className="flex-1">
                    <h3 className="text-body-lg font-bold text-[#93000a]">
                        {displaySubmitError ? "Submission Failed" : "Please Correct the Validation Errors"}
                    </h3>
                    <p className="mt-1 text-sm text-[#93000a]/80 leading-relaxed">
                        {displaySubmitError
                            ? displaySubmitError
                            : "Some mandatory fields were missed or filled incorrectly. Please review the highlighted fields."}
                    </p>

                    {hasErrors && (
                        <div className="mt-4 border-t border-[#ffdad6]/40 pt-3">
                            <span className="text-[10px] font-bold tracking-wider text-[#93000a]/70 font-mono block mb-2 uppercase">
                                Action Required on the following fields:
                            </span>
                            <ul className="grid gap-2 sm:grid-cols-2">
                                {errorKeys.map((key) => {
                                    const label = getFieldLabel(key, fieldLabels);
                                    const message = errors[key];
                                    return (
                                        <li key={key}>
                                            <button
                                                type="button"
                                                onClick={() => handleScrollToField(key)}
                                                className="group flex w-full items-start gap-1.5 rounded-lg p-1.5 text-left text-xs transition hover:bg-[#ffdad6]/30 active:scale-[0.98]"
                                            >
                                                <MaterialIcon name="arrow_right" size="xs" className="mt-0.5 text-[#93000a]" />
                                                <div>
                                                    <span className="font-semibold text-[#93000a] group-hover:underline">
                                                        {label}
                                                    </span>
                                                    <span className="block text-[#93000a]/70 mt-0.5">
                                                        {message}
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
