"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type {
    BRSRSectionBData,
    BRSRPolicyMatrixItem,
    BRSRCommitmentGoal,
} from "@/lib/brsr/types";
import { useSaveBrsrSectionB } from "@/lib/brsr/hooks";

interface BrsrSectionBTabProps {
    reportingPeriodId: string;
    financialYearLabel: string;
    initialData: BRSRSectionBData | null;
    initialSubSection?: "policy" | "governance";
    onSaved?: () => void;
}

const DEFAULT_NGRBC_POLICIES: BRSRPolicyMatrixItem[] = [
    {
        principle_code: "P1",
        principle_name: "Ethics, Transparency and Accountability",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: true,
    },
    {
        principle_code: "P2",
        principle_name: "Product Lifecycle Sustainability",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: true,
    },
    {
        principle_code: "P3",
        principle_name: "Employee Well-being",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: true,
    },
    {
        principle_code: "P4",
        principle_name: "Stakeholder Engagement",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: true,
    },
    {
        principle_code: "P5",
        principle_name: "Human Rights",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: true,
    },
    {
        principle_code: "P6",
        principle_name: "Environmental Stewardship",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: true,
    },
    {
        principle_code: "P7",
        principle_name: "Public and Regulatory Policy",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: false,
    },
    {
        principle_code: "P8",
        principle_name: "Inclusive Growth and Equitable Development",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: true,
    },
    {
        principle_code: "P9",
        principle_name: "Consumer Value and Responsibility",
        has_policy: true,
        board_approved: true,
        web_link: "",
        translated_into_procedures: true,
        value_chain_adheres: true,
    },
];

