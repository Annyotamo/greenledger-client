"use client";

import type { FormEvent } from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, isAfter, parse, isValid, startOfDay } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useFacilities } from "@/lib/facility/hooks";
import { useEmissionSources } from "@/lib/emissionSource/hooks";
import type { MarketInstrumentType } from "@/lib/activity/electricityTypes";
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

const activityTypeOptions = [
    { label: "Grid Import (Scope 2 Dual Accounting)", value: "grid_import" },
    { label: "Renewable (Onsite Solar, Wind, Hydro)", value: "renewable" },
    { label: "Captive Generation (WHRB, FBC)", value: "captive" },
    { label: "Other Generation (Waste Fuel)", value: "other" },
];

const sourceTypesByActivity: Record<string, { label: string; value: string }[]> = {
    grid_import: [{ label: "National Grid", value: "national_grid" }],
    renewable: [
        { label: "Solar", value: "solar" },
        { label: "Hydro", value: "hydro" },
        { label: "Wind", value: "wind" },
    ],
    captive: [
        { label: "Captive Solar", value: "captive_solar" },
        { label: "WHRB (Waste Heat Recovery)", value: "whrb" },
        { label: "FBC (Fluidized Bed Combustion)", value: "fbc" },
    ],
    other: [{ label: "Waste Fuel", value: "waste_fuel" }],
};

const marketInstrumentTypeOptions: { label: string; value: MarketInstrumentType; description: string }[] = [
    {
        label: "Renewable PPA (Power Purchase Agreement)",
        value: "renewable_ppa",
        description: "Direct contractual off-take from dedicated off-site solar/wind installations (0.0 tCO₂e/MWh).",
    },
    {
        label: "Non-Renewable PPA",
        value: "non_renewable_ppa",
        description: "Bilateral power agreement with supplier-specific thermal or conventional factor.",
    },
    {
        label: "REC (Renewable Energy Certificate)",
        value: "rec",
        description: "Unbundled or bundled market environmental attribute certificates.",
    },
    {
        label: "I-REC (International REC)",
        value: "irec",
        description: "Standardized international renewable energy certificate tracking.",
    },
    {
        label: "Green Tariff / Green Power Program",
        value: "green_tariff",
        description: "Utility-offered certified green energy rider or tariff program.",
    },
];

const emissionFactorUnitOptions = [
    { label: "tCO₂ / MWh", value: "tco2_per_mwh" },
    { label: "kgCO₂ / MWh", value: "kgco2_per_mwh" },
    { label: "tCO₂ / kWh", value: "tco2_per_kwh" },
    { label: "kgCO₂ / kWh", value: "kgco2_per_kwh" },
];

