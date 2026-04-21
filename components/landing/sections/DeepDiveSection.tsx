const accordionItems = [
    {
        id: "c1",
        title: "Why ESG reporting is now a board level program",
        subtitle: "Legal expectations, CSRD, ESRS, and what “good” looks like",
        body: (
            <>
                <p>
                    Companies particularly those exposed to European rules face mandatory reporting on climate and social
                    topics. Frameworks like CSRD and the ESRS set expectations for granularity, comparability, and
                    assurance readiness.
                </p>
                <p className="mt-3">
                    GreenLedger is built to operationalize that workload: governed data collection, controlled
                    transformations into disclosure formats, and clear ownership between sustainability, finance, and
                    legal reviewers.
                </p>
            </>
        ),
    },
    {
        id: "c2",
        title: "Carbon accounting that matches how your business actually runs",
        subtitle: "Scopes, activity data, and continuous improvement",
        body: (
            <>
                <p>
                    A credible footprint is more than a single annual number. It is a living model of energy, travel,
                    purchased goods, logistics, and where relevant customer use and end-of-life impacts.
                </p>
                <p className="mt-3">
                    GreenLedger combines calculators, import paths for utility and ERP extracts, and supplier-sourced
                    updates so your inventory matures quarter over quarter.
                </p>
            </>
        ),
    },
    {
        id: "c3",
        title: "Supply chain traceability that end customers can experience",
        subtitle: "QR journeys, provenance, and responsible production stories",
        body: (
            <>
                <p>
                    Traceability is the bridge between compliance data and brand trust. When someone scans a QR code,
                    they should see a coherent story: where materials originated, which facilities transformed them, and
                    what criteria were met along the way.
                </p>
                <p className="mt-3">
                    GreenLedger links internal BOMs and supplier graphs to consumer-safe narratives. Procurement teams
                    keep the detailed evidence; marketing teams publish what is accurate and approved.
                </p>
            </>
        ),
    },
    {
        id: "c4",
        title: "Implementation: start narrow, expand with confidence",
        subtitle: "Typical rollout paths for mixed maturity organizations",
        body: (
            <>
                <p>
                    Most customers do not flip every module on day one. A pragmatic sequence is to stabilize reporting
                    and data governance, extend carbon accounting into the highest-impact Scope 3 categories, then layer
                    traceability on hero SKUs or regions.
                </p>
                <p className="mt-3">
                    GreenLedger’s modules share reference data so each phase compounds instead of creating another silo.
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
                    Expand any topic for plain-language context. This is the layer executives share with boards when
                    they need more than a feature list.
                </p>
            </div>
            <SolutionsAccordion items={accordionItems} />
        </section>
    );
}

