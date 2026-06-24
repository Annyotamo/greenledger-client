import { notFound } from "next/navigation";
import { INSIGHTS_ARTICLES } from "@/lib/insightsData";
import ArticleReader from "@/components/insights/ArticleReader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Generate static routes at build time
export async function generateStaticParams() {
    return INSIGHTS_ARTICLES.map((article) => ({
        slug: article.slug,
    }));
}

// Dynamic page metadata for SEO best practices
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const article = INSIGHTS_ARTICLES.find((a) => a.slug === slug);

    if (!article) {
        return {
            title: "Insight Not Found | GreenLedger",
        };
    }

    return {
        title: `${article.title} | GreenLedger Insights`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: "article",
            publishedTime: "2026-06-24T12:00:00Z",
            authors: [article.author],
        },
    };
}

export default async function InsightArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = INSIGHTS_ARTICLES.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    return (
        <main className="w-full text-slate-900 font-[var(--font-hanken),Inter,system-ui,sans-serif]">
            {/* Header / Navigation bar */}
            <Navbar variant="light" />

            {/* Main content body container */}
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                
                {/* Article Header Hero Block */}
                <div className="mb-10 max-w-4xl">
                    {/* Category tag and Read time */}
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold mb-4">
                        <span className="font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                            {article.category}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        <span className="text-slate-500 font-mono flex items-center gap-1.5 bg-slate-50 border border-slate-200/40 px-2 py-0.5 rounded-lg">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline-block"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {article.readTime}
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-950 leading-tight">
                        {article.title}
                    </h1>

                    {/* Subtitle / Excerpt */}
                    <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-normal">
                        {article.excerpt}
                    </p>

                    {/* Metadata strip (Author & Published date) */}
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm border-t border-slate-100 pt-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-900 flex items-center justify-center text-white text-xs font-bold font-mono shadow-sm">
                                GL
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">
                                    {article.author}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-none">
                                    GreenLedger Research Team
                                </p>
                            </div>
                        </div>

                        <span className="hidden sm:inline h-6 w-[1px] bg-slate-200 self-center" />

                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 leading-none">Published</span>
                            <span className="text-sm font-semibold text-slate-800 mt-1 leading-none">
                                {article.published}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Article Reader Component Layout */}
                <ArticleReader article={article} />

            </div>

            {/* Footer */}
            <div className="mx-6">
                <Suspense fallback={<div>Loading Footer...</div>}>
                    <Footer />
                </Suspense>
            </div>
        </main>
    );
}