export function BrsrSectionBTab({
    reportingPeriodId,
    financialYearLabel,
    initialData,
    initialSubSection = "policy",
    onSaved,
}: BrsrSectionBTabProps) {
    const [subSection, setSubSection] = useState<"policy" | "governance">(initialSubSection);

    useEffect(() => {
        if (initialSubSection) {
            setSubSection(initialSubSection);
        }
    }, [initialSubSection]);

    const [formData, setFormData] = useState<BRSRSectionBData>(() => ({
        reporting_period_id: reportingPeriodId,
        financial_year_label: financialYearLabel,
        policy_matrix: initialData?.policy_matrix?.length ? initialData.policy_matrix : DEFAULT_NGRBC_POLICIES,
        certifications_and_standards: initialData?.certifications_and_standards || [
            "ISO 14001:2015",
            "ISO 45001:2018",
            "ISO 9001:2015",
        ],
        commitments_and_goals: initialData?.commitments_and_goals || [
            {
                goal_statement: "Reduce Scope 1 & 2 carbon intensity by 30% by 2030 against FY22 baseline",
                defined_timeline: "2030",
                progress_status: "On Track: Achieved 12% reduction by FY25",
                reasons_if_delayed: null,
            },
        ],
        governance_leadership: {
            director_statement: "We are steadfast in integrating sustainability into core operational models...",
            highest_authority_name: "",
            highest_authority_din: "",
            highest_authority_designation: "Managing Director & CEO",
            has_sustainability_committee: true,
            sustainability_committee_details: "Board ESG Committee meets quarterly chaired by Independent Director",
            ...initialData?.governance_leadership,
        },
        review_and_oversight: {
            policy_review_body: "Board ESG Committee",
            policy_review_frequency: "Annually",
            statutory_compliance_review_frequency: "Quarterly",
            ...initialData?.review_and_oversight,
        },
        independent_evaluation: {
            has_independent_evaluation: true,
            agency_name: "KPMG India Assurance Services",
            principles_assessed: "Principles 1, 3, and 6",
            evaluation_brief: "Limited assurance over GHG Scope 1/2 and Safety LTIFR metrics",
            ...initialData?.independent_evaluation,
        },
        status: initialData?.status || "draft",
    }));

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

    const saveMutation = useSaveBrsrSectionB();
    const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
    const [newCert, setNewCert] = useState("");

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
            console.error("Failed to save Section B", err);
        }
    };

    const updatePolicyItem = (index: number, field: keyof BRSRPolicyMatrixItem, value: any) => {
        setFormData((prev) => {
            const updated = [...prev.policy_matrix];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return {
                ...prev,
                policy_matrix: updated,
            };
        });
    };

    const addCertification = () => {
        if (!newCert.trim()) return;
        setFormData((prev) => ({
            ...prev,
            certifications_and_standards: [...prev.certifications_and_standards, newCert.trim()],
        }));
        setNewCert("");
    };

    const removeCertification = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            certifications_and_standards: prev.certifications_and_standards.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header Strip */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="active" size="sm">
                            SEBI Annexure II • Section B
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">Management &amp; Process (pp. 15–18)</span>
                    </div>
                    <h2 className="text-xl font-bold text-primary font-display mt-1">
                        Management, Policy Matrix &amp; Governance Disclosures
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
                        <span>{saveMutation.isPending ? "Saving..." : "Save Section B"}</span>
                    </Button>
                </div>
            </div>

            {/* Sub-section Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low p-1">
                <button
                    type="button"
                    onClick={() => setSubSection("policy")}
                    className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "policy"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="table_chart" size="xs" />
                    <span>NGRBC Principles 1–9 Policy Matrix</span>
                </button>
                <button
                    type="button"
                    onClick={() => setSubSection("governance")}
                    className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-sans font-medium transition-all cursor-pointer ${
                        subSection === "governance"
                            ? "bg-white text-primary shadow-2xs font-semibold"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}>
                    <MaterialIcon name="account_balance" size="xs" />
                    <span>Governance, Oversight &amp; Review</span>
                </button>
            </div>

            {/* SUB-SECTION 1: Policy Matrix */}
            {subSection === "policy" && (
                <div className="space-y-6">
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="rule" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    National Guidelines for Responsible Business Conduct (NGRBC) Policy Matrix
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] text-on-surface-variant uppercase">
                                Principles 1 to 9 Statutory Table
                            </span>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-4">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Formulate whether your entity has adopted formal policies for each of the 9 NGRBC principles, whether policies are approved by the Board, provided as public web links, translated into operational procedures, and extended to value chain partners.
                            </p>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-surface-container-low">
                                            <TableHead className="text-xs font-bold text-primary w-14">Code</TableHead>
                                            <TableHead className="text-xs font-bold text-primary">NGRBC Principle</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-24 text-center">Has Policy</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-24 text-center">Board Apprv.</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-48">Policy Web Link</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-24 text-center">Procedures</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-24 text-center">Value Chain</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {formData.policy_matrix.map((p, idx) => (
                                            <TableRow key={p.principle_code} className="hover:bg-surface-container-low/40">
                                                <TableCell className="font-mono text-xs font-bold text-primary">
                                                    {p.principle_code}
                                                </TableCell>
                                                <TableCell className="text-xs font-medium text-on-surface">
                                                    {p.principle_name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={p.has_policy}
                                                        onChange={(e) => updatePolicyItem(idx, "has_policy", e.target.checked)}
                                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={p.board_approved}
                                                        onChange={(e) => updatePolicyItem(idx, "board_approved", e.target.checked)}
                                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={p.web_link}
                                                        onChange={(e) => updatePolicyItem(idx, "web_link", e.target.value)}
                                                        placeholder="https://company.com/policy"
                                                        className="text-xs"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={p.translated_into_procedures}
                                                        onChange={(e) =>
                                                            updatePolicyItem(idx, "translated_into_procedures", e.target.checked)
                                                        }
                                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={p.value_chain_adheres}
                                                        onChange={(e) => updatePolicyItem(idx, "value_chain_adheres", e.target.checked)}
                                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Commitments & Specific Goals Table */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="flag" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    Specific Commitments, Targets &amp; Achieved Progress
                                </h3>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        commitments_and_goals: [
                                            ...prev.commitments_and_goals,
                                            {
                                                goal_statement: "",
                                                defined_timeline: "2030",
                                                progress_status: "On Track",
                                                reasons_if_delayed: null,
                                            },
                                        ],
                                    }))
                                }
                                className="text-xs gap-1">
                                <MaterialIcon name="add" size="xs" />
                                <span>Add Target</span>
                            </Button>
                        </CardHeader>
                        <CardBody className="p-card-padding">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-surface-container-low">
                                            <TableHead className="text-xs font-bold text-primary">Defined Target / Commitment Statement</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-28">Timeline</TableHead>
                                            <TableHead className="text-xs font-bold text-primary w-64">Achieved Progress Status</TableHead>
                                            <TableHead className="w-12 text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {formData.commitments_and_goals.map((goal, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Input
                                                        value={goal.goal_statement}
                                                        onChange={(e) => {
                                                            const updated = [...formData.commitments_and_goals];
                                                            updated[idx].goal_statement = e.target.value;
                                                            setFormData((prev) => ({ ...prev, commitments_and_goals: updated }));
                                                        }}
                                                        placeholder="e.g. Achieve Net Zero Scope 1 & 2 emissions by 2040"
                                                        className="text-xs"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={goal.defined_timeline}
                                                        onChange={(e) => {
                                                            const updated = [...formData.commitments_and_goals];
                                                            updated[idx].defined_timeline = e.target.value;
                                                            setFormData((prev) => ({ ...prev, commitments_and_goals: updated }));
                                                        }}
                                                        placeholder="2030"
                                                        className="text-xs font-mono"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={goal.progress_status}
                                                        onChange={(e) => {
                                                            const updated = [...formData.commitments_and_goals];
                                                            updated[idx].progress_status = e.target.value;
                                                            setFormData((prev) => ({ ...prev, commitments_and_goals: updated }));
                                                        }}
                                                        placeholder="e.g. On track, 18% achieved"
                                                        className="text-xs"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = formData.commitments_and_goals.filter((_, i) => i !== idx);
                                                            setFormData((prev) => ({ ...prev, commitments_and_goals: updated }));
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

            {/* SUB-SECTION 2: Governance, Leadership & Review */}
            {subSection === "governance" && (
                <div className="space-y-6">
                    {/* Governance Leadership Card */}
                    <Card className="bg-white shadow-2xs">
                        <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="account_balance" size="sm" className="text-primary" />
                                <h3 className="font-sans text-sm font-bold text-primary">
                                    I. Governance, Leadership Statement &amp; Oversight Cadence
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] text-on-surface-variant uppercase">Board Oversight</span>
                        </CardHeader>
                        <CardBody className="p-card-padding space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-on-surface">Director's Statement on Sustainability</label>
                                <textarea
                                    rows={3}
                                    value={formData.governance_leadership.director_statement}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            governance_leadership: {
                                                ...prev.governance_leadership,
                                                director_statement: e.target.value,
                                            },
                                        }))
                                    }
                                    placeholder="Enter executive statement from Managing Director / Board Chairman..."
                                    className="w-full rounded-lg border border-outline-variant bg-white p-3 font-sans text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Highest Authority Name</label>
                                    <Input
                                        value={formData.governance_leadership.highest_authority_name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                governance_leadership: {
                                                    ...prev.governance_leadership,
                                                    highest_authority_name: e.target.value,
                                                },
                                            }))
                                        }
                                        placeholder="Full Name"
                                        className="text-xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Director DIN (8-Digit)</label>
                                    <Input
                                        value={formData.governance_leadership.highest_authority_din}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                governance_leadership: {
                                                    ...prev.governance_leadership,
                                                    highest_authority_din: e.target.value,
                                                },
                                            }))
                                        }
                                        placeholder="01234567"
                                        className="text-xs font-mono"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Designation</label>
                                    <Input
                                        value={formData.governance_leadership.highest_authority_designation}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                governance_leadership: {
                                                    ...prev.governance_leadership,
                                                    highest_authority_designation: e.target.value,
                                                },
                                            }))
                                        }
                                        placeholder="Managing Director & CEO"
                                        className="text-xs"
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-primary">
                                        Dedicated Board Sustainability / ESG Committee:
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={formData.governance_leadership.has_sustainability_committee}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                governance_leadership: {
                                                    ...prev.governance_leadership,
                                                    has_sustainability_committee: e.target.checked,
                                                },
                                            }))
                                        }
                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                    />
                                </div>
                                {formData.governance_leadership.has_sustainability_committee && (
                                    <Input
                                        value={formData.governance_leadership.sustainability_committee_details}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                governance_leadership: {
                                                    ...prev.governance_leadership,
                                                    sustainability_committee_details: e.target.value,
                                                },
                                            }))
                                        }
                                        placeholder="Details of committee composition and meeting frequency"
                                        className="text-xs bg-white"
                                    />
                                )}
                            </div>

                            {/* Review and Oversight Frequency */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Policy Review Body</label>
                                    <Input
                                        value={formData.review_and_oversight.policy_review_body}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                review_and_oversight: {
                                                    ...prev.review_and_oversight,
                                                    policy_review_body: e.target.value,
                                                },
                                            }))
                                        }
                                        placeholder="e.g. Board ESG Committee"
                                        className="text-xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Policy Review Frequency</label>
                                    <Input
                                        value={formData.review_and_oversight.policy_review_frequency}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                review_and_oversight: {
                                                    ...prev.review_and_oversight,
                                                    policy_review_frequency: e.target.value,
                                                },
                                            }))
                                        }
                                        placeholder="Annually"
                                        className="text-xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-on-surface">Compliance Review Frequency</label>
                                    <Input
                                        value={formData.review_and_oversight.statutory_compliance_review_frequency}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                review_and_oversight: {
                                                    ...prev.review_and_oversight,
                                                    statutory_compliance_review_frequency: e.target.value,
                                                },
                                            }))
                                        }
                                        placeholder="Quarterly"
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Certifications and Independent Evaluation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Certifications */}
                        <Card className="bg-white shadow-2xs">
                            <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                                <h4 className="font-sans text-xs font-bold text-primary">
                                    Certifications, Audits &amp; Standards
                                </h4>
                                <MaterialIcon name="verified" size="sm" className="text-primary" />
                            </CardHeader>
                            <CardBody className="p-card-padding space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {formData.certifications_and_standards.map((cert, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 rounded-md border border-outline-variant bg-surface-container px-2.5 py-1 text-xs font-medium text-primary">
                                            <span>{cert}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeCertification(idx)}
                                                className="text-on-surface-variant hover:text-error cursor-pointer">
                                                <MaterialIcon name="close" size="xs" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <Input
                                        value={newCert}
                                        onChange={(e) => setNewCert(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addCertification();
                                            }
                                        }}
                                        placeholder="e.g. ISO 14001:2015, SA 8000"
                                        className="text-xs"
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={addCertification}
                                        className="text-xs shrink-0">
                                        Add
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Independent Evaluation */}
                        <Card className="bg-white shadow-2xs">
                            <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                                <h4 className="font-sans text-xs font-bold text-primary">
                                    Independent Third-Party Assurance
                                </h4>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-medium text-on-surface">Assurance:</span>
                                    <input
                                        type="checkbox"
                                        checked={formData.independent_evaluation.has_independent_evaluation}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                independent_evaluation: {
                                                    ...prev.independent_evaluation,
                                                    has_independent_evaluation: e.target.checked,
                                                },
                                            }))
                                        }
                                        className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                                    />
                                </div>
                            </CardHeader>
                            <CardBody className="p-card-padding space-y-3">
                                {formData.independent_evaluation.has_independent_evaluation ? (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface">Assurance Agency Name</label>
                                            <Input
                                                value={formData.independent_evaluation.agency_name}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        independent_evaluation: {
                                                            ...prev.independent_evaluation,
                                                            agency_name: e.target.value,
                                                        },
                                                    }))
                                                }
                                                placeholder="e.g. KPMG India Assurance Services"
                                                className="text-xs"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-semibold text-on-surface">Principles / Scope Assessed</label>
                                            <Input
                                                value={formData.independent_evaluation.principles_assessed}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        independent_evaluation: {
                                                            ...prev.independent_evaluation,
                                                            principles_assessed: e.target.value,
                                                        },
                                                    }))
                                                }
                                                placeholder="e.g. Principles 1, 3, and 6 Scope 1/2 GHG"
                                                className="text-xs"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-on-surface-variant italic">
                                        No independent third-party assurance has been conducted for this period.
                                    </p>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

