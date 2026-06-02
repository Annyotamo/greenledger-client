const accordionItems = [
    {
        id: "c1",
        title: "ESG reporting and GHG accounting: how to be audit ready",
        subtitle: "Continuous capture, evidence, and defensible outputs",
        body: (
            <>
                <p>
                    Focus on structured capture of activity data and attach verifiable evidence to every claim. audit
                    ready reporting requires traceable transformations and versioned exports auditors can follow.
                </p>
                <p className="mt-3">
                    Our approach builds immutable logging, reviewer approvals, and export formats that align with common
                    assurance workflows so audit time is spent on judgment not data-chasing.
                </p>
            </>
        ),
    },
    {
        id: "c2",
        title: "audit ready logging and evidence",
        subtitle: "Immutable trails, attachments, and auditor-friendly exports",
        body: (
            <>
                <p>
                    An append only logging model with linked evidence reduces auditor friction. Each activity record
                    records who submitted, who reviewed, and what evidence was attached all exportable alongside the
                    numbers.
                </p>
                <p className="mt-3">
                    This enables faster assurance cycles and increases confidence in reported totals across financial
                    and sustainability audiences.
                </p>
            </>
        ),
    },
    {
        id: "c3",
        title: "role based auth & approval workflows",
        subtitle: "Segregation of duties for reliable operational data",
        body: (
            <>
                <p>
                    Implement clear roles submitter, validator, approver and configurable approval queues. Activity
                    submissions can be rejected with comments and routed back for correction, preserving history.
                </p>
                <p className="mt-3">
                    These controls reduce accidental misreporting and provide governance evidence for audits and
                    executive reviews.
                </p>
            </>
        ),
    },
    {
        id: "c4",
        title: "Fuel, electricity & energy activities",
        subtitle: "Meters, invoices, normalization and exception handling",
        body: (
            <>
                <p>
                    Capture fuel and electricity activities at meter granularity or via invoices, normalize units, and
                    flag anomalies for review. Reconciliation helps you close the gap between operational records and
                    reported totals.
                </p>
                <p className="mt-3">
                    Built-in validators and mappings let operations teams resolve issues early while keeping the
                    accounting team confident in aggregated results.
                </p>
            </>
        ),
    },
];

import { SolutionsAccordion } from "@/components/landing/SolutionsAccordion";

export default function DeepDiveSection() {
    return (
        <section id="deep-dive" className="scroll-mt-24">
            <div className="mb-6 max-w-3xl">
                <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                    The longer read how we think about the problem
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                    Expand any topic for plain language context. This is the layer executives share with boards when
                    they need more than a feature list.
                </p>
            </div>
            <SolutionsAccordion items={accordionItems} />
        </section>
    );
}
