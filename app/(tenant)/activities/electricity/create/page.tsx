"use client";

import type { FormEvent } from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isAfter } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useFacilities } from "@/lib/facility/hooks";
import { useEmissionSources } from "@/lib/emissionSource/hooks";
import type { AccountingMethod } from "@/lib/activity/electricityTypes";
import {
    createElectricityActivity,
    uploadElectricityActivityDocument,
    uploadS3File,
    createFuelActivity,
    uploadFuelActivityDocument,
} from "@/lib/activity/api";
import { CustomSelect } from "@/components/ui/select";
import { ActivityDocumentsManager } from "@/components/activity/ActivityDocumentsManager";
import type { ActivityDocument } from "@/components/activity/ActivityDocumentsManager";
import { FormErrorSummary } from "@/components/ui/FormErrorSummary";
import { getErrorMessage } from "@/lib/utils/error";
import { CustomFuelSection } from "@/components/activity/CustomFuelSection";
import { useCustomFuelUnits } from "@/lib/customFuel/hooks";

const scope2DisabledActivityTypeOptions = [
    { label: "Renewable", value: "renewable" },
    { label: "Captive", value: "captive" },
    { label: "Other", value: "other" },
];

const scope2EnabledActivityTypeOptions = [
    { label: "Grid Import", value: "grid_import" },
];

const locationSourceTypesByActivity: Record<string, { label: string; value: string }[]> = {
    grid_import: [{ label: "National Grid", value: "national_grid" }],
    renewable: [
        { label: "Solar", value: "solar" },
        { label: "Hydro", value: "hydro" },
        { label: "Wind", value: "wind" },
    ],
    captive: [
        { label: "WHRB", value: "whrb" },
        { label: "FBC", value: "fbc" },
    ],
    other: [{ label: "Waste Fuel", value: "waste_fuel" }],
};

const marketSourceOptions = [
    { label: "Renewable PPA", value: "renewable_ppa" },
    { label: "Non-Renewable PPA", value: "non_renewable_ppa" },
    { label: "REC Backed Electricity", value: "rec_backed_electricity" },
    { label: "I-REC Backed Electricity", value: "irec_backed_electricity" },
];

const emissionFactorUnitOptions = [
    { label: "tCO₂ / MWh", value: "tco2_per_mwh" },
    { label: "kgCO₂ / MWh", value: "kgco2_per_mwh" },
    { label: "tCO₂ / kWh", value: "tco2_per_kwh" },
    { label: "kgCO₂ / kWh", value: "kgco2_per_kwh" },
];

const purchasedEnergyEfUnitOptions = [
    { label: "tCO₂ / GJ", value: "tco2_per_gj" },
    { label: "kgCO₂ / GJ", value: "kgco2_per_gj" },
    { label: "tCO₂ / MJ", value: "tco2_per_mj" },
    { label: "kgCO₂ / MJ", value: "kgco2_per_mj" },
];

const isDocEmpty = (doc: ActivityDocument) => {
    return (
        !doc.documentType &&
        !doc.documentName &&
        !doc.documentDate &&
        !doc.file &&
        !doc.attachmentName &&
        !doc.documentLink &&
        !doc.notes
    );
};

function formFieldClass(error?: boolean) {
    return `w-full rounded-lg border ${error ? "border-error" : "border-outline-variant"} bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-colors`;
}

