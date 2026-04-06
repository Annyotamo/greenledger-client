"use client";

import { useState, type ReactNode } from "react";

export type AccordionItem = {
    id: string;
    title: string;
    subtitle: string;
    body: ReactNode;
};

type SolutionsAccordionProps = {
    items: AccordionItem[];
};

function Chevron({ open }: { open: boolean }) {
    return (
        <span
            className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-900/10 bg-white/95 text-emerald-800 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                open ? "rotate-180" : "rotate-0"
            }`}
            aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-800" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 9l6 6 6-6" />
            </svg>
        </span>
    );
}

export function SolutionsAccordion({ items }: SolutionsAccordionProps) {
    const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

    return (
        <div className="flex flex-col gap-3">
            {items.map((item, index) => {
                const open = openId === item.id;
                return (
                    <div
                        key={item.id}
                        className={`overflow-hidden rounded-2xl border bg-white/90 shadow-md backdrop-blur-md transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                            open
                                ? "border-emerald-400/40 shadow-xl ring-1 ring-emerald-900/10"
                                : "border-white/70 hover:border-emerald-900/15 hover:shadow-lg"
                        }`}>
                        <button
                            type="button"
                            className="flex w-full cursor-pointer items-start gap-4 px-5 py-5 text-left outline-none transition-colors sm:px-6 sm:py-5"
                            aria-expanded={open}
                            aria-controls={`acc-panel-${item.id}`}
                            id={`acc-trigger-${item.id}`}
                            onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}>
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-900/[0.06] text-sm font-bold tabular-nums text-emerald-800">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1 pt-1">
                                <span className="block text-lg font-semibold tracking-tight text-emerald-950">{item.title}</span>
                                <span className="mt-1 block text-sm leading-snug text-slate-600">{item.subtitle}</span>
                            </span>
                            <Chevron open={open} />
                        </button>
                        <div
                            className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${
                                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                            }`}>
                            <div className="min-h-0 overflow-hidden">
                                <div
                                    id={`acc-panel-${item.id}`}
                                    role="region"
                                    aria-labelledby={`acc-trigger-${item.id}`}
                                    className="border-t border-emerald-900/[0.06] bg-gradient-to-b from-white/50 to-emerald-50/25 px-5 pb-6 pt-0 text-sm leading-relaxed text-slate-700 sm:px-6"
                                    onClick={(e) => e.stopPropagation()}
                                    onPointerDown={(e) => e.stopPropagation()}>
                                    <div className="max-w-3xl pt-4">{item.body}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
