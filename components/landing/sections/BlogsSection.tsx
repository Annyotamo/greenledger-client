import Image from "next/image";
import Link from "next/link";

const POSTS = [
    {
        id: "post-1",
        title: "ESG Reporting & GHG Accounting — A Practical Guide",
        excerpt:
            "How to structure your data ingestion pipeline for continuous GHG accounting and reliable disclosures.",
        image: "/landing-news-1.jpg",
    },
    {
        id: "post-2",
        title: "Audit-Ready Workflows with Immutable Logging",
        excerpt: "Design patterns for tamper-evident logs, evidence attachments, and auditor-friendly outputs.",
        image: "/landing-news-2.jpg",
    },
    {
        id: "post-3",
        title: "Role-Based Auth & Approval for Activity Submissions",
        excerpt:
            "Best practices for segmented permissions and approval queues for submitted fuel/electricity activities.",
        image: "/landing-news-3.jpg",
    },
    {
        id: "post-4",
        title: "Fuel & Electricity Activities — Measurement Patterns",
        excerpt: "Meter vs. invoice approaches, unit normalization, and uncertainty handling for energy activities.",
        image: "/landing-news-4.jpg",
    },
];

export default function BlogsSection() {
    return (
        <section className="mb-16">
            <div className="mb-6 max-w-4xl">
                <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                    Latest from our newsroom
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                    Insights and short reads focused on ESG reporting, GHG accounting and operational activities.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {POSTS.map((post) => (
                    <article
                        key={post.id}
                        className="card-hover rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                        <div className="relative h-40 w-full overflow-hidden rounded-md bg-emerald-50">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                sizes="(min-width:1024px) 280px, 45vw"
                                className="object-cover"
                            />
                        </div>
                        <h3 className="mt-3 text-base font-semibold text-emerald-900">{post.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">{post.excerpt}</p>
                        <div className="mt-4">
                            <Link
                                href="#"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                Read
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