export default function LogElectricityActivityPage() {
    const [enableScope2Tracking, setEnableScope2Tracking] = useState(false);
    const [accountingMethod, setAccountingMethod] = useState<AccountingMethod>("location_based");

    const [form, setForm] = useState({
        reportingPeriod: "",
        facility: "",
        source: "",
        electricityKwh: "",
        electricityUnit: "kwh",
        electricityActivityType: "renewable",
        sourceType: "solar",
        supplierName: "",
        dataQualityTier: "",
        activityStartDate: "",
        activityEndDate: "",
        notes: "",
    });

    const [marketForm, setMarketForm] = useState({
        contractedElectricityKwh: "",
        contractedElectricityUnit: "kwh",
        contractedEmissionFactor: "0.0",
        contractedEmissionFactorUnit: "tco2_per_mwh",
        uncoveredElectricityKwh: "",
        uncoveredElectricityUnit: "kwh",
        // Market Certificate Audit Trail (Optional)
        showCertificateDetails: false,
        certSerialNumber: "",
        certDateAcquired: "",
        certExpirationDate: "",
        certQuantity: "",
        certReference: "",
        certIsRenewable: true,
        // Purchased Energy Details (Optional)
        includePurchasedEnergy: false,
        purchasedEnergyUnit: "gj",
        steam: "",
        heating: "",
        cooling: "",
        steamEmissionFactor: "",
        heatingEmissionFactor: "",
        coolingEmissionFactor: "",
        purchasedEnergyEfUnit: "kgco2_per_gj",
    });

    const activeActivityTypeOptions = useMemo(() => {
        if (enableScope2Tracking) {
            return scope2EnabledActivityTypeOptions;
        }
        return scope2DisabledActivityTypeOptions;
    }, [enableScope2Tracking]);

    function handleScope2TrackingToggle(enabled: boolean) {
        setEnableScope2Tracking(enabled);
        if (enabled) {
            setForm((current) => ({
                ...current,
                electricityActivityType: "grid_import",
                sourceType: "national_grid",
            }));
        } else {
            setAccountingMethod("location_based");
            setForm((current) => ({
                ...current,
                electricityActivityType: current.electricityActivityType === "grid_import" ? "renewable" : (current.electricityActivityType || "renewable"),
                sourceType: current.electricityActivityType === "grid_import" ? "solar" : (current.sourceType || "solar"),
            }));
        }
    }

    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const [fuelForm, setFuelForm] = useState({
        fuelCategory: "",
        fuelType: "",
        customFuelId: "",
        quantity: "",
        unit: "",
        emissionType: "stationary",
        cost: "",
        source: "",
    });

    const [documents, setDocuments] = useState<ActivityDocument[]>([
        {
            id: "initial-doc",
            documentType: "",
            documentName: "",
            documentLink: "",
            documentDate: "",
            file: null,
            attachmentName: "",
            sourceMode: "upload",
            notes: "",
        },
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const reportingPeriodsQuery = useReportingPeriods();
    const facilitiesQuery = useFacilities();
    const emissionSourcesQuery = useEmissionSources();
    const fuelEmissionSourcesQuery = useEmissionSources("fuel");
    const customFuelUnitsQuery = useCustomFuelUnits(Boolean(fuelForm.customFuelId));

    useEffect(() => {
        if (emissionSourcesQuery.data && emissionSourcesQuery.data.length > 0) {
            const ceaSource = emissionSourcesQuery.data.find(
                (s: { standard: string; id: string }) =>
                    s.standard.toLowerCase().includes("cea") ||
                    s.standard.toLowerCase().includes("central electricity authority")
            );
            if (ceaSource) {
                setForm((current) => ({ ...current, source: String(ceaSource.id) }));
            }
        }
    }, [emissionSourcesQuery.data]);

    useEffect(() => {
        if (!fuelForm.source && fuelEmissionSourcesQuery.data && fuelEmissionSourcesQuery.data.length > 0) {
            setFuelForm((current) => ({ ...current, source: String(fuelEmissionSourcesQuery.data[0].id) }));
        }
    }, [fuelForm.source, fuelEmissionSourcesQuery.data]);

    // Switch accounting method behavior
    function handleAccountingMethodChange(method: AccountingMethod) {
        setAccountingMethod(method);
        setErrors((current) => ({
            ...current,
            accountingMethod: "",
            electricityActivityType: "",
            sourceType: "",
            contractedElectricityKwh: "",
            contractedEmissionFactor: "",
        }));

        if (method === "market_based") {
            setForm((current) => ({
                ...current,
                electricityActivityType: "market_instruments",
                sourceType: marketSourceOptions.some((opt) => opt.value === current.sourceType)
                    ? current.sourceType
                    : "renewable_ppa",
            }));
            // Zero EF default for renewable PPA
            setMarketForm((current) => ({
                ...current,
                contractedEmissionFactor: "0.0",
            }));
        } else {
            setForm((current) => ({
                ...current,
                electricityActivityType: current.electricityActivityType === "market_instruments" ? "" : current.electricityActivityType,
                sourceType: "",
            }));
        }
    }

    function handleChange(field: string, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleMarketChange(field: string, value: string | boolean | number) {
        setMarketForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleActivityTypeChange(value: string) {
        setForm((current) => ({
            ...current,
            electricityActivityType: value,
            sourceType: "",
        }));
        setErrors((current) => ({
            ...current,
            electricityActivityType: "",
            sourceType: "",
        }));
    }

    function handleSourceTypeChange(value: string) {
        setForm((current) => ({ ...current, sourceType: value }));
        setErrors((current) => ({ ...current, sourceType: "" }));

        // Zero EF Rule: renewable_ppa, rec_backed_electricity, irec_backed_electricity must be 0
        if (accountingMethod === "market_based") {
            if (["renewable_ppa", "rec_backed_electricity", "irec_backed_electricity"].includes(value)) {
                setMarketForm((current) => ({ ...current, contractedEmissionFactor: "0.0" }));
            } else if (value === "non_renewable_ppa" && marketForm.contractedEmissionFactor === "0.0") {
                setMarketForm((current) => ({ ...current, contractedEmissionFactor: "0.75" }));
            }
        }
    }

    const sourceOptions = useMemo(() => {
        if (accountingMethod === "market_based") {
            return marketSourceOptions;
        }
        return form.electricityActivityType ? locationSourceTypesByActivity[form.electricityActivityType] || [] : [];
    }, [accountingMethod, form.electricityActivityType]);

    function handleFuelChange(field: string, value: string) {
        setFuelForm((current) => {
            const next = { ...current, [field]: value } as typeof fuelForm;
            if (field === "source") {
                next.fuelCategory = "";
                next.fuelType = "";
                next.customFuelId = "";
                next.unit = "";
            }
            if (field === "fuelCategory") {
                next.fuelType = "";
                next.unit = "";
            }
            if (field === "fuelType") {
                next.customFuelId = "";
                next.unit = "";
            }
            if (field === "emissionType") {
                next.fuelCategory = "";
                next.fuelType = "";
                next.customFuelId = "";
                next.unit = "";
            }
            return next;
        });
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleStartDateChange(date: Date) {
        const nextEndDate = selectedEndDate && isAfter(date, selectedEndDate) ? date : selectedEndDate;
        setSelectedStartDate(date);
        setSelectedEndDate(nextEndDate);
        setForm((current) => ({
            ...current,
            activityStartDate: format(date, "yyyy-MM-dd"),
            activityEndDate: nextEndDate ? format(nextEndDate, "yyyy-MM-dd") : current.activityEndDate,
        }));
        setErrors((current) => ({ ...current, activityStartDate: "", activityEndDate: "" }));
    }

    function handleEndDateChange(date: Date) {
        const nextStartDate = selectedStartDate ? (isAfter(selectedStartDate, date) ? date : selectedStartDate) : date;
        setSelectedEndDate(date);
        setSelectedStartDate(nextStartDate);
        setForm((current) => ({
            ...current,
            activityStartDate: format(nextStartDate, "yyyy-MM-dd"),
            activityEndDate: format(date, "yyyy-MM-dd"),
        }));
        setErrors((current) => ({ ...current, activityEndDate: "" }));
    }

    // Calculated derived values for preview box in Market-Based Mode
    const calculatedMarketMetrics = useMemo(() => {
        if (accountingMethod !== "market_based") return null;

        const contractedKwh = marketForm.contractedElectricityUnit === "mwh"
            ? (Number(marketForm.contractedElectricityKwh) || 0) * 1000
            : (Number(marketForm.contractedElectricityKwh) || 0);

        const uncoveredKwh = marketForm.uncoveredElectricityUnit === "mwh"
            ? (Number(marketForm.uncoveredElectricityKwh) || 0) * 1000
            : (Number(marketForm.uncoveredElectricityKwh) || 0);

        const totalKwh = contractedKwh + uncoveredKwh;
        const totalMwh = totalKwh / 1000;

        const isZeroEf = ["renewable_ppa", "rec_backed_electricity", "irec_backed_electricity"].includes(form.sourceType);
        const contractedEf = isZeroEf ? 0 : (Number(marketForm.contractedEmissionFactor) || 0);

        // Convert EF to tCO2/MWh for estimation
        let contractedEfInMwh = contractedEf;
        if (marketForm.contractedEmissionFactorUnit === "kgco2_per_mwh") contractedEfInMwh = contractedEf / 1000;
        if (marketForm.contractedEmissionFactorUnit === "tco2_per_kwh") contractedEfInMwh = contractedEf * 1000;
        if (marketForm.contractedEmissionFactorUnit === "kgco2_per_kwh") contractedEfInMwh = contractedEf;

        const contractedEmissionsTons = (contractedKwh / 1000) * contractedEfInMwh;
        const uncoveredEmissionsTons = (uncoveredKwh * 0.71) / 1000; // Default grid EF ~0.71 kgCO2e/kWh

        let purchasedEmissionsTons = 0;
        if (marketForm.includePurchasedEnergy) {
            const isMjUnit = marketForm.purchasedEnergyUnit === "mj";
            const mult = isMjUnit ? 1 / 1000 : 1;
            const steamGj = (Number(marketForm.steam) || 0) * mult;
            const heatingGj = (Number(marketForm.heating) || 0) * mult;
            const coolingGj = (Number(marketForm.cooling) || 0) * mult;

            let efMult = 1;
            if (marketForm.purchasedEnergyEfUnit === "kgco2_per_gj") efMult = 1 / 1000;
            if (marketForm.purchasedEnergyEfUnit === "tco2_per_mj") efMult = 1000;
            if (marketForm.purchasedEnergyEfUnit === "kgco2_per_mj") efMult = 1;

            const steamEf = (Number(marketForm.steamEmissionFactor) || 0) * efMult;
            const heatingEf = (Number(marketForm.heatingEmissionFactor) || 0) * efMult;
            const coolingEf = (Number(marketForm.coolingEmissionFactor) || 0) * efMult;

            purchasedEmissionsTons = (steamGj * steamEf) + (heatingGj * heatingEf) + (coolingGj * coolingEf);
        }

        const totalEmissionsTons = contractedEmissionsTons + uncoveredEmissionsTons + purchasedEmissionsTons;

        return {
            contractedKwh,
            uncoveredKwh,
            totalKwh,
            totalMwh,
            contractedEmissionsTons,
            uncoveredEmissionsTons,
            purchasedEmissionsTons,
            totalEmissionsTons,
            isZeroEf,
        };
    }, [accountingMethod, form.sourceType, marketForm]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};

        if (!form.reportingPeriod) nextErrors.reportingPeriod = "Reporting period is required.";
        if (!form.facility) nextErrors.facility = "Facility is required.";
        if (!form.activityStartDate) nextErrors.activityStartDate = "Start date is required.";
        if (!form.activityEndDate) nextErrors.activityEndDate = "End date is required.";
        if (!form.dataQualityTier) nextErrors.dataQualityTier = "Data quality is required.";

        if (accountingMethod === "location_based") {
            if (!form.electricityKwh) nextErrors.electricityKwh = "Electricity amount is required.";
            if (!form.electricityUnit) nextErrors.electricityUnit = "Unit is required.";
            if (!form.electricityActivityType) nextErrors.electricityActivityType = "Activity type is required.";
            if (!form.sourceType) nextErrors.sourceType = "Source type is required.";

            if (form.electricityActivityType === "captive" && form.sourceType === "fbc") {
                if (!fuelForm.source) nextErrors.fuelSource = "Emission standard / source is required.";
                if (!fuelForm.customFuelId && !fuelForm.fuelType) {
                    nextErrors.fuelType = "Fuel type or Custom Fuel is required.";
                }
                if (!fuelForm.quantity) nextErrors.quantity = "Quantity is required.";
                if (!fuelForm.unit) nextErrors.unit = "Unit is required.";
                if (!fuelForm.emissionType) nextErrors.emissionType = "Emission Type is required.";
                if (fuelForm.emissionType !== "fugitive" && !fuelForm.cost) {
                    nextErrors.cost = "Price / Cost is required.";
                }
            }
        } else {
            // Market-Based Validation
            if (!form.sourceType) nextErrors.sourceType = "Market source type is required.";
            if (!marketForm.contractedElectricityKwh || Number(marketForm.contractedElectricityKwh) <= 0) {
                nextErrors.contractedElectricityKwh = "Contracted electricity amount (kWh) is required.";
            }

            const isZeroEf = ["renewable_ppa", "rec_backed_electricity", "irec_backed_electricity"].includes(form.sourceType);
            if (!isZeroEf && form.sourceType === "non_renewable_ppa") {
                if (marketForm.contractedEmissionFactor === "" || isNaN(Number(marketForm.contractedEmissionFactor))) {
                    nextErrors.contractedEmissionFactor = "Contracted emission factor is required for Non-Renewable PPA.";
                }
            }
        }

        // Validate supporting documents
        documents.forEach((doc) => {
            if (isDocEmpty(doc)) return;

            if (!doc.documentType) nextErrors[`doc-${doc.id}-type`] = "Document type is required.";
            if (!doc.documentName) nextErrors[`doc-${doc.id}-name`] = "Document name is required.";
            if (!doc.documentDate) nextErrors[`doc-${doc.id}-date`] = "Document date is required.";
            if (doc.sourceMode === "upload" && !doc.file && !doc.attachmentName) {
                nextErrors[`doc-${doc.id}-source`] = "A document file upload is required.";
            }
            if (doc.sourceMode === "link" && !doc.documentLink) {
                nextErrors[`doc-${doc.id}-source`] = "A document link is required.";
            }
        });

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
            const firstErrorKey = Object.keys(nextErrors)[0];
            setTimeout(() => {
                const element = document.getElementById(`form-field-${firstErrorKey}`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
            return;
        }

        setIsSubmitting(true);
        try {
            let payload: Record<string, unknown> = {};

            if (accountingMethod === "location_based") {
                const amount = Number(form.electricityKwh);
                const unit = form.electricityUnit?.toLowerCase();
                const kwh = unit === "mwh" ? amount * 1000 : amount;
                const mwh = unit === "kwh" ? amount / 1000 : amount;

                payload = {
                    reporting_period_id: form.reportingPeriod,
                    facility_id: form.facility,
                    source_id: form.source || undefined,
                    accounting_method: "location_based",
                    electricity_kwh: isFinite(kwh) ? String(kwh) : undefined,
                    electricity_mwh: isFinite(mwh) ? String(mwh) : undefined,
                    electricity_activity_type: form.electricityActivityType,
                    source_type: form.sourceType,
                    supplier_name: form.supplierName || undefined,
                    data_quality_tier: form.dataQualityTier,
                    activity_start_date: form.activityStartDate,
                    activity_end_date: form.activityEndDate,
                    notes: form.notes || undefined,
                };
            } else {
                // Market-Based Payload Construction
                const contractedKwh = marketForm.contractedElectricityUnit === "mwh"
                    ? Number(marketForm.contractedElectricityKwh) * 1000
                    : Number(marketForm.contractedElectricityKwh);

                const uncoveredKwh = marketForm.uncoveredElectricityKwh
                    ? (marketForm.uncoveredElectricityUnit === "mwh"
                        ? Number(marketForm.uncoveredElectricityKwh) * 1000
                        : Number(marketForm.uncoveredElectricityKwh))
                    : 0.0;

                const isZeroEf = ["renewable_ppa", "rec_backed_electricity", "irec_backed_electricity"].includes(form.sourceType);
                const contractedEf = isZeroEf ? 0.0 : Number(marketForm.contractedEmissionFactor || 0);

                const totalKwh = contractedKwh + uncoveredKwh;

                payload = {
                    reporting_period_id: form.reportingPeriod,
                    facility_id: form.facility,
                    activity_start_date: form.activityStartDate,
                    activity_end_date: form.activityEndDate,
                    accounting_method: "market_based",
                    electricity_activity_type: "market_instruments",
                    source_type: form.sourceType,
                    supplier_name: form.supplierName || undefined,
                    electricity_kwh: totalKwh,
                    electricity_mwh: totalKwh / 1000,
                    data_quality_tier: form.dataQualityTier,
                    notes: form.notes || undefined,
                    market_allocation: {
                        contracted_electricity_kwh: contractedKwh,
                        contracted_emission_factor: contractedEf,
                        contracted_emission_factor_unit: marketForm.contractedEmissionFactorUnit,
                        uncovered_electricity_kwh: uncoveredKwh,
                    },
                };

                if (
                    marketForm.showCertificateDetails ||
                    marketForm.certSerialNumber ||
                    marketForm.certReference
                ) {
                    payload.market_certificate = {
                        serial_number: marketForm.certSerialNumber || undefined,
                        date_acquired: marketForm.certDateAcquired || undefined,
                        expiration_date: marketForm.certExpirationDate || undefined,
                        quantity: marketForm.certQuantity ? Number(marketForm.certQuantity) : undefined,
                        certificate_reference: marketForm.certReference || undefined,
                        is_renewable_certified: marketForm.certIsRenewable,
                    };
                }

                if (marketForm.includePurchasedEnergy) {
                    payload.include_purchased_energy = true;
                    payload.purchased_energy = {
                        unit: marketForm.purchasedEnergyUnit,
                        steam: marketForm.steam ? Number(marketForm.steam) : undefined,
                        heating: marketForm.heating ? Number(marketForm.heating) : undefined,
                        cooling: marketForm.cooling ? Number(marketForm.cooling) : undefined,
                        steam_emission_factor: marketForm.steamEmissionFactor ? Number(marketForm.steamEmissionFactor) : undefined,
                        heating_emission_factor: marketForm.heatingEmissionFactor ? Number(marketForm.heatingEmissionFactor) : undefined,
                        cooling_emission_factor: marketForm.coolingEmissionFactor ? Number(marketForm.coolingEmissionFactor) : undefined,
                        emission_factor_unit: marketForm.purchasedEnergyEfUnit,
                    };
                }
            }

            const createResponse = await createElectricityActivity(payload);
            const activityId = createResponse?.data?.id ?? createResponse?.id ?? createResponse?.data?.data?.id ?? null;

            if (!activityId) throw new Error("Created activity ID not returned from API.");

            let fuelActivityId: string | null = null;
            if (accountingMethod === "location_based" && form.electricityActivityType === "captive" && form.sourceType === "fbc") {
                let finalQuantity = fuelForm.quantity ? Number(fuelForm.quantity) : null;
                let finalUnitId = fuelForm.unit;

                if (fuelForm.customFuelId && customFuelUnitsQuery.data && customFuelUnitsQuery.data.length > 0) {
                    const unitsList = customFuelUnitsQuery.data;
                    const kgUnit = unitsList.find(
                        (u: { symbol: string; name: string }) => u.symbol.toLowerCase() === "kg" || u.name.toLowerCase().includes("kilograms")
                    );
                    const tonneUnit = unitsList.find(
                        (u: { symbol: string; name: string }) =>
                            u.symbol.toLowerCase().includes("tonne") ||
                            u.symbol.toLowerCase() === "t" ||
                            u.name.toLowerCase().includes("tonne")
                    );

                    if (tonneUnit) {
                        if (kgUnit && fuelForm.unit === kgUnit.id && finalQuantity !== null) {
                            finalQuantity = finalQuantity / 1000;
                        }
                        finalUnitId = tonneUnit.id;
                    }
                }

                const fuelPayload: Record<string, unknown> = {
                    reporting_period_id: form.reportingPeriod,
                    facility_id: form.facility,
                    source_id: fuelForm.source,
                    electricity_activity_id: activityId,
                    emission_type: fuelForm.emissionType,
                    quantity: finalQuantity,
                    quantity_unit_id: finalUnitId,
                    cost: fuelForm.emissionType !== "fugitive" && fuelForm.cost ? Number(fuelForm.cost) : null,
                    data_quality_tier: form.dataQualityTier,
                    activity_start_date: form.activityStartDate,
                    activity_end_date: form.activityEndDate,
                };

                if (fuelForm.customFuelId) {
                    fuelPayload.custom_fuel_id = fuelForm.customFuelId;
                } else {
                    fuelPayload.fuel_id = fuelForm.fuelType;
                }

                const createFuelResponse = await createFuelActivity(fuelPayload);
                fuelActivityId = createFuelResponse?.data?.id ?? createFuelResponse?.id ?? createFuelResponse?.data?.data?.id ?? null;
                if (!fuelActivityId) throw new Error("Created fuel activity ID not returned from API.");
            }

            // Upload supporting evidence documents
            for (const doc of documents) {
                if (isDocEmpty(doc)) continue;

                let sourceUrl = "";
                if (doc.sourceMode === "upload" && doc.file) {
                    const uploadedUrl = await uploadS3File(doc.file);
                    sourceUrl = uploadedUrl || "";
                } else if (doc.sourceMode === "link") {
                    sourceUrl = doc.documentLink || "";
                }

                await uploadElectricityActivityDocument(activityId, {
                    fuel_activity_id: null,
                    electricity_activity_id: activityId,
                    document_type: doc.documentType,
                    document_name: doc.documentName,
                    source_url: sourceUrl || undefined,
                    notes: doc.notes || null,
                    document_date: doc.documentDate || null,
                });

                if (accountingMethod === "location_based" && form.electricityActivityType === "captive" && form.sourceType === "fbc" && fuelActivityId) {
                    await uploadFuelActivityDocument(fuelActivityId, {
                        fuel_activity_id: fuelActivityId,
                        electricity_activity_id: null,
                        document_type: doc.documentType,
                        document_name: doc.documentName,
                        source_url: sourceUrl || undefined,
                        notes: doc.notes || null,
                        document_date: doc.documentDate || null,
                    });
                }
            }

            router.push("/activities/electricity");
        } catch (err) {
            console.error(err);
            const message = getErrorMessage(err, "Failed to submit activity. Please try again.");
            setErrors({ submit: message });
            setTimeout(() => {
                const element = document.getElementById("logElectricityForm");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-container-margin">
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
                <Link href="/activities/electricity" className="hover:text-primary transition-colors">
                    Activities
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-primary font-semibold">Log Electricity Activity</span>
            </div>

            <header className="mb-10">
                <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Log Electricity Activity</h2>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Record grid import, renewable PPA contractual instruments, or captive generation entries with full market-based accounting support.
                </p>
            </header>

            <FormErrorSummary errors={errors} />

            <form id="logElectricityForm" onSubmit={handleSubmit} className="space-y-6">
                {/* Scope 2 Activity Tracking Toggle Card */}
                <section className="bg-white rounded-xl border border-outline-variant p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${enableScope2Tracking ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                                <MaterialIcon name="offline_bolt" size="sm" />
                            </div>
                            <div>
                                <h3 className="text-body-lg font-semibold text-primary">Enable Activity Tracking for Scope 2</h3>
                                <p className="text-xs text-on-surface-variant">
                                    {enableScope2Tracking
                                        ? "Scope 2 dual-reporting accounting enabled. Tracks Grid Import emissions under GHG Protocol Scope 2."
                                        : "Scope 2 tracking disabled. Select onsite renewable, captive, or other energy generation options."}
                                </p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={enableScope2Tracking}
                                onChange={(e) => handleScope2TrackingToggle(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </section>

                {/* 1. Accounting Method Selector - Only displayed when Scope 2 Activity Tracking is enabled */}
                {/* {enableScope2Tracking && (
                    <section className="bg-white rounded-xl border border-outline-variant relative overflow-hidden">
                        <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <MaterialIcon name="tune" size="sm" />
                                </div>
                                <div>
                                    <h2 className="text-headline-sm font-semibold text-primary">Accounting Method</h2>
                                    <p className="text-xs text-on-surface-variant">
                                        Select location-based (grid average) or market-based (contractual instruments).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-card-padding">
                            <div className="grid gap-4 sm:grid-cols-2" id="form-field-accountingMethod">
                                <button
                                    type="button"
                                    onClick={() => handleAccountingMethodChange("location_based")}
                                    className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all ${
                                        accountingMethod === "location_based"
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-outline-variant bg-white hover:border-primary/50"
                                    }`}>
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <div className="flex items-center gap-2">
                                            <MaterialIcon name="grid_view" size="sm" className="text-primary" />
                                            <span className="font-semibold text-primary text-body-md">Location-Based Method</span>
                                        </div>
                                        {accountingMethod === "location_based" && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary">
                                                <MaterialIcon name="check" size="xs" />
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">
                                        Uses regional grid average emission factors. Standard for default utility grid consumption without specific contracts.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleAccountingMethodChange("market_based")}
                                    className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all ${
                                        accountingMethod === "market_based"
                                            ? "border-secondary bg-secondary/5 shadow-sm"
                                            : "border-outline-variant bg-white hover:border-secondary/50"
                                    }`}>
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <div className="flex items-center gap-2">
                                            <MaterialIcon name="verified" size="sm" className="text-secondary" />
                                            <span className="font-semibold text-secondary text-body-md">Market-Based Method</span>
                                        </div>
                                        {accountingMethod === "market_based" && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-on-secondary">
                                                <MaterialIcon name="check" size="xs" />
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">
                                        Quantifies GHG emissions based on contractual agreements (PPAs, RECs, I-RECs). Supports zero emission factors for green energy.
                                    </p>
                                </button>
                            </div>
                        </div>
                    </section>
                )} */}

                {/* 2. Activity Context Section */}
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="bolt" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">Activity Context</h2>
                                <p className="text-xs text-on-surface-variant">
                                    Select reporting period, facility, and activity dates.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                        <div id="form-field-reportingPeriod">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Reporting Period <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={
                                    reportingPeriodsQuery.data?.map((p: { id: string; name: string }) => ({
                                        label: p.name,
                                        value: String(p.id),
                                    })) || []
                                }
                                value={form.reportingPeriod}
                                onChange={(val) => handleChange("reportingPeriod", val)}
                                error={Boolean(errors.reportingPeriod)}
                                placeholder="Select period..."
                            />
                            {errors.reportingPeriod && (
                                <p className="mt-2 text-xs text-error">{errors.reportingPeriod}</p>
                            )}
                        </div>
                        <div id="form-field-facility">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Facility <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={
                                    facilitiesQuery.data?.map((f: { id: string; name: string }) => ({
                                        label: f.name,
                                        value: String(f.id),
                                    })) || []
                                }
                                value={form.facility}
                                onChange={(val) => handleChange("facility", val)}
                                error={Boolean(errors.facility)}
                                placeholder="Select facility..."
                            />
                            {errors.facility && <p className="mt-2 text-xs text-error">{errors.facility}</p>}
                        </div>
                        <div id="form-field-activityStartDate" className="space-y-3 flex flex-col items-center">
                            <div className="flex items-center justify-between gap-2 w-full max-w-[340px]">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Activity Start Date <span className="text-error">*</span>
                                </label>
                                {selectedStartDate ? (
                                    <span className="text-xs text-on-surface-variant mb-2">
                                        {format(selectedStartDate, "PPP")}
                                    </span>
                                ) : null}
                            </div>
                            <Calendar
                                date={selectedStartDate}
                                onDateChange={handleStartDateChange}
                                className={errors.activityStartDate ? "border-error" : ""}
                            />
                            {errors.activityStartDate && (
                                <p className="mt-2 text-xs text-error w-full max-w-[340px]">
                                    {errors.activityStartDate}
                                </p>
                            )}
                        </div>
                        <div id="form-field-activityEndDate" className="space-y-3 flex flex-col items-center">
                            <div className="flex items-center justify-between gap-2 w-full max-w-[340px]">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Activity End Date <span className="text-error">*</span>
                                </label>
                                {selectedEndDate ? (
                                    <span className="text-xs text-on-surface-variant mb-2">
                                        {format(selectedEndDate, "PPP")}
                                    </span>
                                ) : null}
                            </div>
                            <Calendar
                                date={selectedEndDate}
                                onDateChange={handleEndDateChange}
                                className={errors.activityEndDate ? "border-error" : ""}
                            />
                            {errors.activityEndDate && (
                                <p className="mt-2 text-xs text-error w-full max-w-[340px]">{errors.activityEndDate}</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* 3. Location-Based Electricity Details Section */}
                {accountingMethod === "location_based" && (
                    <section className="bg-white rounded-xl border border-outline-variant relative">
                        <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                    <MaterialIcon name="electric_meter" size="sm" />
                                </div>
                                <div>
                                    <h2 className="text-headline-sm font-semibold text-primary">Electricity Details</h2>
                                    <p className="text-xs text-on-surface-variant">
                                        Enter grid or captive electricity consumption.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                            <div id="form-field-electricityKwh">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Electricity <span className="text-error">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        step="0.001"
                                        value={form.electricityKwh}
                                        onChange={(e) => handleChange("electricityKwh", e.target.value)}
                                        className={`${formFieldClass(Boolean(errors.electricityKwh))} flex-1`}
                                        placeholder="0.00"
                                    />
                                    <CustomSelect
                                        options={[
                                            { label: "kWh", value: "kwh" },
                                            { label: "MWh", value: "mwh" },
                                        ]}
                                        value={form.electricityUnit}
                                        onChange={(val) => handleChange("electricityUnit", val)}
                                        error={Boolean(errors.electricityUnit)}
                                        placeholder="Unit"
                                        className="w-[110px]"
                                    />
                                </div>
                                {errors.electricityKwh && (
                                    <p className="mt-2 text-xs text-error">{errors.electricityKwh}</p>
                                )}
                            </div>
                            <div id="form-field-electricityActivityType">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Activity Type <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={activeActivityTypeOptions}
                                    value={form.electricityActivityType}
                                    onChange={handleActivityTypeChange}
                                    error={Boolean(errors.electricityActivityType)}
                                    placeholder="Select type..."
                                />
                                {errors.electricityActivityType && (
                                    <p className="mt-2 text-xs text-error">{errors.electricityActivityType}</p>
                                )}
                            </div>
                            <div id="form-field-sourceType">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Source Type <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={sourceOptions}
                                    value={form.sourceType}
                                    onChange={handleSourceTypeChange}
                                    error={Boolean(errors.sourceType)}
                                    placeholder={
                                        form.electricityActivityType ? "Select source type..." : "Select activity type first..."
                                    }
                                    isDisabled={!form.electricityActivityType}
                                />
                                {errors.sourceType && <p className="mt-2 text-xs text-error">{errors.sourceType}</p>}
                            </div>
                            <div id="form-field-supplierName">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Supplier / Utility Name
                                </label>
                                <Input
                                    type="text"
                                    value={form.supplierName}
                                    onChange={(e) => handleChange("supplierName", e.target.value)}
                                    className={formFieldClass()}
                                    placeholder="e.g. State Power Grid Corp"
                                />
                            </div>
                            <div id="form-field-dataQualityTier">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Data Quality <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={[
                                        { label: "Measured", value: "measured" },
                                        { label: "Estimated", value: "estimated" },
                                    ]}
                                    value={form.dataQualityTier}
                                    onChange={(val) => handleChange("dataQualityTier", val)}
                                    error={Boolean(errors.dataQualityTier)}
                                    placeholder="Select quality..."
                                />
                                {errors.dataQualityTier && (
                                    <p className="mt-2 text-xs text-error">{errors.dataQualityTier}</p>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. Market-Based Instruments Section */}
                {accountingMethod === "market_based" && (
                    <section className="bg-white rounded-xl border border-outline-variant relative">
                        <div className="px-card-padding py-4 bg-secondary/10 border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-on-secondary">
                                    <MaterialIcon name="receipt_long" size="sm" />
                                </div>
                                <div>
                                    <h2 className="text-headline-sm font-semibold text-primary">Market Instrument & Allocation</h2>
                                    <p className="text-xs text-on-surface-variant">
                                        Configure PPA contracts, REC volumes, zero emission factors, and grid residual allocation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-card-padding grid gap-5 lg:grid-cols-2">
                            {/* Auto-set Activity Type */}
                            <div id="form-field-electricityActivityType">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Activity Type
                                </label>
                                <div className="flex h-10 w-10 items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface w-full">
                                    <MaterialIcon name="lock" size="xs" className="text-on-surface-variant" />
                                    <span className="font-semibold text-primary">Market Instruments</span>
                                </div>
                            </div>

                            {/* Source Type (4 Market Options) */}
                            <div id="form-field-sourceType">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Market Source Type <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={sourceOptions}
                                    value={form.sourceType}
                                    onChange={handleSourceTypeChange}
                                    error={Boolean(errors.sourceType)}
                                    placeholder="Select market source..."
                                />
                                {errors.sourceType && <p className="mt-2 text-xs text-error">{errors.sourceType}</p>}
                            </div>

                            {/* Supplier Name */}
                            <div id="form-field-supplierName">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Contract Supplier / PPA Counterparty
                                </label>
                                <Input
                                    type="text"
                                    value={form.supplierName}
                                    onChange={(e) => handleChange("supplierName", e.target.value)}
                                    className={formFieldClass()}
                                    placeholder="e.g. Statkraft Solar PPA, Utility Clean Energy"
                                />
                            </div>

                            {/* Data Quality Tier */}
                            <div id="form-field-dataQualityTier">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Data Quality <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={[
                                        { label: "Measured", value: "measured" },
                                        { label: "Estimated", value: "estimated" },
                                    ]}
                                    value={form.dataQualityTier}
                                    onChange={(val) => handleChange("dataQualityTier", val)}
                                    error={Boolean(errors.dataQualityTier)}
                                    placeholder="Select quality..."
                                />
                                {errors.dataQualityTier && (
                                    <p className="mt-2 text-xs text-error">{errors.dataQualityTier}</p>
                                )}
                            </div>

                            {/* Contracted Electricity kWh */}
                            <div id="form-field-contractedElectricityKwh" className="lg:col-span-2 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                                <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                                    <MaterialIcon name="bolt" size="xs" className="text-secondary" />
                                    1. Contracted Electricity Volume
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Contracted Quantity <span className="text-error">*</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                step="0.001"
                                                value={marketForm.contractedElectricityKwh}
                                                onChange={(e) => handleMarketChange("contractedElectricityKwh", e.target.value)}
                                                className={`${formFieldClass(Boolean(errors.contractedElectricityKwh))} flex-1`}
                                                placeholder="e.g. 50000"
                                            />
                                            <CustomSelect
                                                options={[
                                                    { label: "kWh", value: "kwh" },
                                                    { label: "MWh", value: "mwh" },
                                                ]}
                                                value={marketForm.contractedElectricityUnit}
                                                onChange={(val) => handleMarketChange("contractedElectricityUnit", val)}
                                                placeholder="Unit"
                                                className="w-[110px]"
                                            />
                                        </div>
                                        {errors.contractedElectricityKwh && (
                                            <p className="mt-2 text-xs text-error">{errors.contractedElectricityKwh}</p>
                                        )}
                                    </div>

                                    {/* Contracted Emission Factor */}
                                    <div id="form-field-contractedEmissionFactor">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="font-label-md text-label-md text-on-surface-variant">
                                                Contracted Emission Factor
                                            </label>
                                            {calculatedMarketMetrics?.isZeroEf ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-0.5 text-[10px] font-semibold text-secondary">
                                                    <MaterialIcon name="verified" size="xs" />
                                                    Zero EF Locked (Renewable)
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                disabled={calculatedMarketMetrics?.isZeroEf}
                                                value={calculatedMarketMetrics?.isZeroEf ? "0.0" : marketForm.contractedEmissionFactor}
                                                onChange={(e) => handleMarketChange("contractedEmissionFactor", e.target.value)}
                                                className={`${formFieldClass(Boolean(errors.contractedEmissionFactor))} flex-1 ${
                                                    calculatedMarketMetrics?.isZeroEf ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed" : ""
                                                }`}
                                                placeholder="0.00"
                                            />
                                            <CustomSelect
                                                options={emissionFactorUnitOptions}
                                                value={marketForm.contractedEmissionFactorUnit}
                                                onChange={(val) => handleMarketChange("contractedEmissionFactorUnit", val)}
                                                placeholder="Factor Unit"
                                                className="w-[160px]"
                                            />
                                        </div>
                                        {errors.contractedEmissionFactor && (
                                            <p className="mt-2 text-xs text-error">{errors.contractedEmissionFactor}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Uncovered Grid Electricity kWh */}
                            <div id="form-field-uncoveredElectricityKwh" className="lg:col-span-2 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                                <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                                    <MaterialIcon name="grid_off" size="xs" className="text-on-surface-variant" />
                                    2. Uncovered Grid Electricity (Optional Residual Volume)
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Uncovered Grid Quantity (Optional)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                step="0.001"
                                                value={marketForm.uncoveredElectricityKwh}
                                                onChange={(e) => handleMarketChange("uncoveredElectricityKwh", e.target.value)}
                                                className={`${formFieldClass()} flex-1`}
                                                placeholder="e.g. 20000"
                                            />
                                            <CustomSelect
                                                options={[
                                                    { label: "kWh", value: "kwh" },
                                                    { label: "MWh", value: "mwh" },
                                                ]}
                                                value={marketForm.uncoveredElectricityUnit}
                                                onChange={(val) => handleMarketChange("uncoveredElectricityUnit", val)}
                                                placeholder="Unit"
                                                className="w-[110px]"
                                            />
                                        </div>
                                        <p className="mt-1 text-[11px] text-on-surface-variant">
                                            Electricity consumed from standard grid not covered under PPA/REC contract.
                                        </p>
                                    </div>

                                    {/* Auto Calculated Summary Preview */}
                                    {calculatedMarketMetrics && (
                                        <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 flex flex-col justify-between">
                                            <div className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center justify-between">
                                                <span>Total Allocation Calculation</span>
                                                <MaterialIcon name="calculate" size="xs" />
                                            </div>
                                            <div className="mt-2 space-y-1 text-xs text-on-surface">
                                                <div className="flex justify-between">
                                                    <span className="text-on-surface-variant">Total Quantity:</span>
                                                    <span className="font-semibold text-primary">
                                                        {calculatedMarketMetrics.totalKwh.toLocaleString()} kWh ({calculatedMarketMetrics.totalMwh.toFixed(2)} MWh)
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-on-surface-variant">Est. Contract Emissions:</span>
                                                    <span className="font-medium text-secondary">
                                                        {calculatedMarketMetrics.contractedEmissionsTons.toFixed(2)} tCO₂e
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-on-surface-variant">Est. Uncovered Emissions:</span>
                                                    <span className="font-medium text-on-surface">
                                                        {calculatedMarketMetrics.uncoveredEmissionsTons.toFixed(2)} tCO₂e
                                                    </span>
                                                </div>
                                                {marketForm.includePurchasedEnergy && (
                                                    <div className="flex justify-between">
                                                        <span className="text-on-surface-variant">Est. Purchased Energy:</span>
                                                        <span className="font-medium text-on-surface">
                                                            {calculatedMarketMetrics.purchasedEmissionsTons.toFixed(2)} tCO₂e
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="border-t border-secondary/20 pt-1.5 flex justify-between font-bold text-primary text-sm">
                                                    <span>Est. Total Market Emissions:</span>
                                                    <span>{calculatedMarketMetrics.totalEmissionsTons.toFixed(2)} tCO₂e</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Optional Market Certificate Audit Trail Collapsible */}
                        <div className="border-t border-outline-variant px-card-padding py-4">
                            <button
                                type="button"
                                onClick={() => handleMarketChange("showCertificateDetails", !marketForm.showCertificateDetails)}
                                className="flex items-center justify-between w-full text-left font-semibold text-primary hover:text-secondary transition-colors">
                                <div className="flex items-center gap-2 text-body-md">
                                    <MaterialIcon name="card_membership" size="sm" className="text-secondary" />
                                    Certificate & Compliance Audit Trail Details (REC / I-REC Optional)
                                </div>
                                <MaterialIcon
                                    name={marketForm.showCertificateDetails ? "expand_less" : "expand_more"}
                                    size="sm"
                                />
                            </button>

                            {marketForm.showCertificateDetails && (
                                <div className="mt-4 grid gap-4 sm:grid-cols-2 pt-2 border-t border-outline-variant/50">
                                    <div id="form-field-certSerialNumber">
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Certificate Serial Number
                                        </label>
                                        <Input
                                            type="text"
                                            value={marketForm.certSerialNumber}
                                            onChange={(e) => handleMarketChange("certSerialNumber", e.target.value)}
                                            className={formFieldClass()}
                                            placeholder="e.g. REC-2026-887941-US"
                                        />
                                    </div>
                                    <div id="form-field-certReference">
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Public Reference / Registry ID
                                        </label>
                                        <Input
                                            type="text"
                                            value={marketForm.certReference}
                                            onChange={(e) => handleMarketChange("certReference", e.target.value)}
                                            className={formFieldClass()}
                                            placeholder="e.g. M-RECS Registry Ref #4092"
                                        />
                                    </div>
                                    <div id="form-field-certDateAcquired">
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Date Acquired
                                        </label>
                                        <Input
                                            type="date"
                                            value={marketForm.certDateAcquired}
                                            onChange={(e) => handleMarketChange("certDateAcquired", e.target.value)}
                                            className={formFieldClass()}
                                        />
                                    </div>
                                    <div id="form-field-certExpirationDate">
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Expiration Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={marketForm.certExpirationDate}
                                            onChange={(e) => handleMarketChange("certExpirationDate", e.target.value)}
                                            className={formFieldClass()}
                                        />
                                    </div>
                                    <div id="form-field-certQuantity">
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Certificate Volume / Quantity
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={marketForm.certQuantity}
                                            onChange={(e) => handleMarketChange("certQuantity", e.target.value)}
                                            className={formFieldClass()}
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 pt-6">
                                        <input
                                            type="checkbox"
                                            id="certIsRenewable"
                                            checked={marketForm.certIsRenewable}
                                            onChange={(e) => handleMarketChange("certIsRenewable", e.target.checked)}
                                            className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="certIsRenewable" className="text-sm text-on-surface font-medium cursor-pointer">
                                            Is Certified Renewable Instrument
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Optional Purchased Energy Toggle Section */}
                        <div className="border-t border-outline-variant px-card-padding py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="includePurchasedEnergy"
                                        checked={marketForm.includePurchasedEnergy}
                                        onChange={(e) => handleMarketChange("includePurchasedEnergy", e.target.checked)}
                                        className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                                    />
                                    <div>
                                        <label htmlFor="includePurchasedEnergy" className="text-body-md font-semibold text-primary cursor-pointer">
                                            Include Purchased Energy (Steam, Heating, Cooling)
                                        </label>
                                        <p className="text-xs text-on-surface-variant">
                                            Track district heating, cooling or steam consumed alongside facility market electricity.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {marketForm.includePurchasedEnergy && (
                                <div className="mt-4 p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                                            Purchased Thermal Energy Quantities & Emission Factors
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-on-surface-variant">Energy Unit:</span>
                                            <CustomSelect
                                                options={[
                                                    { label: "GJ", value: "gj" },
                                                    { label: "MJ", value: "mj" },
                                                ]}
                                                value={marketForm.purchasedEnergyUnit}
                                                onChange={(val) => handleMarketChange("purchasedEnergyUnit", val)}
                                                placeholder="Unit"
                                                className="w-[100px]"
                                            />
                                            <span className="text-xs text-on-surface-variant ml-2">EF Unit:</span>
                                            <CustomSelect
                                                options={purchasedEnergyEfUnitOptions}
                                                value={marketForm.purchasedEnergyEfUnit}
                                                onChange={(val) => handleMarketChange("purchasedEnergyEfUnit", val)}
                                                placeholder="EF Unit"
                                                className="w-[150px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        {/* Steam */}
                                        <div id="form-field-steam" className="space-y-2 p-3 bg-white rounded-lg border border-outline-variant">
                                            <span className="font-semibold text-xs text-primary block">Purchased Steam</span>
                                            <div>
                                                <label className="text-[11px] text-on-surface-variant block mb-1">Consumption ({marketForm.purchasedEnergyUnit.toUpperCase()})</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={marketForm.steam}
                                                    onChange={(e) => handleMarketChange("steam", e.target.value)}
                                                    className={formFieldClass()}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] text-on-surface-variant block mb-1">Emission Factor</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={marketForm.steamEmissionFactor}
                                                    onChange={(e) => handleMarketChange("steamEmissionFactor", e.target.value)}
                                                    className={formFieldClass()}
                                                    placeholder="e.g. 60.0"
                                                />
                                            </div>
                                        </div>

                                        {/* Heating */}
                                        <div id="form-field-heating" className="space-y-2 p-3 bg-white rounded-lg border border-outline-variant">
                                            <span className="font-semibold text-xs text-primary block">Purchased Heating</span>
                                            <div>
                                                <label className="text-[11px] text-on-surface-variant block mb-1">Consumption ({marketForm.purchasedEnergyUnit.toUpperCase()})</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={marketForm.heating}
                                                    onChange={(e) => handleMarketChange("heating", e.target.value)}
                                                    className={formFieldClass()}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] text-on-surface-variant block mb-1">Emission Factor</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={marketForm.heatingEmissionFactor}
                                                    onChange={(e) => handleMarketChange("heatingEmissionFactor", e.target.value)}
                                                    className={formFieldClass()}
                                                    placeholder="e.g. 55.0"
                                                />
                                            </div>
                                        </div>

                                        {/* Cooling */}
                                        <div id="form-field-cooling" className="space-y-2 p-3 bg-white rounded-lg border border-outline-variant">
                                            <span className="font-semibold text-xs text-primary block">Purchased Cooling</span>
                                            <div>
                                                <label className="text-[11px] text-on-surface-variant block mb-1">Consumption ({marketForm.purchasedEnergyUnit.toUpperCase()})</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={marketForm.cooling}
                                                    onChange={(e) => handleMarketChange("cooling", e.target.value)}
                                                    className={formFieldClass()}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] text-on-surface-variant block mb-1">Emission Factor</label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={marketForm.coolingEmissionFactor}
                                                    onChange={(e) => handleMarketChange("coolingEmissionFactor", e.target.value)}
                                                    className={formFieldClass()}
                                                    placeholder="e.g. 45.0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Common Notes Section */}
                <section className="bg-white rounded-xl border border-outline-variant p-card-padding">
                    <label id="form-field-notes" className="block font-label-md text-label-md text-on-surface-variant mb-2">
                        Notes & Clarifications
                    </label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        className="min-h-[100px] w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Add any clarifying remarks, contract reference numbers, or context..."
                    />
                </section>

                {/* Captive Fuel Details (If Location-based Captive FBC) */}
                {accountingMethod === "location_based" && form.electricityActivityType === "captive" && form.sourceType === "fbc" && (
                    <section className="bg-white rounded-xl border border-outline-variant relative">
                        <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                    <MaterialIcon name="local_gas_station" size="sm" />
                                </div>
                                <div>
                                    <h2 className="text-headline-sm font-semibold text-primary">Captive Generation Fuel Details</h2>
                                    <p className="text-xs text-on-surface-variant">
                                        Specify fuel consumption, emission standard source, and cost details for FBC captive power.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-card-padding space-y-6">
                            <div id="form-field-fuelSource">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Emission Standard / Source <span className="text-error">*</span>
                                </label>
                                <CustomSelect
                                    options={
                                        fuelEmissionSourcesQuery.data?.map((s: { id: string; standard: string; version?: string }) => ({
                                            label: s.version ? `${s.standard} (${s.version})` : s.standard,
                                            value: String(s.id),
                                        })) || []
                                    }
                                    value={fuelForm.source}
                                    onChange={(val) => handleFuelChange("source", val)}
                                    error={Boolean(errors.fuelSource)}
                                    placeholder={fuelEmissionSourcesQuery.isLoading ? "Loading sources..." : "Select source..."}
                                    isLoading={fuelEmissionSourcesQuery.isLoading}
                                />
                                {errors.fuelSource && <p className="mt-2 text-xs text-error">{errors.fuelSource}</p>}
                            </div>

                            <CustomFuelSection
                                sourceId={fuelForm.source}
                                emissionType={fuelForm.emissionType}
                                fuelCategory={fuelForm.fuelCategory}
                                fuelType={fuelForm.fuelType}
                                quantity={fuelForm.quantity}
                                cost={fuelForm.cost}
                                unit={fuelForm.unit}
                                selectedCustomFuelId={fuelForm.customFuelId}
                                onFieldChange={handleFuelChange}
                                onCustomFuelSelect={(customFuelId) => {
                                    setFuelForm((prev) => ({
                                        ...prev,
                                        customFuelId,
                                        fuelType: customFuelId ? "" : prev.fuelType,
                                        unit: "",
                                    }));
                                    setErrors((prev) => ({ ...prev, fuelType: "", customFuelId: "" }));
                                }}
                                errors={errors}
                            />
                        </div>
                    </section>
                )}

                {/* Supporting Documents Section */}
                <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="attach_file" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">
                                    Attach Supporting Evidence
                                </h2>
                                <p className="text-xs text-on-surface-variant">
                                    Upload PPA contract, REC certificate, utility invoice, or audit reports.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-card-padding">
                        <ActivityDocumentsManager
                            documents={documents}
                            onChange={setDocuments}
                            errors={errors}
                        />
                    </div>
                </section>

                <footer className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
                    <button
                        type="button"
                        onClick={() => router.push("/activities/electricity")}
                        className="px-8 py-3 rounded-lg font-label-md text-label-md border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-10 py-3 rounded-lg font-label-md text-label-md bg-secondary text-on-secondary hover:opacity-90 shadow-md transition-all active:scale-[0.98]"
                        disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Activity"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
