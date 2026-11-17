"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type {
    BRSRSectionAData,
    BRSRBusinessActivity,
    BRSRProductSold,
    BRSRHoldingSubsidiary,
    BRSRStakeholderGrievance,
    BRSREmployeeCategory,
} from "@/lib/brsr/types";
import { useSaveBrsrSectionA } from "@/lib/brsr/hooks";

interface BrsrSectionATabProps {
    reportingPeriodId: string;
    financialYearLabel: string;
    initialData: BRSRSectionAData | null;
    initialSubSection?: "entity" | "employees" | "csr";
    onSaved?: () => void;
}

const DEFAULT_EMPLOYEE_CAT: BRSREmployeeCategory = { male: 0, female: 0, other: 0, total: 0 };

export function BrsrSectionATab({
    reportingPeriodId,
    financialYearLabel,
    initialData,
    initialSubSection = "entity",
    onSaved,
}: BrsrSectionATabProps) {
    const [subSection, setSubSection] = useState<"entity" | "employees" | "csr">(initialSubSection);

    useEffect(() => {
        if (initialSubSection) {
            setSubSection(initialSubSection);
        }
    }, [initialSubSection]);

    // Local form state
    const [formData, setFormData] = useState<BRSRSectionAData>(() => ({
        reporting_period_id: reportingPeriodId,
        financial_year_label: financialYearLabel,
        entity_details: {
            cin: "",
            company_name: "",
            year_of_incorporation: null,
            registered_office_address: "",
            corporate_address: "",
            email: "",
            telephone: "",
            website: "",
            stock_exchanges: ["BSE", "NSE"],
            paid_up_capital_inr: null,
            ...initialData?.entity_details,
        },
        products_services: {
            business_activities: initialData?.products_services?.business_activities || [
                { description: "Manufacturing & Industrial Operations", nic_code: "2011", turnover_percentage: 100 },
            ],
            products_sold: initialData?.products_services?.products_sold || [
                { product_name: "Primary Manufactured Goods", nic_code: "20111", turnover_percentage: 100 },
            ],
        },
        operations: {
            plants_national: 0,
            offices_national: 0,
            plants_international: 0,
            offices_international: 0,
            export_turnover_percent: 0,
            customer_types_brief: "B2B and Commercial clients",
            ...initialData?.operations,
        },
        employees: {
            permanent_employees: { ...DEFAULT_EMPLOYEE_CAT, ...initialData?.employees?.permanent_employees },
            other_employees: { ...DEFAULT_EMPLOYEE_CAT, ...initialData?.employees?.other_employees },
            permanent_workers: { ...DEFAULT_EMPLOYEE_CAT, ...initialData?.employees?.permanent_workers },
            other_workers: { ...DEFAULT_EMPLOYEE_CAT, ...initialData?.employees?.other_workers },
            differently_abled_employees: { ...DEFAULT_EMPLOYEE_CAT, ...initialData?.employees?.differently_abled_employees },
            differently_abled_workers: { ...DEFAULT_EMPLOYEE_CAT, ...initialData?.employees?.differently_abled_workers },
            women_in_board: { count: 1, percentage: 20, ...initialData?.employees?.women_in_board },
            women_in_kmp: { count: 1, percentage: 20, ...initialData?.employees?.women_in_kmp },
        },
        holding_subsidiaries: initialData?.holding_subsidiaries || [
            {
                entity_name: "Subsidiary Operations Pvt Ltd",
                entity_type: "Subsidiary",
                shares_held_percent: 100,
                participates_in_br: true,
            },
        ],
        csr_details: {
            is_applicable: true,
            turnover_inr: null,
            net_worth_inr: null,
            total_csr_spend_inr: null,
            ...initialData?.csr_details,
        },
        stakeholder_grievances: initialData?.stakeholder_grievances || [
            {
                stakeholder_group: "Communities",
                has_mechanism: true,
                weblink: "",
                complaints_filed_count: 0,
                complaints_pending_count: 0,
                remarks: "Local community grievance committee meets regularly",
            },
            {
                stakeholder_group: "Investors & Shareholders",
                has_mechanism: true,
                weblink: "",
                complaints_filed_count: 0,
                complaints_pending_count: 0,
                remarks: "Handled through Investor Relations Officer & Registrar",
            },
            {
                stakeholder_group: "Employees & Workers",
                has_mechanism: true,
                weblink: "",
                complaints_filed_count: 0,
                complaints_pending_count: 0,
                remarks: "POSH and Whistleblower portal active",
            },
            {
                stakeholder_group: "Customers",
                has_mechanism: true,
                weblink: "",
                complaints_filed_count: 0,
                complaints_pending_count: 0,
                remarks: "Dedicated customer support desk",
            },
        ],
        status: initialData?.status || "draft",
    }));

    // Update form when initialData or period changes
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData((prev) => ({
                ...prev,
                reporting_period_id: reportingPeriodId,
                financial_year_label: financialYearLabel,
            }));
        }
    }, [initialData, reportingPeriodId, financialYearLabel]);

    const saveMutation = useSaveBrsrSectionA();
    const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

    const handleSave = async () => {
        try {
            await saveMutation.mutateAsync({
                ...formData,
                reporting_period_id: reportingPeriodId,
                financial_year_label: financialYearLabel,
            });
            setSaveSuccessNotice(true);
            setTimeout(() => setSaveSuccessNotice(false), 3000);
            onSaved?.();
        } catch (err) {
            console.error("Failed to save Section A", err);
        }
    };

    // Helper to calculate category totals
    const updateEmployeeCategory = (
        field: keyof BRSRSectionAData["employees"],
        gender: "male" | "female" | "other",
        value: number,
    ) => {
        setFormData((prev) => {
            const current = (prev.employees[field] as BRSREmployeeCategory) || DEFAULT_EMPLOYEE_CAT;
            const updated = {
                ...current,
                [gender]: Math.max(0, value),
            };
            updated.total = updated.male + updated.female + updated.other;

            return {
                ...prev,
                employees: {
                    ...prev.employees,
                    [field]: updated,
                },
            };
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Strip & Sub-navigation */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="active" size="sm">
                            SEBI Annexure II • Section A
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">General Disclosures (pp. 1–14)</span>
                    </div>
                    <h2 className="text-xl font-bold text-primary font-display mt-1">
                        General Corporate &amp; Operational Disclosures
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    {saveSuccessNotice && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-fade-in">
                            <MaterialIcon name="check" size="xs" />
                            Saved successfully!
                        </span>
                    )}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="gap-1.5 shadow-2xs">
                        <MaterialIcon name={saveMutation.isPending ? "sync" : "save"} size="sm" className={saveMutation.isPending ? "animate-spin" : ""} />
                        <span>{saveMutation.isPending ? "Saving..." : "Save Section A"}</span>
                    </Button>
                </div>
            </div>

            {/* Sub-section Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low p-1">
                <button
                    type="button"
                    onClick={() => setSubSection("entity")}
                    className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "entity"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="business" size="xs" />
                    <span>Entity Details &amp; Operations</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSubSection("employees")}
                    className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "employees"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="groups" size="xs" />
                    <span>Employees, Workers &amp; Diversity</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSubSection("csr")}
                    className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "csr"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="volunteer_activism" size="xs" />
                    <span>CSR &amp; Stakeholder Complaints</span>
                </button>
            </div>

            {/* SUB-SECTION 1: Entity Details & Operations */}
            {subSection === "entity" && (
                <div className="space-y-6">
                    {/* Entity Details Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="badge" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    I. Corporate Identity &amp; Statutory Registration
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] text-on-surface-variant uppercase">Mandatory CIN &amp; Office</span>
                        </CardHeader>
                        <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">Corporate Identity Number (CIN)</label>
                                <Input
                                    value={formData.entity_details.cin || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: { ...prev.entity_details, cin: e.target.value },
                                        }))
                                    }
                                    placeholder="e.g. L12345MH2020PLC123456"
                                    className="text-xs font-mono"
                                />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-xs font-semibold text-on-surface">Company / Corporate Entity Name</label>
                                <Input
                                    value={formData.entity_details.company_name || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: { ...prev.entity_details, company_name: e.target.value },
                                        }))
                                    }
                                    placeholder="Full Legal Registered Company Name"
                                    className="text-xs font-medium"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">Year of Incorporation</label>
                                <Input
                                    type="number"
                                    value={formData.entity_details.year_of_incorporation ?? ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: {
                                                ...prev.entity_details,
                                                year_of_incorporation: e.target.value ? Number(e.target.value) : null,
                                            },
                                        }))
                                    }
                                    placeholder="e.g. 2015"
                                    className="text-xs"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">Paid-up Capital (INR)</label>
                                <Input
                                    type="number"
                                    value={formData.entity_details.paid_up_capital_inr ?? ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: {
                                                ...prev.entity_details,
                                                paid_up_capital_inr: e.target.value ? Number(e.target.value) : null,
                                            },
                                        }))
                                    }
                                    placeholder="e.g. 500000000"
                                    className="text-xs font-mono"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">Listed Stock Exchanges</label>
                                <Input
                                    value={formData.entity_details.stock_exchanges.join(", ")}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: {
                                                ...prev.entity_details,
                                                stock_exchanges: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                            },
                                        }))
                                    }
                                    placeholder="BSE, NSE"
                                    className="text-xs"
                                />
                            </div>

                            <div className="space-y-1 sm:col-span-3">
                                <label className="text-xs font-semibold text-on-surface">Registered Office Address</label>
                                <Input
                                    value={formData.entity_details.registered_office_address || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: { ...prev.entity_details, registered_office_address: e.target.value },
                                        }))
                                    }
                                    placeholder="Complete postal address with PIN"
                                    className="text-xs"
                                />
                            </div>

                            <div className="space-y-1 sm:col-span-3">
                                <label className="text-xs font-semibold text-on-surface">Corporate / Operating Address</label>
                                <Input
                                    value={formData.entity_details.corporate_address || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: { ...prev.entity_details, corporate_address: e.target.value },
                                        }))
                                    }
                                    placeholder="If different from registered office address"
                                    className="text-xs"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">Official Email</label>
                                <Input
                                    type="email"
                                    value={formData.entity_details.email || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: { ...prev.entity_details, email: e.target.value },
                                        }))
                                    }
                                    placeholder="esg@company.com"
                                    className="text-xs"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">Telephone</label>
                                <Input
                                    value={formData.entity_details.telephone || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: { ...prev.entity_details, telephone: e.target.value },
                                        }))
                                    }
                                    placeholder="+91-22-12345678"
                                    className="text-xs"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">Website URL</label>
                                <Input
                                    value={formData.entity_details.website || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            entity_details: { ...prev.entity_details, website: e.target.value },
                                        }))
                                    }
                                    placeholder="https://www.company.com"
                                    className="text-xs"
                                />
                            </div>
                        </CardBody>
                    </Card>

                    {/* Operations Footprint Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="place" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    II. Operational Footprint &amp; Locations
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] text-on-surface-variant uppercase">Plants &amp; Offices Count</span>
                        </CardHeader>
                        <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">National Plants Count</label>
                                <Input
                                    type="number"
                                    value={formData.operations.plants_national}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            operations: { ...prev.operations, plants_national: Number(e.target.value) || 0 },
                                        }))
                                    }
                                    className="text-xs font-mono"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">National Offices Count</label>
                                <Input
                                    type="number"
                                    value={formData.operations.offices_national}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            operations: { ...prev.operations, offices_national: Number(e.target.value) || 0 },
                                        }))
                                    }
                                    className="text-xs font-mono"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">International Plants Count</label>
                                <Input
                                    type="number"
                                    value={formData.operations.plants_international}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            operations: { ...prev.operations, plants_international: Number(e.target.value) || 0 },
                                        }))
                                    }
                                    className="text-xs font-mono"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">International Offices Count</label>
                                <Input
                                    type="number"
                                    value={formData.operations.offices_international}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            operations: { ...prev.operations, offices_international: Number(e.target.value) || 0 },
                                        }))
                                    }
                                    className="text-xs font-mono"
                                />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-xs font-semibold text-on-surface">Export Turnover %</label>
                                <Input
                                    type="number"
                                    value={formData.operations.export_turnover_percent}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            operations: { ...prev.operations, export_turnover_percent: Number(e.target.value) || 0 },
                                        }))
                                    }
                                    placeholder="e.g. 15.5"
                                    className="text-xs font-mono"
                                />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                                <label className="text-xs font-semibold text-on-surface">Customer Types Brief</label>
                                <Input
                                    value={formData.operations.customer_types_brief || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            operations: { ...prev.operations, customer_types_brief: e.target.value },
                                        }))
                                    }
                                    placeholder="e.g. B2B manufacturing and industrial clients"
                                    className="text-xs"
                                />
                            </div>
                        </CardBody>
                    </Card>

                    {/* Products & Services Dynamic Tables */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="inventory_2" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    III. Business Activities &amp; Products Sold
                                </h3>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        products_services: {
                                            ...prev.products_services,
                                            business_activities: [
                                                ...prev.products_services.business_activities,
                                                { description: "", nic_code: "", turnover_percentage: 0 },
                                            ],
                                        },
                                    }))
                                }
                                className="text-xs gap-1">
                                <MaterialIcon name="add" size="xs" />
                                <span>Add Activity</span>
                            </Button>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-4">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-surface-container-low">
                                            <TableHead className="text-xs font-bold text-primary">Description of Main Activity</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-32">NIC Code</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-36 text-right">% of Turnover</TableHead>
                                            <TableHead className="w-16 text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {formData.products_services.business_activities.map((act, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Input
                                                        value={act.description}
                                                        onChange={(e) => {
                                                            const updated = [...formData.products_services.business_activities];
                                                            updated[idx].description = e.target.value;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                products_services: { ...prev.products_services, business_activities: updated },
                                                            }));
                                                        }}
                                                        placeholder="Activity description"
                                                        className="text-xs"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={act.nic_code}
                                                        onChange={(e) => {
                                                            const updated = [...formData.products_services.business_activities];
                                                            updated[idx].nic_code = e.target.value;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                products_services: { ...prev.products_services, business_activities: updated },
                                                            }));
                                                        }}
                                                        placeholder="NIC Code"
                                                        className="text-xs font-mono"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={act.turnover_percentage}
                                                        onChange={(e) => {
                                                            const updated = [...formData.products_services.business_activities];
                                                            updated[idx].turnover_percentage = Number(e.target.value) || 0;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                products_services: { ...prev.products_services, business_activities: updated },
                                                            }));
                                                        }}
                                                        className="text-xs font-mono text-right"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = formData.products_services.business_activities.filter(
                                                                (_, i) => i !== idx,
                                                            );
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                products_services: { ...prev.products_services, business_activities: updated },
                                                            }));
                                                        }}
                                                        className="text-error hover:bg-error-container/20 p-1 rounded cursor-pointer">
                                                        <MaterialIcon name="delete" size="xs" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* SUB-SECTION 2: Employees, Workers & Diversity */}
            {subSection === "employees" && (
                <div className="space-y-6">
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="groups" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    Workforce Breakdown by Gender (Employees vs Workers)
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] text-on-surface-variant uppercase">SEBI Statutory Table</span>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-4">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Enter headcount for Permanent Employees, Other Employees (Contractual/Trainees), Permanent Workers, and Other Workers. Total counts are automatically calculated.
                            </p>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-surface-container-low">
                                            <TableHead className="text-xs font-bold text-primary">Category</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-28 text-center">Male</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-28 text-center">Female</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-28 text-center">Other</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-32 text-center bg-surface-container">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Permanent Employees */}
                                        <TableRow>
                                            <TableCell className="text-xs font-semibold text-primary">
                                                Permanent Employees (A)
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.permanent_employees.male}
                                                    onChange={(e) => updateEmployeeCategory("permanent_employees", "male", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.permanent_employees.female}
                                                    onChange={(e) => updateEmployeeCategory("permanent_employees", "female", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.permanent_employees.other}
                                                    onChange={(e) => updateEmployeeCategory("permanent_employees", "other", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-bold text-xs bg-surface-container/40">
                                                {formData.employees.permanent_employees.total}
                                            </TableCell>
                                        </TableRow>

                                        {/* Other Employees */}
                                        <TableRow>
                                            <TableCell className="text-xs font-semibold text-primary">
                                                Other than Permanent Employees (B)
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.other_employees.male}
                                                    onChange={(e) => updateEmployeeCategory("other_employees", "male", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.other_employees.female}
                                                    onChange={(e) => updateEmployeeCategory("other_employees", "female", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.other_employees.other}
                                                    onChange={(e) => updateEmployeeCategory("other_employees", "other", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-bold text-xs bg-surface-container/40">
                                                {formData.employees.other_employees.total}
                                            </TableCell>
                                        </TableRow>

                                        {/* Permanent Workers */}
                                        <TableRow>
                                            <TableCell className="text-xs font-semibold text-primary">
                                                Permanent Workers (C)
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.permanent_workers.male}
                                                    onChange={(e) => updateEmployeeCategory("permanent_workers", "male", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.permanent_workers.female}
                                                    onChange={(e) => updateEmployeeCategory("permanent_workers", "female", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.permanent_workers.other}
                                                    onChange={(e) => updateEmployeeCategory("permanent_workers", "other", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-bold text-xs bg-surface-container/40">
                                                {formData.employees.permanent_workers.total}
                                            </TableCell>
                                        </TableRow>

                                        {/* Other Workers */}
                                        <TableRow>
                                            <TableCell className="text-xs font-semibold text-primary">
                                                Other than Permanent Workers (D)
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.other_workers.male}
                                                    onChange={(e) => updateEmployeeCategory("other_workers", "male", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.other_workers.female}
                                                    onChange={(e) => updateEmployeeCategory("other_workers", "female", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={formData.employees.other_workers.other}
                                                    onChange={(e) => updateEmployeeCategory("other_workers", "other", Number(e.target.value))}
                                                    className="text-xs text-center font-mono"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-bold text-xs bg-surface-container/40">
                                                {formData.employees.other_workers.total}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Differently Abled and Leadership Representation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-white shadow-2xs">
                            <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                                <h4 className="font-sans text-xs font-bold text-primary">Differently Abled Representation</h4>
                                <MaterialIcon name="accessible" size="sm" className="text-primary" />
                            </CardHeader>
                            <CardBody className="p-card-padding space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-on-surface">Differently Abled Employees</label>
                                        <Input
                                            type="number"
                                            value={formData.employees.differently_abled_employees.total}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    employees: {
                                                        ...prev.employees,
                                                        differently_abled_employees: {
                                                            ...prev.employees.differently_abled_employees,
                                                            total: Number(e.target.value) || 0,
                                                        },
                                                    },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-on-surface">Differently Abled Workers</label>
                                        <Input
                                            type="number"
                                            value={formData.employees.differently_abled_workers.total}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    employees: {
                                                        ...prev.employees,
                                                        differently_abled_workers: {
                                                            ...prev.employees.differently_abled_workers,
                                                            total: Number(e.target.value) || 0,
                                                        },
                                                    },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-white shadow-2xs">
                            <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                                <h4 className="font-sans text-xs font-bold text-primary">Women in Governance &amp; KMP</h4>
                                <MaterialIcon name="female" size="sm" className="text-primary" />
                            </CardHeader>
                            <CardBody className="p-card-padding space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-on-surface">Women on Board (%)</label>
                                        <Input
                                            type="number"
                                            value={formData.employees.women_in_board.percentage}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    employees: {
                                                        ...prev.employees,
                                                        women_in_board: {
                                                            ...prev.employees.women_in_board,
                                                            percentage: Number(e.target.value) || 0,
                                                        },
                                                    },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-on-surface">Women in KMP (%)</label>
                                        <Input
                                            type="number"
                                            value={formData.employees.women_in_kmp.percentage}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    employees: {
                                                        ...prev.employees,
                                                        women_in_kmp: {
                                                            ...prev.employees.women_in_kmp,
                                                            percentage: Number(e.target.value) || 0,
                                                        },
                                                    },
                                                }))
                                            }
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )}

            {/* SUB-SECTION 3: CSR & Stakeholder Grievances */}
            {subSection === "csr" && (
                <div className="space-y-6">
                    {/* CSR Details Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="volunteer_activism" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    I. Corporate Social Responsibility (Section 135 Companies Act)
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-on-surface">CSR Applicable:</span>
                                <input
                                    type="checkbox"
                                    checked={formData.csr_details.is_applicable}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            csr_details: { ...prev.csr_details, is_applicable: e.target.checked },
                                        }))
                                    }
                                    className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                />
                            </div>
                        </CardHeader>
                        {formData.csr_details.is_applicable && (
                            <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Annual Turnover (INR)</label>
                                    <Input
                                        type="number"
                                        value={formData.csr_details.turnover_inr ?? ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                csr_details: {
                                                    ...prev.csr_details,
                                                    turnover_inr: e.target.value ? Number(e.target.value) : null,
                                                },
                                            }))
                                        }
                                        placeholder="e.g. 1250000000"
                                        className="text-xs font-mono"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Net Worth (INR)</label>
                                    <Input
                                        type="number"
                                        value={formData.csr_details.net_worth_inr ?? ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                csr_details: {
                                                    ...prev.csr_details,
                                                    net_worth_inr: e.target.value ? Number(e.target.value) : null,
                                                },
                                            }))
                                        }
                                        placeholder="e.g. 4500000000"
                                        className="text-xs font-mono"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Total CSR Spend (INR)</label>
                                    <Input
                                        type="number"
                                        value={formData.csr_details.total_csr_spend_inr ?? ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                csr_details: {
                                                    ...prev.csr_details,
                                                    total_csr_spend_inr: e.target.value ? Number(e.target.value) : null,
                                                },
                                            }))
                                        }
                                        placeholder="e.g. 25000000"
                                        className="text-xs font-mono"
                                    />
                                </div>
                            </CardBody>
                        )}
                    </Card>

                    {/* Stakeholder Grievance Redressal Mechanism Table */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="feedback" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    II. Stakeholder Grievance Redressal Mechanisms
                                </h3>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        stakeholder_grievances: [
                                            ...prev.stakeholder_grievances,
                                            {
                                                stakeholder_group: "Other Stakeholders",
                                                has_mechanism: true,
                                                weblink: "",
                                                complaints_filed_count: 0,
                                                complaints_pending_count: 0,
                                                remarks: "",
                                            },
                                        ],
                                    }))
                                }
                                className="text-xs gap-1">
                                <MaterialIcon name="add" size="xs" />
                                <span>Add Group</span>
                            </Button>
                        </CardHeader>
                        <CardBody className="p-card-padding">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-surface-container-low">
                                            <TableHead className="text-xs font-bold text-primary">Stakeholder Group</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-24 text-center">Mechanism</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-40">Web Link</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-24 text-center">Filed</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-24 text-center">Pending</TableHead>
                                            <TableHead className="text-xs font-bold text-primary">Resolution Remarks</TableHead>
                                            <TableHead className="w-12 text-center">Del</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {formData.stakeholder_grievances.map((sg, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Input
                                                        value={sg.stakeholder_group}
                                                        onChange={(e) => {
                                                            const updated = [...formData.stakeholder_grievances];
                                                            updated[idx].stakeholder_group = e.target.value;
                                                            setFormData((prev) => ({ ...prev, stakeholder_grievances: updated }));
                                                        }}
                                                        className="text-xs font-semibold"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={sg.has_mechanism}
                                                        onChange={(e) => {
                                                            const updated = [...formData.stakeholder_grievances];
                                                            updated[idx].has_mechanism = e.target.checked;
                                                            setFormData((prev) => ({ ...prev, stakeholder_grievances: updated }));
                                                        }}
                                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={sg.weblink}
                                                        onChange={(e) => {
                                                            const updated = [...formData.stakeholder_grievances];
                                                            updated[idx].weblink = e.target.value;
                                                            setFormData((prev) => ({ ...prev, stakeholder_grievances: updated }));
                                                        }}
                                                        placeholder="URL"
                                                        className="text-xs"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={sg.complaints_filed_count}
                                                        onChange={(e) => {
                                                            const updated = [...formData.stakeholder_grievances];
                                                            updated[idx].complaints_filed_count = Number(e.target.value) || 0;
                                                            setFormData((prev) => ({ ...prev, stakeholder_grievances: updated }));
                                                        }}
                                                        className="text-xs text-center font-mono"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={sg.complaints_pending_count}
                                                        onChange={(e) => {
                                                            const updated = [...formData.stakeholder_grievances];
                                                            updated[idx].complaints_pending_count = Number(e.target.value) || 0;
                                                            setFormData((prev) => ({ ...prev, stakeholder_grievances: updated }));
                                                        }}
                                                        className="text-xs text-center font-mono"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={sg.remarks}
                                                        onChange={(e) => {
                                                            const updated = [...formData.stakeholder_grievances];
                                                            updated[idx].remarks = e.target.value;
                                                            setFormData((prev) => ({ ...prev, stakeholder_grievances: updated }));
                                                        }}
                                                        placeholder="Remarks"
                                                        className="text-xs"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = formData.stakeholder_grievances.filter((_, i) => i !== idx);
                                                            setFormData((prev) => ({ ...prev, stakeholder_grievances: updated }));
                                                        }}
                                                        className="text-error hover:bg-error-container/20 p-1 rounded cursor-pointer">
                                                        <MaterialIcon name="delete" size="xs" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}

