"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { CustomSelect } from "@/components/ui/select";
import { useReportingPeriods } from "@/lib/reportingPeriods/hooks";
import { useEmissionSources } from "@/lib/emissionSource/hooks";
import { privateApi } from "@/lib/http/client";
import { getErrorMessage } from "@/lib/utils/error";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessItem {
    row: number;
    activity_id: string;
    fuel_name: string;
    facility_name: string;
    quantity: string;
    unit_symbol: string;
    calculated_kg_co2e: string;
}

interface FailureError {
    row: number;
    field: string;
    cell_value: string;
    reason: string;
}

interface FailureItem {
    row: number;
    facility_code_or_name: string | null;
    fuel_name: string | null;
    errors: FailureError[];
}

interface BulkUploadResponseData {
    reporting_period_id: string;
    total_rows: number;
    success_count: number;
    failure_count: number;
    successes: SuccessItem[];
    failures: FailureItem[];
    emission_factor_source_used: string;
}

export default function BulkUploadFuelPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Queries
    const reportingPeriodsQuery = useReportingPeriods();
    const sourcesQuery = useEmissionSources();

    // Form State
    const [reportingPeriod, setReportingPeriod] = useState("");
    const [source, setSource] = useState("ceea4ef9-1120-4c0f-9325-b5c5fca66400"); // default template source
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // Loading & Error States
    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Response results state
    const [results, setResults] = useState<BulkUploadResponseData | null>(null);

    // Download template from API
    const handleDownloadTemplate = async () => {
        try {
            const response = await privateApi.get("/tenant/activity/fuel/excel/template", {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "fuel_combustion_bulk_template.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            console.error(err);
            setErrorMsg("Failed to download template. Please try again later.");
        }
    };

    // Drag-and-drop file upload handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls")) {
                setFile(droppedFile);
                setErrorMsg(null);
            } else {
                setErrorMsg("Invalid file type. Please upload an Excel spreadsheet (.xlsx or .xls).");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setErrorMsg(null);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Form Submit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
        setResults(null);

        if (!reportingPeriod) {
            setErrorMsg("Reporting period is required.");
            return;
        }
        if (!file) {
            setErrorMsg("Please select or drop an Excel template file to upload.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("reporting_period_id", reportingPeriod);
            if (source) {
                formData.append("source_id", source);
            }
            formData.append("file", file);

            const response = await privateApi.post<{
                success: boolean;
                status_code: number;
                message: string;
                data: BulkUploadResponseData;
            }>("/tenant/activity/fuel/bulk/excel", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const responseData = response.data;
            if (responseData.success) {
                const data = responseData.data;
                setResults(data);
                if (data.failure_count === 0) {
                    setSuccessMsg(`Successfully processed Excel template! All ${data.success_count} activities loaded.`);
                } else if (data.success_count === 0) {
                    setErrorMsg(`Excel template processing failed. ${data.failure_count} rows contain errors.`);
                } else {
                    setSuccessMsg(`Excel template partially processed: ${data.success_count} rows loaded, ${data.failure_count} rows skipped due to errors.`);
                }
            } else {
                setErrorMsg(responseData.message || "Failed to process the uploaded file.");
            }
        } catch (err: any) {
            console.error(err);
            const errMsg = getErrorMessage(err, "Failed to upload file. Please verify parameters and check server status.");
            setErrorMsg(errMsg);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-container-margin">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-label-md text-label-md">
                <Link href="/activities/fuel" className="hover:text-primary transition-colors">
                    Fuel Activities
                </Link>
                <MaterialIcon name="chevron_right" size="xs" />
                <span className="text-primary font-semibold">Bulk Upload</span>
            </div>

            {/* Page Header */}
            <header className="mb-8">
                <h1 className="text-headline-lg font-headline-lg text-primary mb-2">Bulk Fuel Activity Entry</h1>
                <p className="text-on-surface-variant font-body-lg text-body-lg">
                    Upload multiple fuel combustion events using our pre-formatted Excel template.
                </p>
            </header>

            {/* Error and Success Banners */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-error font-body-md flex items-center gap-2"
                    >
                        <MaterialIcon name="error" size="xs" />
                        <span>{errorMsg}</span>
                    </motion.div>
                )}
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 rounded-lg border border-secondary/20 bg-secondary/10 px-4 py-3 text-secondary font-body-md flex items-center gap-2"
                    >
                        <MaterialIcon name="check_circle" size="xs" />
                        <span>{successMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Upload Column */}
                <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Download Template Banner */}
                        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5 flex items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-primary text-body-md">Missing the spreadsheet template?</h3>
                                <p className="text-xs text-on-surface-variant mt-1">
                                    Download the template, fill in your activity records and return here to upload.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownloadTemplate}
                                className="shrink-0 flex items-center gap-2 bg-white border border-outline-variant hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md transition-colors"
                            >
                                <MaterialIcon name="download" size="sm" />
                                <span>Download</span>
                            </button>
                        </div>

                        {/* Configuration parameters */}
                        <section className="bg-white rounded-xl border border-outline-variant p-6 space-y-4">
                            <h2 className="text-headline-sm font-semibold text-primary mb-4 flex items-center gap-2">
                                <MaterialIcon name="settings" size="sm" />
                                <span>1. Parameters Configuration</span>
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Reporting Period <span className="text-error">*</span>
                                    </label>
                                    <CustomSelect
                                        options={
                                            reportingPeriodsQuery.data?.map((p: any) => ({
                                                label: p.name,
                                                value: String(p.id),
                                            })) || []
                                        }
                                        value={reportingPeriod}
                                        onChange={setReportingPeriod}
                                        placeholder="Select reporting period..."
                                    />
                                </div>

                                <div>
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                        Emission Factor Source (Override)
                                    </label>
                                    <CustomSelect
                                        options={
                                            sourcesQuery.data?.map((s) => ({
                                                label: `${s.standard} (${s.version} - ${s.region})`,
                                                value: s.id,
                                            })) || []
                                        }
                                        value={source}
                                        onChange={setSource}
                                        placeholder="Select source (optional)..."
                                    />
                                    <p className="text-[10px] text-on-surface-variant mt-1">
                                        Select factor version database used to calculate row emissions. Defaults to DEFRA 2 if left empty.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Drag and Drop Zone */}
                        <section className="bg-white rounded-xl border border-outline-variant p-6">
                            <h2 className="text-headline-sm font-semibold text-primary mb-4 flex items-center gap-2">
                                <MaterialIcon name="description" size="sm" />
                                <span>2. Upload File</span>
                            </h2>

                            <div
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                className={`relative rounded-xl border-2 border-dashed p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer ${
                                    dragActive
                                        ? "border-primary bg-primary/5"
                                        : file
                                        ? "border-secondary/50 bg-secondary/5"
                                        : "border-outline-variant hover:border-primary/50"
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-3 ${
                                    file ? "bg-secondary/20 text-secondary" : "bg-primary/10 text-primary"
                                }`}>
                                    <MaterialIcon name={file ? "check" : "upload_file"} size="md" />
                                </div>

                                {file ? (
                                    <div className="space-y-1 z-10" onClick={(e) => e.stopPropagation()}>
                                        <p className="font-semibold text-on-surface text-body-md">{file.name}</p>
                                        <p className="text-xs text-on-surface-variant">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="text-xs text-error hover:underline flex items-center gap-1 mx-auto mt-2"
                                        >
                                            <MaterialIcon name="delete" size="xs" />
                                            <span>Remove file</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-semibold text-on-surface text-body-md">
                                            Drag & drop your populated template here
                                        </p>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            or click to browse from files (.xlsx, .xls)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
                            <Link href="/activities/fuel">
                                <button
                                    type="button"
                                    className="px-8 py-3 rounded-lg font-label-md text-label-md border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors"
                                >
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={isUploading || !file || !reportingPeriod}
                                className="px-10 py-3 rounded-lg font-label-md text-label-md bg-secondary text-on-secondary hover:opacity-90 shadow-md transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
                            >
                                <MaterialIcon name="publish" size="sm" />
                                <span>{isUploading ? "Processing..." : "Process Spreadsheet"}</span>
                            </button>
                        </div>
                    </form>

                    {/* Results details panel */}
                    <AnimatePresence>
                        {results && (
                            <motion.section
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-outline-variant p-6 space-y-6"
                            >
                                <div className="border-b border-outline-variant pb-4">
                                    <h2 className="text-headline-sm font-semibold text-primary flex items-center gap-2">
                                        <MaterialIcon name="fact_check" size="sm" />
                                        <span>Processing Summary</span>
                                    </h2>
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        Calculated emissions verified against:{" "}
                                        <span className="font-semibold text-primary">
                                            {results.emission_factor_source_used}
                                        </span>
                                    </p>
                                </div>

                                {/* Stats layout grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-surface-container rounded-lg p-4 text-center">
                                        <span className="block text-2xl font-bold text-primary">
                                            {results.total_rows}
                                        </span>
                                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                                            Total Rows
                                        </span>
                                    </div>
                                    <div className="bg-secondary/10 rounded-lg p-4 text-center">
                                        <span className="block text-2xl font-bold text-secondary">
                                            {results.success_count}
                                        </span>
                                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                                            Successes
                                        </span>
                                    </div>
                                    <div className="bg-error/10 rounded-lg p-4 text-center">
                                        <span className="block text-2xl font-bold text-error">
                                            {results.failure_count}
                                        </span>
                                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                                            Failures
                                        </span>
                                    </div>
                                </div>

                                {/* Success log */}
                                {results.successes.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-body-md font-bold text-secondary flex items-center gap-1.5">
                                            <MaterialIcon name="check_circle" size="xs" />
                                            <span>Successfully Processed Rows</span>
                                        </h3>
                                        <div className="border border-outline-variant rounded-lg divide-y divide-outline-variant overflow-hidden max-h-60 overflow-y-auto">
                                            {results.successes.map((item) => (
                                                <div key={item.row} className="p-3 bg-white text-xs flex justify-between items-center gap-3">
                                                    <div>
                                                        <span className="font-semibold text-primary bg-surface-container px-2 py-0.5 rounded text-[10px] mr-2">
                                                            Row {item.row}
                                                        </span>
                                                        <span className="font-medium text-on-surface">{item.fuel_name}</span>
                                                        <span className="text-on-surface-variant mx-1">at</span>
                                                        <span className="text-on-surface-variant italic">{item.facility_name}</span>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className="font-semibold text-on-surface">
                                                            {item.quantity} {item.unit_symbol}
                                                        </div>
                                                        <div className="text-[10px] text-on-surface-variant mt-0.5">
                                                            {Number(item.calculated_kg_co2e).toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO₂e
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Failure details */}
                                {results.failures.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-body-md font-bold text-error flex items-center gap-1.5">
                                            <MaterialIcon name="warning" size="xs" />
                                            <span>Failing / Skipped Rows</span>
                                        </h3>
                                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                            {results.failures.map((fail, idx) => (
                                                <div
                                                    key={idx}
                                                    className="border border-error/20 bg-error/5 rounded-lg p-3 text-xs space-y-2"
                                                >
                                                    <div className="flex justify-between items-center border-b border-error/10 pb-1.5">
                                                        <span className="font-bold text-error bg-error/10 px-2.5 py-0.5 rounded text-[10px]">
                                                            Row {fail.row}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-on-surface-variant italic">
                                                            {fail.fuel_name || "Unknown Fuel"} - {fail.facility_code_or_name || "Unknown Facility"}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {fail.errors.map((errItem, errIdx) => (
                                                            <div key={errIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                                <div className="font-semibold text-on-surface text-[10px]">
                                                                    Column: <span className="text-error">{errItem.field}</span>
                                                                </div>
                                                                <div className="text-on-surface-variant font-mono text-[10px] break-all">
                                                                    Value: <span className="font-semibold text-on-surface">&quot;{errItem.cell_value || "empty"}&quot;</span>
                                                                </div>
                                                                <div className="text-error leading-relaxed text-[10px] sm:col-span-1">
                                                                    {errItem.reason}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Guidelines Column */}
                <div className="space-y-6">
                    <section className="bg-white rounded-xl border border-outline-variant p-5 space-y-4">
                        <h3 className="font-bold text-primary text-body-md flex items-center gap-1.5 border-b border-outline-variant pb-2">
                            <MaterialIcon name="info" size="xs" />
                            <span>Spreadsheet Guidelines</span>
                        </h3>

                        {/* Color guides */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Colour Coding</h4>
                            <div className="flex gap-3 items-start">
                                <span className="h-5 w-5 shrink-0 rounded bg-green-200 border border-green-300" />
                                <div className="text-[11px] leading-relaxed">
                                    <span className="font-semibold text-on-surface block">Green Background</span>
                                    Mandatory columns. Row skips if empty.
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <span className="h-5 w-5 shrink-0 rounded bg-yellow-200 border border-yellow-300" />
                                <div className="text-[11px] leading-relaxed">
                                    <span className="font-semibold text-on-surface block">Yellow Background</span>
                                    Optional columns. System assumes defaults if blank.
                                </div>
                            </div>
                        </div>

                        {/* Standard column reference */}
                        <div className="space-y-2.5 pt-2 border-t border-outline-variant/60">
                            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Required Fields</h4>
                            <ul className="text-[11px] space-y-2 text-on-surface-variant list-disc pl-4">
                                <li>
                                    <span className="font-semibold text-on-surface">Facility Code / Name:</span>
                                    Registered GreenLedger identifier.
                                </li>
                                <li>
                                    <span className="font-semibold text-on-surface">Usage Type:</span>
                                    e.g., <code className="bg-surface-container px-1 py-0.5 rounded">direct_combustion</code> or plain English.
                                </li>
                                <li>
                                    <span className="font-semibold text-on-surface">Emission Type:</span>
                                    e.g., <code className="bg-surface-container px-1 py-0.5 rounded">stationary</code>, <code className="bg-surface-container px-1 py-0.5 rounded">mobile</code>.
                                </li>
                                <li>
                                    <span className="font-semibold text-on-surface">Fuel Category & Fuel Name:</span>
                                    Matches database names exactly.
                                </li>
                                <li>
                                    <span className="font-semibold text-on-surface">Quantity & Unit Symbol:</span>
                                    Unit must have active factor configurations.
                                </li>
                                <li>
                                    <span className="font-semibold text-on-surface">Start & End Dates:</span>
                                    Must fall inside selected period.
                                </li>
                            </ul>
                        </div>

                        {/* Rules guide */}
                        <div className="space-y-2.5 pt-2 border-t border-outline-variant/60">
                            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Quick Rules</h4>
                            <ul className="text-[10px] space-y-1.5 text-on-surface-variant list-decimal pl-4">
                                <li>Do NOT delete or edit Row 3 (the header).</li>
                                <li>Row 4 (EXAMPLE-01) is ignored automatically.</li>
                                <li>Ensure no empty rows in between data blocks.</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
