export interface Block {
    type: "paragraph" | "bullets" | "quote" | "callout" | "image";
    text?: string;
    items?: string[];
    src?: string;
    caption?: string;
    title?: string;
}

export interface Section {
    id: string;
    heading: string;
    blocks: Block[];
}

export interface Article {
    slug: string;
    title: string;
    published: string;
    category: string;
    readTime: string;
    author: string;
    excerpt: string;
    coverImage: string;
    sections: Section[];
}

export const INSIGHTS_ARTICLES: Article[] = [
    {
        slug: "why-reliable-esg-reporting-requires-systems-not-prompts",
        title: "Why Reliable ESG Reporting Requires Systems, Not Prompts",
        published: "June 2026",
        category: "ESG Reporting & Carbon Accounting",
        readTime: "18 min read",
        author: "GreenLedger Research Team",
        excerpt: "As ESG reporting transitions to a regulated business function, organizations are discovering that generating words with AI is easy. Generating trusted numbers is the real challenge.",
        coverImage: "/insights/demo_insight_image.jpg",
        sections: [
            {
                id: "defensible-sustainability-report",
                heading: "A Sustainability Report Is Easy to Generate. A Defensible Sustainability Report Is Not.",
                blocks: [
                    {
                        type: "paragraph",
                        text: "Over the past two years, artificial intelligence has transformed how organizations create content."
                    },
                    {
                        type: "paragraph",
                        text: "Today, a sustainability manager can open an AI tool, type a few prompts, upload a spreadsheet, and receive what appears to be a professionally written ESG report within minutes. The report may include executive summaries, emissions analysis, sustainability commitments, risk assessments, and even recommendations for future action."
                    },
                    {
                        type: "paragraph",
                        text: "For organizations that have historically spent weeks preparing sustainability disclosures, this feels revolutionary."
                    },
                    {
                        type: "paragraph",
                        text: "But there is a question that every sustainability professional, auditor, investor, and regulator should ask:"
                    },
                    {
                        type: "quote",
                        text: "Can a report be considered reliable simply because it looks professional?"
                    },
                    {
                        type: "paragraph",
                        text: "The answer is increasingly becoming no."
                    },
                    {
                        type: "paragraph",
                        text: "As ESG reporting evolves from a voluntary communication exercise into a regulated business function, organizations are discovering that generating words is no longer the difficult part."
                    },
                    {
                        type: "paragraph",
                        text: "Generating trusted numbers is."
                    },
                    {
                        type: "paragraph",
                        text: "And the difference between those two concepts is far greater than many organizations initially realize."
                    }
                ]
            },
            {
                id: "real-challenge",
                heading: "The Real Challenge Is Not Writing Reports",
                blocks: [
                    {
                        type: "paragraph",
                        text: "Most people outside the sustainability profession imagine ESG reporting as a document creation exercise."
                    },
                    {
                        type: "paragraph",
                        text: "In reality, the report itself is often the easiest part of the process."
                    },
                    {
                        type: "paragraph",
                        text: "Before a single page is written, organizations must answer hundreds of operational questions:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "How much electricity was consumed at each facility?",
                            "What percentage came from renewable sources?",
                            "How much diesel was used during the reporting period?",
                            "Which emission factors were applied?",
                            "What reporting boundary was selected?",
                            "Which facilities were included?",
                            "What evidence supports each data point?",
                            "Which methodology was used?",
                            "Has the information been reviewed and approved?"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "For large organizations, these questions can involve thousands of individual records spread across facilities, departments, suppliers, utility providers, spreadsheets, invoices, ERP systems, laboratory reports, and operational databases."
                    },
                    {
                        type: "paragraph",
                        text: "The report is simply the final output of a much larger process."
                    },
                    {
                        type: "paragraph",
                        text: "If the process is flawed, the report will be flawed regardless of how well it is written."
                    }
                ]
            },
            {
                id: "ai-fragility",
                heading: "Why AI Often Produces Convincing But Fragile Results",
                blocks: [
                    {
                        type: "image",
                        src: "/insights/demo_insight_image_2.jpg",
                        caption: "AI text generation tools can create clean reports but miss structural flaws in source datasets."
                    },
                    {
                        type: "paragraph",
                        text: "Large language models are extraordinary tools for communication."
                    },
                    {
                        type: "paragraph",
                        text: "They can summarize information, identify patterns, explain regulations, draft disclosures, and transform technical data into readable narratives."
                    },
                    {
                        type: "paragraph",
                        text: "However, AI systems do not possess inherent knowledge of an organization's operations."
                    },
                    {
                        type: "paragraph",
                        text: "They only know what has been provided to them."
                    },
                    {
                        type: "paragraph",
                        text: "This creates a fundamental challenge for ESG reporting."
                    },
                    {
                        type: "paragraph",
                        text: "If an organization provides incomplete data, AI cannot reliably determine what is missing."
                    },
                    {
                        type: "paragraph",
                        text: "If an emissions factor is outdated, AI may not recognize the issue."
                    },
                    {
                        type: "paragraph",
                        text: "If a facility is excluded from the dataset, AI has no independent mechanism for identifying the omission."
                    },
                    {
                        type: "paragraph",
                        text: "If energy consumption data appears unusually high or unusually low, AI cannot automatically validate it against operational realities unless specifically instructed to do so."
                    },
                    {
                        type: "paragraph",
                        text: "The resulting report may appear polished, coherent, and authoritative."
                    },
                    {
                        type: "paragraph",
                        text: "Yet it may still contain significant errors."
                    },
                    {
                        type: "paragraph",
                        text: "This is not because the technology is ineffective."
                    },
                    {
                        type: "paragraph",
                        text: "It is because ESG reporting is fundamentally a data governance problem rather than a content generation problem."
                    }
                ]
            },
            {
                id: "traceability-first",
                heading: "ESG Reporting Is Built on Traceability",
                blocks: [
                    {
                        type: "image",
                        src: "/insights/demo_insight_image_3.jpg",
                        caption: "Traceability requires verifying every step from raw electricity meters to the final GHG disclosure."
                    },
                    {
                        type: "paragraph",
                        text: "One of the most important concepts in modern sustainability reporting is traceability."
                    },
                    {
                        type: "paragraph",
                        text: "When organizations publish emissions figures, stakeholders increasingly expect them to answer a simple question:"
                    },
                    {
                        type: "callout",
                        text: "How do you know this number is correct?",
                        title: "Audit Provenance"
                    },
                    {
                        type: "paragraph",
                        text: "Answering that question requires more than a narrative."
                    },
                    {
                        type: "paragraph",
                        text: "It requires evidence."
                    },
                    {
                        type: "paragraph",
                        text: "Organizations must often demonstrate:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "Where the data originated",
                            "Who entered the data",
                            "When the data was submitted",
                            "What methodology was applied",
                            "Which emission factors were used",
                            "Whether approvals were completed",
                            "Whether any changes were made after submission",
                            "Which supporting documents exist"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "This becomes especially important during:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "External assurance exercises",
                            "Internal audits",
                            "Investor due diligence",
                            "Regulatory reviews",
                            "Supply chain assessments",
                            "Sustainability certifications"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "A report generated from a prompt may describe emissions."
                    },
                    {
                        type: "paragraph",
                        text: "A structured ESG platform can explain, validate, document, and defend them."
                    },
                    {
                        type: "paragraph",
                        text: "Those are fundamentally different capabilities."
                    }
                ]
            },
            {
                id: "cost-of-errors",
                heading: "The Cost of Small Errors Is Growing",
                blocks: [
                    {
                        type: "paragraph",
                        text: "Historically, sustainability reporting was largely voluntary."
                    },
                    {
                        type: "paragraph",
                        text: "Today, that reality is changing rapidly."
                    },
                    {
                        type: "paragraph",
                        text: "Organizations now face increasing scrutiny from:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "Regulators",
                            "Investors",
                            "Financial institutions",
                            "Customers",
                            "Supply chain partners",
                            "Rating agencies"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "As regulations mature, inaccurate reporting can create consequences that extend far beyond reputational concerns."
                    },
                    {
                        type: "paragraph",
                        text: "Incorrect calculations can affect:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "Regulatory submissions",
                            "Carbon reduction commitments",
                            "Investor disclosures",
                            "Green financing eligibility",
                            "Supply chain relationships",
                            "Product-level carbon footprints",
                            "Compliance obligations"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "A single incorrect assumption can propagate through hundreds of calculations and influence major business decisions."
                    },
                    {
                        type: "paragraph",
                        text: "This is why sustainability leaders increasingly prioritize data quality over report aesthetics."
                    }
                ]
            },
            {
                id: "structured-systems",
                heading: "Why Structured Systems Matter",
                blocks: [
                    {
                        type: "image",
                        src: "/insights/demo_insight_image_4.jpg",
                        caption: "Dedicated ESG platforms establish a single source of truth with immutable record-keeping."
                    },
                    {
                        type: "paragraph",
                        text: "Purpose-built ESG platforms exist because sustainability reporting requires more than calculations."
                    },
                    {
                        type: "paragraph",
                        text: "It requires governance."
                    },
                    {
                        type: "paragraph",
                        text: "A modern ESG platform creates a controlled environment where organizations can:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "Collect data consistently",
                            "Apply approved methodologies",
                            "Maintain audit trails",
                            "Track approvals",
                            "Validate inputs",
                            "Store evidence",
                            "Generate disclosures",
                            "Monitor performance over time"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "Instead of relying on isolated spreadsheets and manual processes, organizations build a repeatable reporting framework."
                    },
                    {
                        type: "paragraph",
                        text: "This significantly reduces operational risk."
                    },
                    {
                        type: "paragraph",
                        text: "More importantly, it creates consistency from one reporting cycle to the next."
                    },
                    {
                        type: "paragraph",
                        text: "Consistency is one of the most important foundations of credible sustainability reporting."
                    }
                ]
            },
            {
                id: "data-quality-controls",
                heading: "Data Quality Cannot Be Automated Through Prompts Alone",
                blocks: [
                    {
                        type: "image",
                        src: "/insights/demo_insight_image_5.jpg",
                        caption: "Multi-layered data validation rules ensure consistency and identify anomalies before they reach auditors."
                    },
                    {
                        type: "paragraph",
                        text: "One of the most overlooked aspects of sustainability management is data quality assurance."
                    },
                    {
                        type: "paragraph",
                        text: "Consider a steel manufacturer operating multiple facilities."
                    },
                    {
                        type: "paragraph",
                        text: "Fuel consumption may be sourced from:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "Procurement systems",
                            "Fuel invoices",
                            "Laboratory reports",
                            "Site logbooks",
                            "ERP platforms",
                            "Vendor submissions"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "Each source introduces potential errors."
                    },
                    {
                        type: "bullets",
                        items: [
                            "Units may differ.",
                            "Values may be missing.",
                            "Calorific values may vary.",
                            "Emission factors may change."
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "Without structured validation mechanisms, these issues often remain undetected until late in the reporting cycle."
                    },
                    {
                        type: "paragraph",
                        text: "Dedicated ESG platforms are designed specifically to identify these challenges through validation workflows, approval processes, benchmarking, and data governance controls."
                    },
                    {
                        type: "paragraph",
                        text: "AI alone cannot reliably replace these operational controls."
                    }
                ]
            },
            {
                id: "industry-intelligence",
                heading: "The Future Is Industry-Specific Sustainability Intelligence",
                blocks: [
                    {
                        type: "image",
                        src: "/insights/demo_insight_image_6.jpg",
                        caption: "Industrial facilities require process-level tracking tailored to specific sector methodologies."
                    },
                    {
                        type: "paragraph",
                        text: "Organizations increasingly require ESG software that understands the realities of their industry."
                    },
                    {
                        type: "paragraph",
                        text: "A steel manufacturer faces challenges that differ dramatically from those of a technology company."
                    },
                    {
                        type: "paragraph",
                        text: "A cement producer operates under different emissions methodologies than a logistics provider."
                    },
                    {
                        type: "paragraph",
                        text: "A manufacturing facility may need:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "Process-level emissions tracking",
                            "Facility benchmarking",
                            "Energy intensity analysis",
                            "Green steel benchmarking",
                            "Carbon compliance monitoring",
                            "CBAM readiness",
                            "Regulatory reporting support"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "These requirements extend far beyond document generation."
                    },
                    {
                        type: "paragraph",
                        text: "They require systems designed around operational data, regulatory frameworks, and industry-specific workflows."
                    }
                ]
            },
            {
                id: "ai-value",
                heading: "Where Artificial Intelligence Creates Real Value",
                blocks: [
                    {
                        type: "paragraph",
                        text: "Despite these limitations, AI remains one of the most exciting developments in sustainability technology."
                    },
                    {
                        type: "paragraph",
                        text: "The question is not whether organizations should use AI."
                    },
                    {
                        type: "paragraph",
                        text: "The question is where AI creates the most value."
                    },
                    {
                        type: "paragraph",
                        text: "AI performs exceptionally well when supporting activities such as:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "Narrative generation",
                            "Executive summaries",
                            "Sustainability insights",
                            "Regulatory research",
                            "Trend identification",
                            "Report drafting",
                            "Stakeholder communication"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "These are areas where language and interpretation matter."
                    },
                    {
                        type: "paragraph",
                        text: "The underlying calculations, governance processes, evidence management, and audit controls should remain grounded in structured systems."
                    },
                    {
                        type: "paragraph",
                        text: "The most effective organizations will combine both approaches."
                    },
                    {
                        type: "paragraph",
                        text: "They will use ESG platforms as their source of truth and AI as an accelerator for analysis, communication, and decision support."
                    }
                ]
            },
            {
                id: "next-generation",
                heading: "The Next Generation of Sustainability Reporting",
                blocks: [
                    {
                        type: "paragraph",
                        text: "Over the coming decade, sustainability reporting will increasingly resemble financial reporting."
                    },
                    {
                        type: "paragraph",
                        text: "Organizations will be expected to demonstrate:"
                    },
                    {
                        type: "bullets",
                        items: [
                            "Data accuracy",
                            "Methodology transparency",
                            "Audit readiness",
                            "Regulatory compliance",
                            "Governance controls",
                            "Historical consistency"
                        ]
                    },
                    {
                        type: "paragraph",
                        text: "Success will not be measured by the quality of a report's wording."
                    },
                    {
                        type: "paragraph",
                        text: "It will be measured by confidence in the underlying data."
                    },
                    {
                        type: "paragraph",
                        text: "The organizations that perform best will not necessarily be those producing the longest reports or the most attractive dashboards."
                    },
                    {
                        type: "paragraph",
                        text: "They will be the organizations capable of answering difficult questions about their data with confidence, transparency, and evidence."
                    }
                ]
            },
            {
                id: "final-thoughts",
                heading: "Final Thoughts",
                blocks: [
                    {
                        type: "paragraph",
                        text: "Artificial intelligence has fundamentally changed how information is created and consumed."
                    },
                    {
                        type: "paragraph",
                        text: "Its role in sustainability reporting will continue to grow."
                    },
                    {
                        type: "paragraph",
                        text: "However, as reporting expectations become more rigorous, organizations must recognize an important distinction."
                    },
                    {
                        type: "paragraph",
                        text: "AI can help explain sustainability performance."
                    },
                    {
                        type: "paragraph",
                        text: "It cannot independently establish sustainability truth."
                    },
                    {
                        type: "paragraph",
                        text: "Reliable ESG reporting requires structured data, transparent methodologies, auditable workflows, governance controls, and evidence-backed calculations."
                    },
                    {
                        type: "paragraph",
                        text: "In other words, it requires systems."
                    },
                    {
                        type: "paragraph",
                        text: "Because when sustainability disclosures are reviewed by investors, regulators, customers, auditors, and assurance providers, confidence is not built on prompts."
                    },
                    {
                        type: "quote",
                        text: "It is built on proof."
                    }
                ]
            }
        ]
    }
];