const purchasedEnergyEfUnitOptions = [
    { label: "kgCO₂ / GJ", value: "kgco2_per_gj" },
    { label: "tCO₂ / GJ", value: "tco2_per_gj" },
    { label: "kgCO₂ / MJ", value: "kgco2_per_mj" },
    { label: "tCO₂ / MJ", value: "tco2_per_mj" },
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
    const router = useRouter();

    const [form, setForm] = useState({
        reportingPeriod: "",
        facility: "",
        source: "",
        electricityKwh: "",
        electricityUnit: "kwh",
        electricityActivityType: "grid_import",
        sourceType: "national_grid",
        supplierName: "",
        dataQualityTier: "measured",
        activityStartDate: "",
        activityEndDate: "",
        notes: "",
        // Scope 2 Market Instrument toggle
        hasMarketInstrument: false,
        marketInstrumentType: "renewable_ppa" as MarketInstrumentType,
    });

    const [marketForm, setMarketForm] = useState({
        contractedElectricityKwh: "",
        contractedElectricityUnit: "kwh",
        contractedEmissionFactor: "",
        contractedEmissionFactorUnit: "tco2_per_mwh",
        uncoveredElectricityKwh: "",
        uncoveredElectricityUnit: "kwh",
        // Market Certificate Audit Trail (Optional)
        showCertificateDetails: true,
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

    const reportingPeriodsQuery = useReportingPeriods();
    const facilitiesQuery = useFacilities();
    const emissionSourcesQuery = useEmissionSources("electricity");
    const fuelEmissionSourcesQuery = useEmissionSources("fuel");
    const customFuelUnitsQuery = useCustomFuelUnits(Boolean(fuelForm.customFuelId));

    useEffect(() => {
        if (emissionSourcesQuery.data && emissionSourcesQuery.data.length > 0) {
            const ceaSource = emissionSourcesQuery.data.find(
                (s: { standard: string; id: string }) =>
                    s.standard.toLowerCase().includes("cea") ||
                    s.standard.toLowerCase().includes("central electricity authority") ||
                    s.standard.toLowerCase().includes("egrid")
            );
            if (ceaSource && !form.source) {
                setForm((current) => ({ ...current, source: String(ceaSource.id) }));
            }
        }
    }, [emissionSourcesQuery.data, form.source]);

    useEffect(() => {
        if (!fuelForm.source && fuelEmissionSourcesQuery.data && fuelEmissionSourcesQuery.data.length > 0) {
            setFuelForm((current) => ({ ...current, source: String(fuelEmissionSourcesQuery.data[0].id) }));
        }
    }, [fuelForm.source, fuelEmissionSourcesQuery.data]);

    const certificateDateStatus = useMemo(() => {
        const isRenewable = ["renewable_ppa", "rec", "irec", "green_tariff"].includes(form.marketInstrumentType) || marketForm.certIsRenewable;
        if (!form.hasMarketInstrument || !isRenewable) {
            return { isValid: true, isExpired: false, message: "" };
        }

        if (!marketForm.certDateAcquired && !marketForm.certExpirationDate) {
            return {
                isValid: false,
                isExpired: false,
                message: "Certificate dates are required to verify 0.0 contractual factor.",
            };
        }

        if (!marketForm.certDateAcquired || !marketForm.certExpirationDate) {
            return {
                isValid: false,
                isExpired: false,
                message: "Both Date Acquired and Expiration Date are required.",
            };
        }

        const acquired = parse(marketForm.certDateAcquired, "yyyy-MM-dd", new Date());
        const expiration = parse(marketForm.certExpirationDate, "yyyy-MM-dd", new Date());

        if (!isValid(acquired) || !isValid(expiration)) {
            return { isValid: false, isExpired: false, message: "Invalid certificate date format." };
        }

        if (expiration < acquired) {
            return {
                isValid: false,
                isExpired: true,
                message: "Certificate expiration date cannot be earlier than acquisition date.",
            };
        }

        const today = startOfDay(new Date());
        if (expiration < today) {
            return {
                isValid: false,
                isExpired: true,
                message: `Certificate expired on ${format(expiration, "PPP")}. You need to renew your certificate.`,
            };
        }

        if (form.activityEndDate) {
            const activityEnd = parse(form.activityEndDate, "yyyy-MM-dd", new Date());
            if (isValid(activityEnd) && expiration < activityEnd) {
                return {
                    isValid: false,
                    isExpired: true,
                    message: `Certificate expired on ${format(expiration, "PPP")}, which is prior to the activity end date (${format(activityEnd, "PPP")}). You need to renew your certificate.`,
                };
            }
        } else if (form.activityStartDate) {
            const activityStart = parse(form.activityStartDate, "yyyy-MM-dd", new Date());
            if (isValid(activityStart) && expiration < activityStart) {
                return {
                    isValid: false,
                    isExpired: true,
                    message: `Certificate expired on ${format(expiration, "PPP")}, which is prior to the activity start date (${format(activityStart, "PPP")}). You need to renew your certificate.`,
                };
            }
        }

        return { isValid: true, isExpired: false, message: "" };
    }, [form.hasMarketInstrument, form.marketInstrumentType, form.activityStartDate, form.activityEndDate, marketForm.certDateAcquired, marketForm.certExpirationDate, marketForm.certIsRenewable]);

    const isCertificateDateRangeValid = certificateDateStatus.isValid;

    useEffect(() => {
        if (form.electricityActivityType === "grid_import" && form.hasMarketInstrument) {
            const isRenewable = ["renewable_ppa", "rec", "irec", "green_tariff"].includes(form.marketInstrumentType) || marketForm.certIsRenewable;

            if (isCertificateDateRangeValid && isRenewable) {
                setMarketForm((current) => {
                    if (current.contractedEmissionFactor !== "0.0") {
                        return { ...current, contractedEmissionFactor: "0.0" };
                    }
                    return current;
                });
            } else {
                setMarketForm((current) => {
                    if (current.contractedEmissionFactor === "0.0") {
                        return { ...current, contractedEmissionFactor: "" };
                    }
                    return current;
                });
            }
        }
    }, [isCertificateDateRangeValid, form.electricityActivityType, form.hasMarketInstrument, form.marketInstrumentType, marketForm.certIsRenewable]);

    function handleChange(field: string, value: string | boolean) {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleMarketChange(field: string, value: string | boolean | number) {
        setMarketForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: "" }));
    }

    function handleActivityTypeChange(value: string) {
        const availableSources = sourceTypesByActivity[value] || [];
        const defaultSource = availableSources[0]?.value || "";
        setForm((current) => ({
            ...current,
            electricityActivityType: value,
            sourceType: defaultSource,
            hasMarketInstrument: value === "grid_import" ? current.hasMarketInstrument : false,
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
    }

    function handleMarketInstrumentTypeChange(value: MarketInstrumentType) {
        setForm((current) => ({ ...current, marketInstrumentType: value }));
        setErrors((current) => ({ ...current, marketInstrumentType: "" }));

        const isRenewable = ["renewable_ppa", "rec", "irec", "green_tariff"].includes(value);
        if (isRenewable && isCertificateDateRangeValid) {
            setMarketForm((current) => ({ ...current, contractedEmissionFactor: "0.0" }));
        } else if (marketForm.contractedEmissionFactor === "0.0") {
            setMarketForm((current) => ({ ...current, contractedEmissionFactor: "" }));
        }
    }

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

    // Live Dual Scope 2 Real-Time Calculator Metrics
    const calculatedDualMetrics = useMemo(() => {
        if (form.electricityActivityType !== "grid_import") return null;

        const rawAmount = Number(form.electricityKwh) || 0;
        const totalKwh = form.electricityUnit === "mwh" ? rawAmount * 1000 : rawAmount;
        const totalMwh = totalKwh / 1000;

        // Default Location Grid EF ~0.71 tCO2e/MWh (or 710 kg/MWh)
        const gridEfTonsPerMwh = 0.71;
        const locationEmissionsTons = totalMwh * gridEfTonsPerMwh;

        if (!form.hasMarketInstrument) {
            return {
                isGridImport: true,
                hasMarketInstrument: false,
                totalKwh,
                totalMwh,
                locationEmissionsTons,
                marketEmissionsTons: locationEmissionsTons, // Scope 2 Guidance: defaults to location value
                netReductionTons: 0,
                netReductionPercent: 0,
            };
        }

        const contractedKwh = marketForm.contractedElectricityUnit === "mwh"
            ? (Number(marketForm.contractedElectricityKwh) || 0) * 1000
            : (Number(marketForm.contractedElectricityKwh) || 0);

        const uncoveredKwh = marketForm.uncoveredElectricityKwh
            ? (marketForm.uncoveredElectricityUnit === "mwh"
                ? (Number(marketForm.uncoveredElectricityKwh) || 0) * 1000
                : (Number(marketForm.uncoveredElectricityKwh) || 0))
            : Math.max(0, totalKwh - contractedKwh);

        const isZeroEf = ["renewable_ppa", "rec", "irec", "green_tariff"].includes(form.marketInstrumentType) && isCertificateDateRangeValid;
        const contractedEf = isZeroEf ? 0 : (Number(marketForm.contractedEmissionFactor) || 0);

        let contractedEfInMwh = contractedEf;
        if (marketForm.contractedEmissionFactorUnit === "kgco2_per_mwh") contractedEfInMwh = contractedEf / 1000;
        if (marketForm.contractedEmissionFactorUnit === "tco2_per_kwh") contractedEfInMwh = contractedEf * 1000;
        if (marketForm.contractedEmissionFactorUnit === "kgco2_per_kwh") contractedEfInMwh = contractedEf;

        const contractedEmissionsTons = (contractedKwh / 1000) * contractedEfInMwh;
        const uncoveredEmissionsTons = (uncoveredKwh / 1000) * gridEfTonsPerMwh;

        let purchasedEmissionsTons = 0;
        if (marketForm.includePurchasedEnergy) {
            const mult = marketForm.purchasedEnergyUnit === "mj" ? 1 / 1000 : 1;
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

        const marketEmissionsTons = contractedEmissionsTons + uncoveredEmissionsTons + purchasedEmissionsTons;
        const netReductionTons = Math.max(0, locationEmissionsTons - marketEmissionsTons);
        const netReductionPercent = locationEmissionsTons > 0 ? (netReductionTons / locationEmissionsTons) * 100 : 0;

        return {
            isGridImport: true,
            hasMarketInstrument: true,
            totalKwh,
            totalMwh,
            contractedKwh,
            uncoveredKwh,
            contractedEmissionsTons,
            uncoveredEmissionsTons,
            purchasedEmissionsTons,
            locationEmissionsTons,
            marketEmissionsTons,
            netReductionTons,
            netReductionPercent,
            isZeroEf,
        };
    }, [form.electricityActivityType, form.electricityKwh, form.electricityUnit, form.hasMarketInstrument, form.marketInstrumentType, marketForm]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};

        if (!form.reportingPeriod) nextErrors.reportingPeriod = "Reporting period is required.";
        if (!form.facility) nextErrors.facility = "Facility is required.";
        if (!form.activityStartDate) nextErrors.activityStartDate = "Start date is required.";
        if (!form.activityEndDate) nextErrors.activityEndDate = "End date is required.";
        if (!form.dataQualityTier) nextErrors.dataQualityTier = "Data quality is required.";
        if (!form.electricityActivityType) nextErrors.electricityActivityType = "Activity type is required.";
        if (!form.sourceType) nextErrors.sourceType = "Source type is required.";

        if (!form.electricityKwh || Number(form.electricityKwh) <= 0) {
            nextErrors.electricityKwh = "Electricity quantity is required and must be greater than 0.";
        }

        // Market-based instrument validation
        if (form.electricityActivityType === "grid_import" && form.hasMarketInstrument) {
            if (!marketForm.contractedElectricityKwh || Number(marketForm.contractedElectricityKwh) <= 0) {
                nextErrors.contractedElectricityKwh = "Contracted electricity amount is required when market instrument is active.";
            }

            const isRenewable = ["renewable_ppa", "rec", "irec", "green_tariff"].includes(form.marketInstrumentType);
            if (isRenewable) {
                if (!isCertificateDateRangeValid) {
                    if (!marketForm.certDateAcquired) {
                        nextErrors.certDateAcquired = "Date acquired is required for renewable validation.";
                    }
                    if (!marketForm.certExpirationDate) {
                        nextErrors.certExpirationDate = "Expiration date is required for renewable validation.";
                    }
                    if (marketForm.certDateAcquired && marketForm.certExpirationDate && !isCertificateDateRangeValid) {
                        nextErrors.certExpirationDate = "Expiration date must be on or after acquired date.";
                    }
                }
            } else {
                if (marketForm.contractedEmissionFactor === "" || isNaN(Number(marketForm.contractedEmissionFactor))) {
                    nextErrors.contractedEmissionFactor = "Contracted emission factor is required for conventional contracts.";
                }
            }
        }

        // Captive FBC fuel validation
        if (form.electricityActivityType === "captive" && form.sourceType === "fbc") {
            if (!fuelForm.source) nextErrors.fuelSource = "Emission standard / source is required for captive FBC fuel.";
            if (!fuelForm.customFuelId && !fuelForm.fuelType) {
                nextErrors.fuelType = "Fuel type or Custom Fuel is required.";
            }
            if (!fuelForm.quantity) nextErrors.quantity = "Fuel quantity is required.";
            if (!fuelForm.unit) nextErrors.unit = "Fuel unit is required.";
            if (!fuelForm.emissionType) nextErrors.emissionType = "Emission Type is required.";
            if (fuelForm.emissionType !== "fugitive" && !fuelForm.cost) {
                nextErrors.cost = "Price / Cost is required.";
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
            const amount = Number(form.electricityKwh);
            const unit = form.electricityUnit?.toLowerCase();
            const totalKwh = unit === "mwh" ? amount * 1000 : amount;
            const totalMwh = unit === "kwh" ? amount / 1000 : amount;

            const isGridImport = form.electricityActivityType === "grid_import";

            const payload: Record<string, unknown> = {
                facility_id: form.facility,
                reporting_period_id: form.reportingPeriod,
                activity_start_date: form.activityStartDate,
                activity_end_date: form.activityEndDate,
                electricity_activity_type: form.electricityActivityType,
                source_type: form.sourceType,
                electricity_kwh: totalKwh,
                electricity_mwh: totalMwh,
                data_quality_tier: form.dataQualityTier,
                supplier_name: form.supplierName || undefined,
                notes: form.notes || undefined,
                source_id: form.source || undefined,
                has_market_instrument: isGridImport ? form.hasMarketInstrument : false,
                market_instrument_type: isGridImport && form.hasMarketInstrument ? form.marketInstrumentType : null,
            };

            if (isGridImport && form.hasMarketInstrument) {
                const contractedKwh = marketForm.contractedElectricityUnit === "mwh"
                    ? Number(marketForm.contractedElectricityKwh) * 1000
                    : Number(marketForm.contractedElectricityKwh);

                const uncoveredKwh = marketForm.uncoveredElectricityKwh
                    ? (marketForm.uncoveredElectricityUnit === "mwh"
                        ? Number(marketForm.uncoveredElectricityKwh) * 1000
                        : Number(marketForm.uncoveredElectricityKwh))
                    : Math.max(0, totalKwh - contractedKwh);

                const isZeroEf = ["renewable_ppa", "rec", "irec", "green_tariff"].includes(form.marketInstrumentType) && isCertificateDateRangeValid;
                const contractedEf = isZeroEf ? 0.0 : Number(marketForm.contractedEmissionFactor || 0);

                payload.market_allocation = {
                    contracted_electricity_kwh: contractedKwh,
                    contracted_emission_factor: contractedEf,
                    contracted_emission_factor_unit: marketForm.contractedEmissionFactorUnit,
                    uncovered_electricity_kwh: uncoveredKwh,
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
            if (form.electricityActivityType === "captive" && form.sourceType === "fbc") {
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
                        if (kgUnit && String(fuelForm.unit) === String(kgUnit.id) && finalQuantity !== null) {
                            finalQuantity = finalQuantity / 1000;
                        }
                        finalUnitId = String(tonneUnit.id);
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
                    electricity_activity_id: activityId,
                    document_type: doc.documentType,
                    document_name: doc.documentName,
                    source_url: sourceUrl || undefined,
                    notes: doc.notes || null,
                    document_date: doc.documentDate || null,
                });

                if (form.electricityActivityType === "captive" && form.sourceType === "fbc" && fuelActivityId) {
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
            const message = getErrorMessage(err, "Failed to submit electricity activity. Please try again.");
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

    const isGridImport = form.electricityActivityType === "grid_import";
    const availableSources = sourceTypesByActivity[form.electricityActivityType] || [];

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
                    Single-record Scope 2 Dual Accounting: capture Location-Based and Market-Based emissions simultaneously across grid imports and on-site generation.
                </p>
            </header>

            <FormErrorSummary errors={errors} />

            <form id="logElectricityForm" onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Activity Context Section */}
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="schedule" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">Activity Context</h2>
                                <p className="text-xs text-on-surface-variant">
                                    Select reporting period, facility, and duration of the energy consumption.
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

                {/* 2. Electricity Activity Details */}
                <section className="bg-white rounded-xl border border-outline-variant relative">
                    <div className="px-card-padding py-4 bg-surface-container-low border-b border-outline-variant rounded-t-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                                <MaterialIcon name="bolt" size="sm" />
                            </div>
                            <div>
                                <h2 className="text-headline-sm font-semibold text-primary">Electricity Details</h2>
                                <p className="text-xs text-on-surface-variant">
                                    Specify consumption volume, activity generation type, and supplier utility.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-card-padding grid gap-4 lg:grid-cols-2">
                        {/* Activity Type */}
                        <div id="form-field-electricityActivityType">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Activity Type <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={activityTypeOptions}
                                value={form.electricityActivityType}
                                onChange={handleActivityTypeChange}
                                error={Boolean(errors.electricityActivityType)}
                                placeholder="Select type..."
                            />
                            {errors.electricityActivityType && (
                                <p className="mt-2 text-xs text-error">{errors.electricityActivityType}</p>
                            )}
                        </div>

                        {/* Source Type */}
                        <div id="form-field-sourceType">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Generation / Grid Source <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={availableSources}
                                value={form.sourceType}
                                onChange={handleSourceTypeChange}
                                error={Boolean(errors.sourceType)}
                                placeholder="Select source..."
                            />
                            {errors.sourceType && <p className="mt-2 text-xs text-error">{errors.sourceType}</p>}
                        </div>

                        {/* Electricity Volume */}
                        <div id="form-field-electricityKwh">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Electricity Volume <span className="text-error">*</span>
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

                        {/* Supplier Name */}
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

                        {/* Data Quality Tier */}
                        <div id="form-field-dataQualityTier">
                            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                Data Quality Tier <span className="text-error">*</span>
                            </label>
                            <CustomSelect
                                options={[
                                    { label: "Measured (Metered Invoices)", value: "measured" },
                                    { label: "Estimated (Pro-rated / Benchmarked)", value: "estimated" },
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

                        {/* Emission Source Factor Standard (For Grid Imports) */}
                        {isGridImport && (
                            <div id="form-field-source">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Location Grid Factor Dataset
                                </label>
                                <CustomSelect
                                    options={
                                        emissionSourcesQuery.data?.map((s: { id: string; standard: string; version?: string; region?: string }) => ({
                                            label: s.region ? `${s.standard} (${s.region})` : s.standard,
                                            value: String(s.id),
                                        })) || []
                                    }
                                    value={form.source}
                                    onChange={(val) => handleChange("source", val)}
                                    placeholder="Default Grid Average Factor..."
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. Scope 2 Dual Accounting & Market Instruments Section (Grid Import only) */}
                {isGridImport ? (
                    <section className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                        <div className="p-4 sm:p-5 bg-surface-container-low border-b border-outline-variant flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${form.hasMarketInstrument ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                                    <MaterialIcon name="verified" size="sm" />
                                </div>
                                <div>
                                    <h3 className="text-body-lg font-semibold text-primary">Apply Market-Based Contractual Instruments</h3>
                                    <p className="text-xs text-on-surface-variant">
                                        Enable if this grid consumption is covered under PPAs, RECs, I-RECs, or Green Power Tariffs.
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.hasMarketInstrument}
                                    onChange={(e) => handleChange("hasMarketInstrument", e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {form.hasMarketInstrument ? (
                            <div className="p-card-padding space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Market Instrument Type */}
                                    <div id="form-field-marketInstrumentType" className="sm:col-span-2">
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Contractual Instrument Type <span className="text-error">*</span>
                                        </label>
                                        <CustomSelect
                                            options={marketInstrumentTypeOptions.map((opt) => ({
                                                label: opt.label,
                                                value: opt.value,
                                            }))}
                                            value={form.marketInstrumentType}
                                            onChange={(val) => handleMarketInstrumentTypeChange(val as MarketInstrumentType)}
                                            error={Boolean(errors.marketInstrumentType)}
                                            placeholder="Select instrument type..."
                                        />
                                        {errors.marketInstrumentType && (
                                            <p className="mt-2 text-xs text-error">{errors.marketInstrumentType}</p>
                                        )}
                                    </div>

                                    {/* Certificate & Registry Audit Trail (Compact & under Contractual Instrument Type) */}
                                    <div className="sm:col-span-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-3.5 transition-all">
                                        <button
                                            type="button"
                                            onClick={() => handleMarketChange("showCertificateDetails", !marketForm.showCertificateDetails)}
                                            className="flex items-center justify-between w-full text-left font-medium text-primary hover:text-secondary transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2 text-label-md">
                                                <MaterialIcon name="card_membership" size="sm" className="text-secondary" />
                                                <span>Certificate & Registry Audit Trail (REC / I-REC Optional)</span>
                                                {isCertificateDateRangeValid ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                                                        <MaterialIcon name="verified" size="xs" />
                                                        0.0 EF Verified
                                                    </span>
                                                ) : certificateDateStatus.isExpired ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                                        <MaterialIcon name="warning" size="xs" />
                                                        Expired / Needs Renewal
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] text-on-surface-variant font-normal">
                                                        (Set valid acquired & expiration dates for 0.0 factor)
                                                    </span>
                                                )}
                                            </div>
                                            <MaterialIcon
                                                name={marketForm.showCertificateDetails ? "expand_less" : "expand_more"}
                                                size="sm"
                                                className="text-on-surface-variant"
                                            />
                                        </button>

                                        {marketForm.showCertificateDetails && (
                                            <div className="mt-3 grid gap-3 sm:grid-cols-2 pt-3 border-t border-outline-variant">
                                                <div id="form-field-certSerialNumber">
                                                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
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
                                                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
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
                                                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                                                        Date Acquired
                                                    </label>
                                                    <DatePicker
                                                        value={marketForm.certDateAcquired}
                                                        onChange={(dateStr) => {
                                                            handleMarketChange("certDateAcquired", dateStr);
                                                            if (errors.certDateAcquired) {
                                                                setErrors((cur) => ({ ...cur, certDateAcquired: "" }));
                                                            }
                                                        }}
                                                        placeholder="Select acquired date..."
                                                        error={Boolean(errors.certDateAcquired)}
                                                    />
                                                    {errors.certDateAcquired && (
                                                        <p className="mt-1 text-xs text-error">{errors.certDateAcquired}</p>
                                                    )}
                                                </div>

                                                <div id="form-field-certExpirationDate">
                                                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                                                        Expiration Date
                                                    </label>
                                                    <DatePicker
                                                        value={marketForm.certExpirationDate}
                                                        onChange={(dateStr) => {
                                                            handleMarketChange("certExpirationDate", dateStr);
                                                            if (errors.certExpirationDate) {
                                                                setErrors((cur) => ({ ...cur, certExpirationDate: "" }));
                                                            }
                                                        }}
                                                        placeholder="Select expiration date..."
                                                        error={Boolean(errors.certExpirationDate)}
                                                    />
                                                    {errors.certExpirationDate && (
                                                        <p className="mt-1 text-xs text-error">{errors.certExpirationDate}</p>
                                                    )}
                                                </div>

                                                <div id="form-field-certQuantity">
                                                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                                                        Certificate Quantity (MWh)
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

                                                <div className="flex items-center gap-2 pt-2 sm:pt-5">
                                                    <input
                                                        type="checkbox"
                                                        id="certIsRenewable"
                                                        checked={marketForm.certIsRenewable}
                                                        onChange={(e) => handleMarketChange("certIsRenewable", e.target.checked)}
                                                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                    <label htmlFor="certIsRenewable" className="text-xs sm:text-sm text-on-surface font-medium cursor-pointer">
                                                        Certified Renewable Instrument
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contracted Quantity */}
                                    <div id="form-field-contractedElectricityKwh" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Contracted Volume <span className="text-error">*</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                step="0.001"
                                                value={marketForm.contractedElectricityKwh}
                                                onChange={(e) => handleMarketChange("contractedElectricityKwh", e.target.value)}
                                                className={`${formFieldClass(Boolean(errors.contractedElectricityKwh))} flex-1`}
                                                placeholder="e.g. 40000"
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
                                    <div id="form-field-contractedEmissionFactor" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="font-label-md text-label-md text-on-surface-variant">
                                                Contract Emission Factor
                                            </label>
                                            {calculatedDualMetrics?.isZeroEf ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-0.5 text-[10px] font-semibold text-secondary">
                                                    <MaterialIcon name="verified" size="xs" />
                                                    0.0 Locked (Renewable)
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                step="0.0001"
                                                disabled={calculatedDualMetrics?.isZeroEf}
                                                value={calculatedDualMetrics?.isZeroEf ? "0.0" : marketForm.contractedEmissionFactor}
                                                onChange={(e) => handleMarketChange("contractedEmissionFactor", e.target.value)}
                                                className={`${formFieldClass(Boolean(errors.contractedEmissionFactor))} flex-1 ${
                                                    calculatedDualMetrics?.isZeroEf ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed" : ""
                                                }`}
                                                placeholder="0.00"
                                            />
                                            <CustomSelect
                                                options={emissionFactorUnitOptions}
                                                value={marketForm.contractedEmissionFactorUnit}
                                                onChange={(val) => handleMarketChange("contractedEmissionFactorUnit", val)}
                                                placeholder="Factor Unit"
                                                className="w-[150px]"
                                            />
                                        </div>

                                        {/* Notice / Warning below Contract Emission Factor */}
                                        {certificateDateStatus.isExpired ? (
                                            <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900">
                                                <MaterialIcon name="warning" size="xs" className="text-amber-600 mt-0.5 shrink-0" />
                                                <div className="leading-tight">
                                                    <span className="font-semibold text-amber-950">Certificate Expired: </span>
                                                    {certificateDateStatus.message}
                                                </div>
                                            </div>
                                        ) : !isCertificateDateRangeValid && ["renewable_ppa", "rec", "irec", "green_tariff"].includes(form.marketInstrumentType) ? (
                                            <p className="mt-2 text-[11px] text-on-surface-variant">
                                                Valid certificate acquisition & expiration dates covering the activity period are required to claim a 0.0 factor.
                                            </p>
                                        ) : null}

                                        {errors.contractedEmissionFactor && (
                                            <p className="mt-2 text-xs text-error">{errors.contractedEmissionFactor}</p>
                                        )}
                                    </div>

                                    {/* Uncovered Residual Grid Quantity */}
                                    <div id="form-field-uncoveredElectricityKwh" className="sm:col-span-2 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                            Uncovered Residual Grid Quantity (Optional)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                step="0.001"
                                                value={marketForm.uncoveredElectricityKwh}
                                                onChange={(e) => handleMarketChange("uncoveredElectricityKwh", e.target.value)}
                                                className={`${formFieldClass()} flex-1`}
                                                placeholder="Remaining uncovered volume (defaults to Total - Contracted)"
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

                                    </div>
                                </div>

                                {/* Optional Purchased Thermal Energy */}
                                <div className="border border-outline-variant rounded-xl p-4 bg-surface-container-lowest">
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
                                                    Include Purchased Thermal Energy (Steam, Heating, Cooling)
                                                </label>
                                                <p className="text-xs text-on-surface-variant">
                                                    Track district steam or heating/cooling alongside market power.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {marketForm.includePurchasedEnergy && (
                                        <div className="mt-4 pt-3 border-t border-outline-variant space-y-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-xs text-on-surface-variant font-medium">Thermal Quantities & Emission Factors</span>
                                                <div className="flex items-center gap-2">
                                                    <CustomSelect
                                                        options={[
                                                            { label: "GJ", value: "gj" },
                                                            { label: "MJ", value: "mj" },
                                                        ]}
                                                        value={marketForm.purchasedEnergyUnit}
                                                        onChange={(val) => handleMarketChange("purchasedEnergyUnit", val)}
                                                        placeholder="Unit"
                                                        className="w-[90px]"
                                                    />
                                                    <CustomSelect
                                                        options={purchasedEnergyEfUnitOptions}
                                                        value={marketForm.purchasedEnergyEfUnit}
                                                        onChange={(val) => handleMarketChange("purchasedEnergyEfUnit", val)}
                                                        placeholder="EF Unit"
                                                        className="w-[140px]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-3">
                                                <div className="p-3 bg-white rounded-lg border border-outline-variant space-y-2">
                                                    <span className="font-semibold text-xs text-primary block">Purchased Steam</span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={marketForm.steam}
                                                        onChange={(e) => handleMarketChange("steam", e.target.value)}
                                                        className={formFieldClass()}
                                                        placeholder="Quantity"
                                                    />
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={marketForm.steamEmissionFactor}
                                                        onChange={(e) => handleMarketChange("steamEmissionFactor", e.target.value)}
                                                        className={formFieldClass()}
                                                        placeholder="Emission Factor"
                                                    />
                                                </div>

                                                <div className="p-3 bg-white rounded-lg border border-outline-variant space-y-2">
                                                    <span className="font-semibold text-xs text-primary block">Purchased Heating</span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={marketForm.heating}
                                                        onChange={(e) => handleMarketChange("heating", e.target.value)}
                                                        className={formFieldClass()}
                                                        placeholder="Quantity"
                                                    />
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={marketForm.heatingEmissionFactor}
                                                        onChange={(e) => handleMarketChange("heatingEmissionFactor", e.target.value)}
                                                        className={formFieldClass()}
                                                        placeholder="Emission Factor"
                                                    />
                                                </div>

                                                <div className="p-3 bg-white rounded-lg border border-outline-variant space-y-2">
                                                    <span className="font-semibold text-xs text-primary block">Purchased Cooling</span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={marketForm.cooling}
                                                        onChange={(e) => handleMarketChange("cooling", e.target.value)}
                                                        className={formFieldClass()}
                                                        placeholder="Quantity"
                                                    />
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={marketForm.coolingEmissionFactor}
                                                        onChange={(e) => handleMarketChange("coolingEmissionFactor", e.target.value)}
                                                        className={formFieldClass()}
                                                        placeholder="Emission Factor"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 text-xs text-on-surface-variant bg-surface-container-low/50">
                                <p>
                                    Standard Grid Import active. The backend will compute both Location-Based and Market-Based Scope 2 emissions using the grid average factor as per GHG Protocol Scope 2 guidance.
                                </p>
                            </div>
                        )}

                        {/* Dual Scope 2 Real-Time Calculator Preview Banner */}
                        {calculatedDualMetrics && (
                            <div className="border-t border-outline-variant bg-surface-container-lowest p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                        <MaterialIcon name="calculate" size="xs" className="text-secondary" />
                                        Scope 2 Dual Reporting Real-Time Output Preview
                                    </h4>
                                    <span className="font-mono text-[11px] font-semibold text-on-surface-variant">
                                        {calculatedDualMetrics.totalMwh.toFixed(2)} MWh total
                                    </span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {/* Location-Based Box */}
                                    <div className="rounded-xl border border-sky-200 bg-sky-500/5 p-3.5 flex flex-col justify-between">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-sky-900 uppercase tracking-tight">Location-Based Scope 2</span>
                                            <span className="px-1.5 py-0.5 rounded bg-sky-500/10 font-mono text-[10px] font-bold text-sky-800">Grid Factor</span>
                                        </div>
                                        <div className="mt-2 flex items-baseline justify-between">
                                            <span className="text-2xl font-bold text-sky-950 font-mono">
                                                {calculatedDualMetrics.locationEmissionsTons.toFixed(2)}
                                            </span>
                                            <span className="text-xs font-semibold text-sky-700">tCO₂e</span>
                                        </div>
                                        <p className="mt-1 text-[10px] text-sky-700">
                                            Calculated from regional grid average emission factor.
                                        </p>
                                    </div>

                                    {/* Market-Based Box */}
                                    <div className="rounded-xl border border-purple-200 bg-purple-500/5 p-3.5 flex flex-col justify-between">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-purple-900 uppercase tracking-tight">Market-Based Scope 2</span>
                                            {calculatedDualMetrics.hasMarketInstrument ? (
                                                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 font-mono text-[10px] font-bold text-purple-800">
                                                    Contractual Instrument
                                                </span>
                                            ) : (
                                                <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-600">
                                                    Grid Default
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-baseline justify-between">
                                            <span className="text-2xl font-bold text-purple-950 font-mono">
                                                {calculatedDualMetrics.marketEmissionsTons.toFixed(2)}
                                            </span>
                                            <span className="text-xs font-semibold text-purple-700">tCO₂e</span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between text-[10px] text-purple-700">
                                            <span>Contracted: {calculatedDualMetrics.contractedEmissionsTons?.toFixed(2) ?? 0} tCO₂e</span>
                                            {calculatedDualMetrics.netReductionTons > 0 && (
                                                <span className="font-bold text-emerald-700">
                                                    -{calculatedDualMetrics.netReductionPercent.toFixed(1)}% savings
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                ) : (
                    /* Non-grid_import notice card */
                    <section className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                        <MaterialIcon name="info" size="sm" className="text-amber-700 mt-0.5 shrink-0" />
                        <div className="text-xs text-amber-900 space-y-1">
                            <p className="font-semibold text-amber-950">
                                On-site Energy Generation ({form.electricityActivityType.toUpperCase()})
                            </p>
                            <p>
                                Non-grid import activities do not produce Scope 2 grid emissions. Scope 2 location-based and market-based fields will return <span className="font-mono font-bold">null</span> in accordance with GHG Protocol single-record dual reporting architecture.
                            </p>
                        </div>
                    </section>
                )}

                {/* Captive FBC Fuel Details Section */}
                {form.electricityActivityType === "captive" && form.sourceType === "fbc" && (
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
                        {isSubmitting ? "Submitting..." : "Submit Electricity Activity"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
