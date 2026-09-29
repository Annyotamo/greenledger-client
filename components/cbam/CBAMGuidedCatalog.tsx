"use client";

import { useState, useMemo, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    useCbamCategories,
    useCbamCnCodes,
    useCbamIpccFuels,
    useCbamProductNames,
    useCbamSpecifications,
} from "@/lib/cbam/hooks";
import type { CBAMCNDetails } from "@/lib/cbam/types";

export function CBAMGuidedCatalog() {
    // Active tab in catalog: "guided", "all-cn", "ipcc"
    const [activeTab, setActiveTab] = useState<"guided" | "all-cn" | "ipcc">("guided");

    // Guided Cascading State
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [selectedProductName, setSelectedProductName] = useState<string>("");
    const [selectedSpec, setSelectedSpec] = useState<CBAMCNDetails | null>(null);

    // Categories query
    const { data: categories = [], isLoading: loadingCategories } = useCbamCategories();

    // Cascading Dropdown 2: Product names
    const { data: productNames = [], isLoading: loadingProductNames } = useCbamProductNames(selectedCategoryId);

    // Cascading Dropdown 3: Specifications & CN codes
    const { data: specifications = [], isLoading: loadingSpecs } = useCbamSpecifications(
        selectedCategoryId,
        selectedProductName,
    );

    // Direct CN Search State
    const [cnSearch, setCnSearch] = useState("");
    const [cnCategoryFilter, setCnCategoryFilter] = useState("");
    const { data: cnCodes = [], isLoading: loadingCnCodes } = useCbamCnCodes({
        search: cnSearch || undefined,
        category_id: cnCategoryFilter || undefined,
        limit: 100,
    });

    // IPCC Fuels State
    const [ipccSearch, setIpccSearch] = useState("");
    const { data: ipccFuels = [], isLoading: loadingIpcc } = useCbamIpccFuels(ipccSearch || undefined);

    // Auto-select first category if available
    useEffect(() => {
        if (!selectedCategoryId && categories.length > 0) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories, selectedCategoryId]);

    // Handle Category change
    function handleCategoryChange(catId: string) {
        setSelectedCategoryId(catId);
        setSelectedProductName("");
        setSelectedSpec(null);
    }

    // Handle Product Name change
    function handleProductNameChange(prodName: string) {
        setSelectedProductName(prodName);
        setSelectedSpec(null);
    }

    const currentCategory = useMemo(() => {
        return categories.find((c) => c.id === selectedCategoryId);
    }, [categories, selectedCategoryId]);

    return (
        <div className="space-y-6 font-sans">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                <button
                    type="button"
                    onClick={() => setActiveTab("guided")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                        activeTab === "guided"
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}>
                    <MaterialIcon name="account_tree" size="xs" />
                    <span>3-Step Guided CN Code Resolver</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("all-cn")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                        activeTab === "all-cn"
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}>
                    <MaterialIcon name="manage_search" size="xs" />
                    <span>Search All CN Codes (8-Digit Directory)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("ipcc")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                        activeTab === "ipcc"
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}>
                    <MaterialIcon name="local_gas_station" size="xs" />
                    <span>IPCC Default Combustion Fuels</span>
                </button>
            </div>

            {/* TAB 1: 3-STEP GUIDED CN RESOLVER */}
            {activeTab === "guided" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left 2 Cols: Step-by-step selector */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* STEP 1: Aggregated Category */}
                        <Card className="p-5 border-outline-variant/60 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                    1
                                </span>
                                <h4 className="font-display text-sm font-bold text-slate-900">
                                    Step 1: Select Aggregated Category
                                </h4>
                            </div>

                            <p className="text-xs text-slate-500">
                                Select one of the 6 official EU CBAM aggregated sectors:
                            </p>

                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {loadingCategories ? (
                                    <div className="col-span-3 py-4 text-center text-xs text-slate-400">Loading categories...</div>
                                ) : (
                                    categories.map((cat) => {
                                        const isSelected = cat.id === selectedCategoryId;
                                        return (
                                            <button
                                                type="button"
                                                key={cat.id}
                                                onClick={() => handleCategoryChange(cat.id)}
                                                className={`flex flex-col items-start rounded-xl p-3 border text-left transition-all ${
                                                    isSelected
                                                        ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 text-slate-900"
                                                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                                }`}>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                                                    {cat.sector}
                                                </span>
                                                <span className="font-display text-xs font-bold mt-0.5">{cat.name}</span>
                                                <span className="text-[10px] text-slate-400 mt-1">
                                                    Unit: {cat.production_unit}
                                                </span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </Card>

                        {/* STEP 2: Product Name Selector */}
                        <Card className="p-5 border-outline-variant/60 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                                    2
                                </span>
                                <h4 className="font-display text-sm font-bold text-slate-900">
                                    Step 2: Select Product Name
                                </h4>
                            </div>

                            <p className="text-xs text-slate-500">
                                Distinct product classes available under &ldquo;{currentCategory?.name || "Selected Category"}&rdquo;:
                            </p>

                            {loadingProductNames ? (
                                <div className="py-4 text-center text-xs text-slate-400">Loading product names...</div>
                            ) : productNames.length === 0 ? (
                                <div className="py-4 text-center text-xs text-slate-400">
                                    Select an aggregated category in Step 1 to load products.
                                </div>
                            ) : (
                                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                    {productNames.map((pName) => {
                                        const isSelected = pName === selectedProductName;
                                        return (
                                            <button
                                                type="button"
                                                key={pName}
                                                onClick={() => handleProductNameChange(pName)}
                                                className={`w-full flex items-center justify-between rounded-lg p-2.5 border text-left text-xs transition-all ${
                                                    isSelected
                                                        ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500 font-semibold text-blue-950"
                                                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                                }`}>
                                                <span>{pName}</span>
                                                {isSelected && <MaterialIcon name="check" size="xs" className="text-blue-700" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>

                        {/* STEP 3: Specifications & Exact CN Code */}
                        <Card className="p-5 border-outline-variant/60 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                                    3
                                </span>
                                <h4 className="font-display text-sm font-bold text-slate-900">
                                    Step 3: Resolve Specification & 8-Digit CN Code
                                </h4>
                            </div>

                            <p className="text-xs text-slate-500">
                                Choose exact material specification to resolve Combined Nomenclature (CN) 8-digit code:
                            </p>

                            {loadingSpecs ? (
                                <div className="py-4 text-center text-xs text-slate-400">Loading specifications...</div>
                            ) : specifications.length === 0 ? (
                                <div className="py-4 text-center text-xs text-slate-400">
                                    Select a product name in Step 2 to view specifications.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {specifications.map((spec) => {
                                        const isSelected = selectedSpec?.id === spec.id;
                                        return (
                                            <button
                                                type="button"
                                                key={spec.id}
                                                onClick={() => setSelectedSpec(spec)}
                                                className={`w-full flex flex-col items-start rounded-xl p-3 border text-left text-xs transition-all ${
                                                    isSelected
                                                        ? "bg-purple-50 border-purple-500 ring-1 ring-purple-500 text-slate-900"
                                                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                                }`}>
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                                                        CN: {spec.cn_code}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="text-[11px] font-bold text-purple-800">
                                                            ✓ Resolved Code
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-medium text-slate-800 mt-2">
                                                    {spec.specification}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Col: Resolved Details Card */}
                    <div className="space-y-4">
                        <Card className="p-5 border-outline-variant/60 shadow-md bg-slate-50/70 space-y-4 sticky top-24">
                            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                                <MaterialIcon name="verified" size="sm" className="text-emerald-700" />
                                <h4 className="font-display text-sm font-bold text-slate-900">
                                    Resolved CN Code & Category Scope
                                </h4>
                            </div>

                            {selectedSpec ? (
                                <div className="space-y-4 font-sans text-xs">
                                    <div className="rounded-xl bg-white p-4 border border-emerald-200 shadow-xs space-y-2">
                                        <span className="block text-[10px] uppercase font-bold text-emerald-800">
                                            Official 8-Digit CN Code
                                        </span>
                                        <span className="font-mono text-xl font-bold text-slate-900">
                                            {selectedSpec.cn_code}
                                        </span>
                                        <p className="text-xs text-slate-600 font-medium">
                                            {selectedSpec.product_name}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="block text-[10px] uppercase font-bold text-slate-500">
                                            Full Tariff Specification
                                        </span>
                                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                                            {selectedSpec.full_description || selectedSpec.specification}
                                        </p>
                                    </div>

                                    {currentCategory && (
                                        <div className="space-y-2 pt-2 border-t border-slate-200">
                                            <span className="block text-[10px] uppercase font-bold text-slate-500">
                                                Category GHG Accounting Scope
                                            </span>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="rounded-lg bg-white p-2 border border-slate-200">
                                                    <span className="text-[10px] text-slate-400 block">Direct Emissions</span>
                                                    <span className="font-bold text-slate-900">
                                                        {currentCategory.direct_emissions_applicable ? "Applicable" : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="rounded-lg bg-white p-2 border border-slate-200">
                                                    <span className="text-[10px] text-slate-400 block">Indirect Emissions</span>
                                                    <span className="font-bold text-slate-900">
                                                        {currentCategory.indirect_emissions_applicable ? "Applicable" : "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="rounded-lg bg-white p-2 border border-slate-200 mt-2">
                                                <span className="text-[10px] text-slate-400 block">Covered Greenhouse Gases</span>
                                                <span className="font-bold text-emerald-800">
                                                    {currentCategory.covered_gases.join(", ")}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                                    <MaterialIcon name="info" size="md" className="text-slate-300 mx-auto" />
                                    <p className="font-medium text-slate-600">No CN Code Selected</p>
                                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                                        Follow Steps 1, 2, and 3 to resolve the exact Combined Nomenclature code and its CBAM regulatory parameters.
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB 2: ALL CN CODES DIRECTORY */}
            {activeTab === "all-cn" && (
                <Card className="p-5 border-outline-variant/60 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <div className="relative">
                                <MaterialIcon
                                    name="search"
                                    size="sm"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[16px]"
                                />
                                <input
                                    type="text"
                                    value={cnSearch}
                                    onChange={(e) => setCnSearch(e.target.value)}
                                    placeholder="Search by 8-digit CN code, product name, or specification..."
                                    className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <select
                                value={cnCategoryFilter}
                                onChange={(e) => setCnCategoryFilter(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary">
                                <option value="">All CBAM Categories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.sector})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-28 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        CN Code
                                    </TableHead>
                                    <TableHead className="w-64 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Product Name
                                    </TableHead>
                                    <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Full Tariff Specification
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingCnCodes ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-12 text-xs text-slate-400">
                                            Loading CN codes directory...
                                        </TableCell>
                                    </TableRow>
                                ) : cnCodes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-12 text-xs text-slate-400">
                                            No CN codes found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cnCodes.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50 text-xs">
                                            <TableCell className="font-mono font-bold text-purple-900">
                                                {item.cn_code}
                                            </TableCell>
                                            <TableCell className="font-semibold text-slate-900">
                                                {item.product_name}
                                            </TableCell>
                                            <TableCell className="text-slate-600 leading-relaxed">
                                                {item.full_description || item.specification}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* TAB 3: IPCC DEFAULT FUELS CATALOG */}
            {activeTab === "ipcc" && (
                <Card className="p-5 border-outline-variant/60 shadow-sm space-y-4">
                    <div className="relative">
                        <MaterialIcon
                            name="search"
                            size="sm"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 !text-[16px]"
                        />
                        <input
                            type="text"
                            value={ipccSearch}
                            onChange={(e) => setIpccSearch(e.target.value)}
                            placeholder="Search IPCC combustion fuel name or unit..."
                            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Fuel Name
                                    </TableHead>
                                    <TableHead className="w-32 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Unit Symbol
                                    </TableHead>
                                    <TableHead className="w-40 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        Unit Name
                                    </TableHead>
                                    <TableHead className="w-40 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                                        Default Factor (t CO₂/unit)
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingIpcc ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-xs text-slate-400">
                                            Loading IPCC fuels...
                                        </TableCell>
                                    </TableRow>
                                ) : ipccFuels.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-xs text-slate-400">
                                            No IPCC fuels found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ipccFuels.map((fuel) => (
                                        <TableRow key={fuel.id} className="hover:bg-slate-50 text-xs">
                                            <TableCell className="font-semibold text-slate-900">
                                                {fuel.fuel_name}
                                            </TableCell>
                                            <TableCell className="font-mono text-slate-700 bg-slate-100/60">
                                                {fuel.unit_symbol}
                                            </TableCell>
                                            <TableCell className="text-slate-600">{fuel.unit_name}</TableCell>
                                            <TableCell className="text-right font-mono font-bold text-slate-900 tabular-nums">
                                                {fuel.default_ef_tco2_per_unit.toFixed(5)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}
        </div>
    );
}
