"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    useCbamCategories,
    useCbamCountries,
    useCbamProductionRoutes,
} from "@/lib/cbam/hooks";
import type {
    CBAMBoundaryMode,
    CBAMInstallationGood,
    CBAMInstallationProfile,
    CBAMProductionProcess,
    CreateCBAMInstallationPayload,
} from "@/lib/cbam/types";

interface CBAMInstallationFormProps {
    initialData?: CBAMInstallationProfile | null;
    onSubmit: (payload: CreateCBAMInstallationPayload) => Promise<void>;
    isSubmitting?: boolean;
}

export function CBAMInstallationForm({
    initialData,
    onSubmit,
    isSubmitting = false,
}: CBAMInstallationFormProps) {
    const isEdit = Boolean(initialData?.id);
    const { data: categories = [] } = useCbamCategories();
    const { data: countries = [] } = useCbamCountries();

    // Section 1: Installation Metadata
    const [nameEnglish, setNameEnglish] = useState("");
    const [nameLocal, setNameLocal] = useState("");
    const [economicActivity, setEconomicActivity] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [postCode, setPostCode] = useState("");
    const [poBox, setPoBox] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("Poland");
    const [unlocode, setUnlocode] = useState("");
    const [latitude, setLatitude] = useState<string>("50.3485");
    const [longitude, setLongitude] = useState<string>("19.2741");

    // Section 2: Authorized Representative
    const [repName, setRepName] = useState("");
    const [repEmail, setRepEmail] = useState("");
    const [repPhone, setRepPhone] = useState("");

    // Section 3: Accredited Verifier
    const [verifierCompany, setVerifierCompany] = useState("");
    const [verifierStreet, setVerifierStreet] = useState("");
    const [verifierCity, setVerifierCity] = useState("");
    const [verifierPostCode, setVerifierPostCode] = useState("");
    const [verifierCountry, setVerifierCountry] = useState("Poland");
    const [verifierRepName, setVerifierRepName] = useState("");
    const [verifierRepEmail, setVerifierRepEmail] = useState("");
    const [verifierRepPhone, setVerifierRepPhone] = useState("");
    const [verifierRepFax, setVerifierRepFax] = useState("");
    const [verifierMemberState, setVerifierMemberState] = useState("Poland");
    const [verifierAccrBody, setVerifierAccrBody] = useState("");
    const [verifierAccrNum, setVerifierAccrNum] = useState("");

    // Section 4: Produced Goods G1..G10
    const [goods, setGoods] = useState<CBAMInstallationGood[]>([
        { slot_number: 1, category_id: "", production_routes: [] },
    ]);

    // Section 5: Production Processes P1..P10
    const [processes, setProcesses] = useState<CBAMProductionProcess[]>([
        {
            process_id: "P1",
            name: "Main Production Process",
            target_category_id: "",
            boundary_mode: "DIRECT",
            included_precursor_ids: [],
        },
    ]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setNameEnglish(initialData.installation_name_english || "");
            setNameLocal(initialData.installation_name_local || "");
            setEconomicActivity(initialData.economic_activity || "");
            setStreetNumber(initialData.street_number || "");
            setPostCode(initialData.post_code || "");
            setPoBox(initialData.po_box || "");
            setCity(initialData.city || "");
            setCountry(initialData.country || "Poland");
            setUnlocode(initialData.unlocode || "");
            setLatitude(String(initialData.latitude ?? 0));
            setLongitude(String(initialData.longitude ?? 0));

            setRepName(initialData.authorized_rep_name || "");
            setRepEmail(initialData.authorized_rep_email || "");
            setRepPhone(initialData.authorized_rep_telephone || "");

            setVerifierCompany(initialData.verifier_company_name || "");
            setVerifierStreet(initialData.verifier_street_number || "");
            setVerifierCity(initialData.verifier_city || "");
            setVerifierPostCode(initialData.verifier_post_code || "");
            setVerifierCountry(initialData.verifier_country || "Poland");
            setVerifierRepName(initialData.verifier_rep_name || "");
            setVerifierRepEmail(initialData.verifier_rep_email || "");
            setVerifierRepPhone(initialData.verifier_rep_telephone || "");
            setVerifierRepFax(initialData.verifier_rep_fax || "");
            setVerifierMemberState(initialData.verifier_accreditation_member_state || "Poland");
            setVerifierAccrBody(initialData.verifier_accreditation_body || "");
            setVerifierAccrNum(initialData.verifier_accreditation_number || "");

            if (initialData.goods && initialData.goods.length > 0) {
                setGoods(initialData.goods);
            }
            if (initialData.processes && initialData.processes.length > 0) {
                setProcesses(initialData.processes);
            }
        }
    }, [initialData]);

    function handleAddGood() {
        if (goods.length >= 10) return;
        setGoods((prev) => [
            ...prev,
            { slot_number: prev.length + 1, category_id: categories[0]?.id || "", production_routes: [] },
        ]);
    }

    function handleRemoveGood(index: number) {
        setGoods((prev) => prev.filter((_, i) => i !== index));
    }

    function handleGoodChange(index: number, updates: Partial<CBAMInstallationGood>) {
        setGoods((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], ...updates };
            return next;
        });
    }

    function handleAddProcess() {
        if (processes.length >= 10) return;
        const nextId = `P${processes.length + 1}`;
        setProcesses((prev) => [
            ...prev,
            {
                process_id: nextId,
                name: `Production Process ${processes.length + 1}`,
                target_category_id: categories[0]?.id || "",
                boundary_mode: "DIRECT",
                included_precursor_ids: [],
            },
        ]);
    }

    function handleRemoveProcess(index: number) {
        setProcesses((prev) => prev.filter((_, i) => i !== index));
    }

    function handleProcessChange(index: number, updates: Partial<CBAMProductionProcess>) {
        setProcesses((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], ...updates };
            return next;
        });
    }

    function validate(): boolean {
        const errs: Record<string, string> = {};

        if (!nameEnglish.trim()) errs.nameEnglish = "Installation English Name is required.";
        if (!city.trim()) errs.city = "City is required.";
        if (!country.trim()) errs.country = "Country is required.";
        if (!unlocode.trim()) errs.unlocode = "UNLOCODE is required.";

        const latNum = parseFloat(latitude);
        const lonNum = parseFloat(longitude);
        if (isNaN(latNum) || latNum < -90 || latNum > 90) errs.latitude = "Valid latitude (-90 to 90) required.";
        if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) errs.longitude = "Valid longitude (-180 to 180) required.";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        // Clean goods and processes
        const cleanGoods = goods
            .filter((g) => g.category_id)
            .map((g, idx) => ({
                slot_number: idx + 1,
                category_id: g.category_id,
                production_routes: g.production_routes || [],
            }));

        const cleanProcesses = processes
            .filter((p) => p.name.trim() && p.target_category_id)
            .map((p, idx) => ({
                process_id: p.process_id || `P${idx + 1}`,
                name: p.name.trim(),
                target_category_id: p.target_category_id,
                boundary_mode: p.boundary_mode,
                included_precursor_ids: p.boundary_mode === "DIRECT" ? [] : p.included_precursor_ids || [],
            }));

        const payload: CreateCBAMInstallationPayload = {
            installation_name_english: nameEnglish.trim(),
            installation_name_local: nameLocal.trim() || null,
            economic_activity: economicActivity.trim() || null,
            street_number: streetNumber.trim() || null,
            post_code: postCode.trim() || null,
            po_box: poBox.trim() || null,
            city: city.trim(),
            country: country.trim(),
            unlocode: unlocode.trim().toUpperCase(),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),

            authorized_rep_name: repName.trim() || null,
            authorized_rep_email: repEmail.trim() || null,
            authorized_rep_telephone: repPhone.trim() || null,

            verifier_company_name: verifierCompany.trim() || null,
            verifier_street_number: verifierStreet.trim() || null,
            verifier_city: verifierCity.trim() || null,
            verifier_post_code: verifierPostCode.trim() || null,
            verifier_country: verifierCountry.trim() || null,
            verifier_rep_name: verifierRepName.trim() || null,
            verifier_rep_email: verifierRepEmail.trim() || null,
            verifier_rep_telephone: verifierRepPhone.trim() || null,
            verifier_rep_fax: verifierRepFax.trim() || null,
            verifier_accreditation_member_state: verifierMemberState.trim() || null,
            verifier_accreditation_body: verifierAccrBody.trim() || null,
            verifier_accreditation_number: verifierAccrNum.trim() || null,

            goods: cleanGoods,
            processes: cleanProcesses,
            purchased_precursors: [],
        };

        await onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
            {/* 1. Installation Details Card */}
            <Card className="p-6 border-outline-variant/60 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-outline-variant/30 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                        <MaterialIcon name="domain" size="sm" />
                    </div>
                    <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                            1. Installation Master Data & Location (Sheet A_InstData)
                        </h3>
                        <p className="text-xs text-slate-500">
                            Official identification and geographic coordinates of the manufacturing site.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Installation Name (English) <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={nameEnglish}
                            onChange={(e) => setNameEnglish(e.target.value)}
                            placeholder="e.g. ArcelorMittal Poland Plant 1"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                        {errors.nameEnglish && <p className="text-[11px] text-rose-500 font-medium">{errors.nameEnglish}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Installation Name (Local Language)
                        </label>
                        <input
                            type="text"
                            value={nameLocal}
                            onChange={(e) => setNameLocal(e.target.value)}
                            placeholder="e.g. Huta Katowice"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Economic Activity (NACE / Industry)
                        </label>
                        <input
                            type="text"
                            value={economicActivity}
                            onChange={(e) => setEconomicActivity(e.target.value)}
                            placeholder="e.g. 24.10 - Manufacture of basic iron and steel"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            UNLOCODE <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={unlocode}
                            onChange={(e) => setUnlocode(e.target.value)}
                            placeholder="e.g. PLDBG or INNSA"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                        {errors.unlocode && <p className="text-[11px] text-rose-500 font-medium">{errors.unlocode}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Country <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                            {countries.length > 0 ? (
                                countries.map((c) => (
                                    <option key={c.code} value={c.name}>
                                        {c.name} ({c.code})
                                    </option>
                                ))
                            ) : (
                                <option value="Poland">Poland</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Street & Number
                        </label>
                        <input
                            type="text"
                            value={streetNumber}
                            onChange={(e) => setStreetNumber(e.target.value)}
                            placeholder="e.g. Al. Pilsudskiego 92"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            City <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Dabrowa Gornicza"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                        {errors.city && <p className="text-[11px] text-rose-500 font-medium">{errors.city}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Postal Code / PO Box
                        </label>
                        <input
                            type="text"
                            value={postCode}
                            onChange={(e) => setPostCode(e.target.value)}
                            placeholder="e.g. 41-308"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Latitude (Decimal Degrees) <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="any"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="50.3485"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                        {errors.latitude && <p className="text-[11px] text-rose-500 font-medium">{errors.latitude}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Longitude (Decimal Degrees) <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="any"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="19.2741"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 tabular-nums focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                        {errors.longitude && <p className="text-[11px] text-rose-500 font-medium">{errors.longitude}</p>}
                    </div>
                </div>
            </Card>

            {/* 2. Representative & Verifier Card */}
            <Card className="p-6 border-outline-variant/60 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-outline-variant/30 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                        <MaterialIcon name="badge" size="sm" />
                    </div>
                    <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                            2. Authorized Representative & Accredited Verifier
                        </h3>
                        <p className="text-xs text-slate-500">
                            Contact details of authorized operator and third-party verification body.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Representative Column */}
                    <div className="space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-200">
                        <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
                            Authorized Representative
                        </span>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-500">Full Name</label>
                            <input
                                type="text"
                                value={repName}
                                onChange={(e) => setRepName(e.target.value)}
                                placeholder="e.g. Jan Kowalski"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-500">Email Address</label>
                            <input
                                type="email"
                                value={repEmail}
                                onChange={(e) => setRepEmail(e.target.value)}
                                placeholder="e.g. jan.kowalski@plant.com"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-500">Telephone</label>
                            <input
                                type="text"
                                value={repPhone}
                                onChange={(e) => setRepPhone(e.target.value)}
                                placeholder="e.g. +48 32 776 5000"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                            />
                        </div>
                    </div>

                    {/* Verifier Column */}
                    <div className="space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-200">
                        <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1">
                            Accredited Verifier
                        </span>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-500">Verifier Company</label>
                            <input
                                type="text"
                                value={verifierCompany}
                                onChange={(e) => setVerifierCompany(e.target.value)}
                                placeholder="e.g. TUV Rheinland Polska Sp. z o.o."
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="block text-[11px] font-semibold text-slate-500">Accreditation Body</label>
                                <input
                                    type="text"
                                    value={verifierAccrBody}
                                    onChange={(e) => setVerifierAccrBody(e.target.value)}
                                    placeholder="e.g. PCA"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[11px] font-semibold text-slate-500">Accreditation Number</label>
                                <input
                                    type="text"
                                    value={verifierAccrNum}
                                    onChange={(e) => setVerifierAccrNum(e.target.value)}
                                    placeholder="e.g. PL-PCA-ENV-2024-089"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-500">Verifier Rep & Email</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={verifierRepName}
                                    onChange={(e) => setVerifierRepName(e.target.value)}
                                    placeholder="Verifier Rep"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                />
                                <input
                                    type="email"
                                    value={verifierRepEmail}
                                    onChange={(e) => setVerifierRepEmail(e.target.value)}
                                    placeholder="Email"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3. Declared Produced Goods (G1..G10) */}
            <Card className="p-6 border-outline-variant/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
                            <MaterialIcon name="inventory_2" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-slate-900">
                                3. Declared Produced Goods (G1..G10)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Assign CBAM Aggregated Categories and select declared production routes.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddGood}
                        disabled={goods.length >= 10}
                        className="gap-1 font-sans text-xs">
                        <MaterialIcon name="add" size="xs" />
                        <span>Add Good ({goods.length}/10)</span>
                    </Button>
                </div>

                <div className="space-y-3">
                    {goods.map((good, idx) => (
                        <GoodSlotRow
                            key={idx}
                            index={idx}
                            good={good}
                            categories={categories}
                            onUpdate={(updates) => handleGoodChange(idx, updates)}
                            onRemove={() => handleRemoveGood(idx)}
                            canRemove={goods.length > 1}
                        />
                    ))}
                </div>
            </Card>

            {/* 4. Production Processes (P1..P10) */}
            <Card className="p-6 border-outline-variant/60 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800">
                            <MaterialIcon name="precision_manufacturing" size="sm" />
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold text-slate-900">
                                4. Production Processes & Boundaries (P1..P10)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Define site processes with target categories and direct vs indirect system boundaries.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddProcess}
                        disabled={processes.length >= 10}
                        className="gap-1 font-sans text-xs">
                        <MaterialIcon name="add" size="xs" />
                        <span>Add Process ({processes.length}/10)</span>
                    </Button>
                </div>

                <div className="space-y-3">
                    {processes.map((proc, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 font-bold text-xs text-slate-900">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-800 text-[11px]">
                                        P{idx + 1}
                                    </span>
                                    Process #{idx + 1}
                                </span>
                                {processes.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProcess(idx)}
                                        className="text-rose-500 hover:text-rose-700 text-xs font-semibold">
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-semibold text-slate-500">Process Name</label>
                                    <input
                                        type="text"
                                        value={proc.name}
                                        onChange={(e) => handleProcessChange(idx, { name: e.target.value })}
                                        placeholder="e.g. BOF Steelmaking Process"
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[11px] font-semibold text-slate-500">Target Category</label>
                                    <select
                                        value={proc.target_category_id}
                                        onChange={(e) => handleProcessChange(idx, { target_category_id: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                                        <option value="">Select Aggregated Category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.sector})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[11px] font-semibold text-slate-500">Boundary Mode</label>
                                    <select
                                        value={proc.boundary_mode}
                                        onChange={(e) =>
                                            handleProcessChange(idx, {
                                                boundary_mode: e.target.value as CBAMBoundaryMode,
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                                        <option value="DIRECT">DIRECT (Standard Boundary)</option>
                                        <option value="INDIRECT_WITH_PRECURSORS">INDIRECT WITH PRECURSORS</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Submission Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="gap-2 font-sans text-xs font-semibold shadow-md">
                    <MaterialIcon name="save" size="sm" />
                    <span>{isSubmitting ? "Saving Installation Profile..." : isEdit ? "Update Installation Profile (Sheet A)" : "Save & Create Profile"}</span>
                </Button>
            </div>
        </form>
    );
}

function GoodSlotRow({
    index,
    good,
    categories,
    onUpdate,
    onRemove,
    canRemove,
}: {
    index: number;
    good: CBAMInstallationGood;
    categories: Array<{ id: string; name: string; sector: string }>;
    onUpdate: (updates: Partial<CBAMInstallationGood>) => void;
    onRemove: () => void;
    canRemove: boolean;
}) {
    const { data: routes = [] } = useCbamProductionRoutes(good.category_id);

    function toggleRoute(route: string) {
        const current = good.production_routes || [];
        const exists = current.includes(route);
        const next = exists ? current.filter((r) => r !== route) : [...current, route];
        onUpdate({ production_routes: next });
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-[11px]">
                        G{index + 1}
                    </span>
                    Good Slot #{index + 1}
                </span>

                {canRemove && (
                    <button type="button" onClick={onRemove} className="text-rose-500 hover:text-rose-700 text-xs font-semibold">
                        Remove
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-500">Aggregated Category</label>
                    <select
                        value={good.category_id}
                        onChange={(e) => onUpdate({ category_id: e.target.value, production_routes: [] })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500">
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.sector})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-500">Select Production Routes</label>
                    {routes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {routes.map((route) => {
                                const selected = (good.production_routes || []).includes(route);
                                return (
                                    <button
                                        type="button"
                                        key={route}
                                        onClick={() => toggleRoute(route)}
                                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                                            selected
                                                ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                                        }`}>
                                        {selected && "✓ "}
                                        {route}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="text-[11px] text-slate-400 italic block pt-1.5">
                            {good.category_id ? "Loading routes..." : "Select a category to view routes"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
