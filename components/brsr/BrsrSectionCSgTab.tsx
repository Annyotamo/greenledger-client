"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BRSRSectionCData } from "@/lib/brsr/types";
import { useSaveBrsrSectionC } from "@/lib/brsr/hooks";

export type SgPrincipleKey =
    | "sg-p1"
    | "sg-p2"
    | "sg-p3"
    | "sg-p4"
    | "sg-p5"
    | "sg-p7"
    | "sg-p8"
    | "sg-p9";

interface BrsrSectionCSgTabProps {
    reportingPeriodId: string;
    financialYearLabel: string;
    initialData: BRSRSectionCData | null;
    initialPrinciple?: SgPrincipleKey;
    onSaved?: () => void;
}

export function BrsrSectionCSgTab({
    reportingPeriodId,
    financialYearLabel,
    initialData,
    initialPrinciple = "sg-p1",
    onSaved,
}: BrsrSectionCSgTabProps) {
    const [selectedPrinciple, setSelectedPrinciple] = useState<SgPrincipleKey>(initialPrinciple);

    useEffect(() => {
        if (initialPrinciple) {
            setSelectedPrinciple(initialPrinciple);
        }
    }, [initialPrinciple]);

    const [formData, setFormData] = useState<BRSRSectionCData>(() => ({
        reporting_period_id: reportingPeriodId,
        financial_year_label: financialYearLabel,
        principle_1_ethics: {
            fines_penalties_inr: 0,
            anti_corruption_cases_count: 0,
            conflict_of_interest_complaints_count: 0,
            disciplinary_action_cases_count: 0,
            anti_bribery_training_coverage_percent: 95.0,
            ...initialData?.principle_1_ethics,
        },
        principle_2_products: {
            rd_capex_esg_percent: 8.5,
            lca_conducted_projects_count: 2,
            recycled_input_materials_percent: 18.2,
            epr_plan_implemented: true,
            sustainable_sourcing_percent: 45.0,
            ...initialData?.principle_2_products,
        },
        principle_3_employees: {
            health_and_safety_coverage_percent: 100.0,
            minimum_wages_compliant: true,
            maternity_benefits_availed_count: 12,
            paternity_benefits_availed_count: 8,
            unionized_workforce_percent: 35.0,
            median_safety_training_hours: 24.5,
            lost_time_injury_frequency_rate: 0.42,
            ...initialData?.principle_3_employees,
        },
        principle_4_stakeholders: {
            consultation_channels: "Annual vendor meets, town halls, investor calls",
            vulnerable_groups_identified: "Informal waste workers and migrant contract staff",
            vulnerable_groups_engagement_summary: "Provided health insurance and personal protective equipment",
            ...initialData?.principle_4_stakeholders,
        },
        principle_5_human_rights: {
            employees_trained_on_human_rights_percent: 90.0,
            minimum_wages_paid_percent: 100.0,
            discrimination_cases_count: 0,
            sexual_harassment_cases_count: 0,
            child_labor_cases_count: 0,
            forced_labor_cases_count: 0,
            ...initialData?.principle_5_human_rights,
        },
        principle_7_policy: {
            trade_association_memberships: ["CII", "FICCI", "Indian Chemical Council"],
            anti_competitive_conduct_cases_count: 0,
            public_policy_advocacy_summary: "Advocating for green hydrogen incentives and sustainable supply chain standards",
            ...initialData?.principle_7_policy,
        },
        principle_8_inclusive_growth: {
            social_impact_assessments_count: 1,
            resettlement_and_rehabilitation_cases_count: 0,
            direct_csr_beneficiaries_count: 15000,
            preferential_procurement_msme_percent: 28.5,
            local_sourcing_percent: 42.0,
            ...initialData?.principle_8_inclusive_growth,
        },
        principle_9_consumer_value: {
            data_privacy_complaints_count: 0,
            cyber_security_incidents_count: 0,
            product_recalls_count: 0,
            delivery_and_quality_complaints_count: 4,
            customer_satisfaction_survey_score: 4.6,
            cyber_security_policy_in_place: true,
            ...initialData?.principle_9_consumer_value,
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

    const saveMutation = useSaveBrsrSectionC();
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
            console.error("Failed to save Section C", err);
        }
    };

    const principlesList: { key: SgPrincipleKey; title: string; desc: string; icon: string }[] = [
        { key: "sg-p1", title: "P1: Ethics & Anti-Bribery", desc: "Fines, penalties & integrity training", icon: "gavel" },
        { key: "sg-p2", title: "P2: Sustainable Products", desc: "LCA, recycled inputs & EPR plans", icon: "precision_manufacturing" },
        { key: "sg-p3", title: "P3: Workforce Well-being", desc: "Safety LTIFR & minimum wage compliance", icon: "health_and_safety" },
        { key: "sg-p4", title: "P4: Stakeholder Engagement", desc: "Consultation & vulnerable groups", icon: "record_voice_over" },
        { key: "sg-p5", title: "P5: Human Rights", desc: "POSH, non-discrimination & training", icon: "diversity_3" },
        { key: "sg-p7", title: "P7: Public Policy", desc: "Trade associations & advocacy", icon: "campaign" },
        { key: "sg-p8", title: "P8: Inclusive Growth", desc: "MSME sourcing & social impact", icon: "handshake" },
        { key: "sg-p9", title: "P9: Consumer Value", desc: "Data privacy & cybersecurity", icon: "security" },
    ];

    return (
        <div className="space-y-6">
            {/* Header Strip & Sub-navigation */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="active" size="sm">
                            SEBI Annexure II • Section C
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">Social &amp; Governance (pp. 31–41)</span>
                    </div>
                    <h2 className="text-xl font-bold text-primary font-display mt-1">
                        Social, Ethical &amp; Governance Statutory Disclosures
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
                        <span>{saveMutation.isPending ? "Saving..." : "Save Disclosures"}</span>
                    </Button>
                </div>
            </div>

            {/* Principles Switcher Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low p-1.5">
                {principlesList.map((p) => {
                    const isSelected = selectedPrinciple === p.key;
                    return (
                        <button
                            key={p.key}
                            type="button"
                            onClick={() => setSelectedPrinciple(p.key)}
                            className={`flex flex-col items-center justify-center p-2 rounded-md text-center transition-all cursor-pointer ${
                                isSelected
                                    ? "bg-white text-primary shadow-2xs font-bold"
                                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                            }`}>
                            <MaterialIcon name={p.icon} size="sm" className={isSelected ? "text-primary" : "text-on-surface-variant"} />
                            <span className="font-sans text-[11px] font-semibold mt-1 truncate w-full">
                                {p.title.split(":")[0]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* PRINCIPLE 1: Ethics, Bribery & Fines */}
            {selectedPrinciple === "sg-p1" && (
                <Card className="bg-white shadow-2xs">
                    <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="gavel" size="sm" className="text-primary" />
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Principle 1: Ethics, Transparency &amp; Anti-Corruption
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase">Essential Indicators</span>
                    </CardHeader>
                    <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Total Fines &amp; Penalties Paid (INR)</label>
                            <Input
                                type="number"
                                value={formData.principle_1_ethics.fines_penalties_inr}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_1_ethics: {
                                            ...prev.principle_1_ethics,
                                            fines_penalties_inr: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Anti-Corruption / Bribery Cases Count</label>
                            <Input
                                type="number"
                                value={formData.principle_1_ethics.anti_corruption_cases_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_1_ethics: {
                                            ...prev.principle_1_ethics,
                                            anti_corruption_cases_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Conflict of Interest Complaints</label>
                            <Input
                                type="number"
                                value={formData.principle_1_ethics.conflict_of_interest_complaints_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_1_ethics: {
                                            ...prev.principle_1_ethics,
                                            conflict_of_interest_complaints_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Disciplinary Action Cases</label>
                            <Input
                                type="number"
                                value={formData.principle_1_ethics.disciplinary_action_cases_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_1_ethics: {
                                            ...prev.principle_1_ethics,
                                            disciplinary_action_cases_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-semibold text-on-surface">Anti-Bribery Training Coverage (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_1_ethics.anti_bribery_training_coverage_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_1_ethics: {
                                            ...prev.principle_1_ethics,
                                            anti_bribery_training_coverage_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* PRINCIPLE 2: Sustainable Products & LCA */}
            {selectedPrinciple === "sg-p2" && (
                <Card className="bg-white shadow-2xs">
                    <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="precision_manufacturing" size="sm" className="text-primary" />
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Principle 2: Sustainable Product Lifecycles &amp; Sourcing
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase">EPR &amp; LCA Metrics</span>
                    </CardHeader>
                    <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">R&amp;D / Capex in ESG (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_2_products.rd_capex_esg_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_2_products: {
                                            ...prev.principle_2_products,
                                            rd_capex_esg_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">LCA Conducted Projects Count</label>
                            <Input
                                type="number"
                                value={formData.principle_2_products.lca_conducted_projects_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_2_products: {
                                            ...prev.principle_2_products,
                                            lca_conducted_projects_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Recycled Input Materials (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_2_products.recycled_input_materials_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_2_products: {
                                            ...prev.principle_2_products,
                                            recycled_input_materials_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Sustainable Sourcing (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_2_products.sustainable_sourcing_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_2_products: {
                                            ...prev.principle_2_products,
                                            sustainable_sourcing_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1 flex items-center justify-between rounded-lg border border-outline-variant p-3 mt-4 sm:col-span-2">
                            <div>
                                <p className="text-xs font-semibold text-primary">Extended Producer Responsibility (EPR) Plan</p>
                                <p className="text-[11px] text-on-surface-variant">Whether EPR collection &amp; recycling is implemented</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.principle_2_products.epr_plan_implemented}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_2_products: {
                                            ...prev.principle_2_products,
                                            epr_plan_implemented: e.target.checked,
                                        },
                                    }))
                                }
                                className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* PRINCIPLE 3: Employee Well-being & Safety */}
            {selectedPrinciple === "sg-p3" && (
                <Card className="bg-white shadow-2xs">
                    <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="health_and_safety" size="sm" className="text-primary" />
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Principle 3: Employee Well-being, Safety &amp; Benefits
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase">LTIFR &amp; Training</span>
                    </CardHeader>
                    <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Health &amp; Safety Coverage (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_3_employees.health_and_safety_coverage_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_3_employees: {
                                            ...prev.principle_3_employees,
                                            health_and_safety_coverage_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Lost Time Injury Frequency (LTIFR)</label>
                            <Input
                                type="number"
                                value={formData.principle_3_employees.lost_time_injury_frequency_rate}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_3_employees: {
                                            ...prev.principle_3_employees,
                                            lost_time_injury_frequency_rate: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Median Safety Training Hours</label>
                            <Input
                                type="number"
                                value={formData.principle_3_employees.median_safety_training_hours}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_3_employees: {
                                            ...prev.principle_3_employees,
                                            median_safety_training_hours: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Maternity Benefits Availed</label>
                            <Input
                                type="number"
                                value={formData.principle_3_employees.maternity_benefits_availed_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_3_employees: {
                                            ...prev.principle_3_employees,
                                            maternity_benefits_availed_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Paternity Benefits Availed</label>
                            <Input
                                type="number"
                                value={formData.principle_3_employees.paternity_benefits_availed_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_3_employees: {
                                            ...prev.principle_3_employees,
                                            paternity_benefits_availed_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Unionized Workforce (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_3_employees.unionized_workforce_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_3_employees: {
                                            ...prev.principle_3_employees,
                                            unionized_workforce_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* PRINCIPLE 4: Stakeholder Engagement */}
            {selectedPrinciple === "sg-p4" && (
                <Card className="bg-white shadow-2xs">
                    <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="record_voice_over" size="sm" className="text-primary" />
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Principle 4: Stakeholder Engagement &amp; Vulnerable Groups
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className="p-card-padding space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Consultation Channels Used</label>
                            <Input
                                value={formData.principle_4_stakeholders.consultation_channels}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_4_stakeholders: {
                                            ...prev.principle_4_stakeholders,
                                            consultation_channels: e.target.value,
                                        },
                                    }))
                                }
                                placeholder="Townhalls, vendor meets, surveys, open houses"
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Vulnerable Groups Identified</label>
                            <Input
                                value={formData.principle_4_stakeholders.vulnerable_groups_identified}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_4_stakeholders: {
                                            ...prev.principle_4_stakeholders,
                                            vulnerable_groups_identified: e.target.value,
                                        },
                                    }))
                                }
                                placeholder="Informal workers, contract staff, local indigenous communities"
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Engagement Summary</label>
                            <textarea
                                rows={3}
                                value={formData.principle_4_stakeholders.vulnerable_groups_engagement_summary}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_4_stakeholders: {
                                            ...prev.principle_4_stakeholders,
                                            vulnerable_groups_engagement_summary: e.target.value,
                                        },
                                    }))
                                }
                                placeholder="Details of support and engagement provided"
                                className="w-full rounded-lg border border-outline-variant bg-white p-3 font-sans text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* PRINCIPLE 5: Human Rights */}
            {selectedPrinciple === "sg-p5" && (
                <Card className="bg-white shadow-2xs">
                    <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="diversity_3" size="sm" className="text-primary" />
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Principle 5: Human Rights Compliance &amp; Due Diligence
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase">Zero Tolerance</span>
                    </CardHeader>
                    <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Trained on Human Rights (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_5_human_rights.employees_trained_on_human_rights_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_5_human_rights: {
                                            ...prev.principle_5_human_rights,
                                            employees_trained_on_human_rights_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Discrimination Cases</label>
                            <Input
                                type="number"
                                value={formData.principle_5_human_rights.discrimination_cases_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_5_human_rights: {
                                            ...prev.principle_5_human_rights,
                                            discrimination_cases_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Sexual Harassment Cases (POSH)</label>
                            <Input
                                type="number"
                                value={formData.principle_5_human_rights.sexual_harassment_cases_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_5_human_rights: {
                                            ...prev.principle_5_human_rights,
                                            sexual_harassment_cases_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Child Labor Cases</label>
                            <Input
                                type="number"
                                value={formData.principle_5_human_rights.child_labor_cases_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_5_human_rights: {
                                            ...prev.principle_5_human_rights,
                                            child_labor_cases_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Forced / Involuntary Labor Cases</label>
                            <Input
                                type="number"
                                value={formData.principle_5_human_rights.forced_labor_cases_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_5_human_rights: {
                                            ...prev.principle_5_human_rights,
                                            forced_labor_cases_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* PRINCIPLE 7: Public Policy & Advocacy */}
            {selectedPrinciple === "sg-p7" && (
                <Card className="bg-white shadow-2xs">
                    <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="campaign" size="sm" className="text-primary" />
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Principle 7: Public and Regulatory Policy Advocacy
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className="p-card-padding space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Trade Association Memberships</label>
                            <Input
                                value={formData.principle_7_policy.trade_association_memberships.join(", ")}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_7_policy: {
                                            ...prev.principle_7_policy,
                                            trade_association_memberships: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                                        },
                                    }))
                                }
                                placeholder="CII, FICCI, ASSOCHAM"
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Public Policy Advocacy Summary</label>
                            <textarea
                                rows={3}
                                value={formData.principle_7_policy.public_policy_advocacy_summary}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_7_policy: {
                                            ...prev.principle_7_policy,
                                            public_policy_advocacy_summary: e.target.value,
                                        },
                                    }))
                                }
                                placeholder="Advocacy positions on clean energy transition, carbon markets..."
                                className="w-full rounded-lg border border-outline-variant bg-white p-3 font-sans text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* PRINCIPLE 8: Inclusive Growth & Social Impact */}
            {selectedPrinciple === "sg-p8" && (
                <Card className="bg-white shadow-2xs">
                    <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="handshake" size="sm" className="text-primary" />
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Principle 8: Inclusive Growth, Social Impact &amp; Local Procurement
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase">MSME &amp; Community</span>
                    </CardHeader>
                    <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Preferential MSME Procurement (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_8_inclusive_growth.preferential_procurement_msme_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_8_inclusive_growth: {
                                            ...prev.principle_8_inclusive_growth,
                                            preferential_procurement_msme_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Local Sourcing (%)</label>
                            <Input
                                type="number"
                                value={formData.principle_8_inclusive_growth.local_sourcing_percent}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_8_inclusive_growth: {
                                            ...prev.principle_8_inclusive_growth,
                                            local_sourcing_percent: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Direct CSR Beneficiaries Count</label>
                            <Input
                                type="number"
                                value={formData.principle_8_inclusive_growth.direct_csr_beneficiaries_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_8_inclusive_growth: {
                                            ...prev.principle_8_inclusive_growth,
                                            direct_csr_beneficiaries_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* PRINCIPLE 9: Consumer Value & Privacy */}
            {selectedPrinciple === "sg-p9" && (
                <Card className="bg-white shadow-2xs">
                    <CardHeader className="flex items-center justify-between border-b border-outline-variant px-card-padding py-3 bg-surface-container-lowest">
                        <div className="flex items-center gap-2">
                            <MaterialIcon name="security" size="sm" className="text-primary" />
                            <h3 className="font-sans text-sm font-bold text-primary">
                                Principle 9: Consumer Value, Data Privacy &amp; Cybersecurity
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase">Customer Protection</span>
                    </CardHeader>
                    <CardBody className="p-card-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Data Privacy Complaints</label>
                            <Input
                                type="number"
                                value={formData.principle_9_consumer_value.data_privacy_complaints_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_9_consumer_value: {
                                            ...prev.principle_9_consumer_value,
                                            data_privacy_complaints_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Cyber Security Incidents</label>
                            <Input
                                type="number"
                                value={formData.principle_9_consumer_value.cyber_security_incidents_count}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_9_consumer_value: {
                                            ...prev.principle_9_consumer_value,
                                            cyber_security_incidents_count: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-on-surface">Customer Satisfaction Score (out of 5)</label>
                            <Input
                                type="number"
                                value={formData.principle_9_consumer_value.customer_satisfaction_survey_score}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_9_consumer_value: {
                                            ...prev.principle_9_consumer_value,
                                            customer_satisfaction_survey_score: Number(e.target.value) || 0,
                                        },
                                    }))
                                }
                                className="text-xs font-mono"
                            />
                        </div>

                        <div className="space-y-1 flex items-center justify-between rounded-lg border border-outline-variant p-3 mt-2 sm:col-span-3">
                            <div>
                                <p className="text-xs font-semibold text-primary">Cybersecurity &amp; Data Privacy Policy</p>
                                <p className="text-[11px] text-on-surface-variant">Formal ISO 27001 / DPDP Act compliant cybersecurity policy documented</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.principle_9_consumer_value.cyber_security_policy_in_place}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        principle_9_consumer_value: {
                                            ...prev.principle_9_consumer_value,
                                            cyber_security_policy_in_place: e.target.checked,
                                        },
                                    }))
                                }
                                className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}

