export type HoverInsight = {
    id: string;
    label: string;
    headline: string;
    teaser: string;
    detail: string;
    stat: string;
};

type HoverInsightGridProps = {
    insights: HoverInsight[];
};

export function HoverInsightGrid({ insights }: HoverInsightGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {insights.map((item) => (
                <div
                    key={item.id}
                    className="group relative min-h-[240px] overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/95 via-emerald-50/50 to-white/90 p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:border-emerald-400/45 hover:shadow-2xl">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-400/20 blur-2xl transition duration-500 group-hover:scale-110 group-hover:bg-emerald-500/30" />
                    <p className="relative text-xs font-bold uppercase tracking-widest text-emerald-800/80">{item.label}</p>
                    <p className="relative mt-3 text-3xl font-extrabold tabular-nums tracking-tight text-emerald-950">{item.stat}</p>
                    <h3 className="relative mt-2 text-base font-semibold text-slate-900">{item.headline}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{item.teaser}</p>
                    <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-2 rounded-xl border border-emerald-900/10 bg-white/95 p-3 text-sm leading-relaxed text-slate-700 opacity-0 shadow-lg backdrop-blur-sm transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                        {item.detail}
                    </div>
                </div>
            ))}
        </div>
    );
}
