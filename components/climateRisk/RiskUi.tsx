"use client";

import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";
import { RATING_LABEL } from "@/lib/climateRisk/engine";
import type { AssessmentStatus, DataQuality, HazardLevel, Rating, TriState } from "@/lib/climateRisk/types";

// Status palette (dataviz skill reference): colour never carries meaning alone, every mark has an icon or label.
const TONE = {
    high: { dot: "bg-[#d03b3b]", tint: "bg-[#d03b3b]/10 border-[#d03b3b]/35", icon: "warning" },
    medium: { dot: "bg-[#fab219]", tint: "bg-[#fab219]/15 border-[#d9970a]/40", icon: "error" },
    low: { dot: "bg-[#0ca30c]", tint: "bg-[#0ca30c]/10 border-[#0ca30c]/30", icon: "check_circle" },
    not_rated: { dot: "bg-outline", tint: "bg-surface-container border-dashed border-outline", icon: "help" },
} as const;

export function RatingBadge({ rating, size = "sm", className }: { rating: Rating; size?: "sm" | "lg"; className?: string }) {
    const t = TONE[rating];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md border font-sans font-semibold text-on-surface whitespace-nowrap",
                t.tint,
                size === "lg" ? "px-3 py-1.5 text-body-md" : "px-2 py-0.5 text-[11px]",
                className,
            )}>
            <span className={cn("rounded-full shrink-0", t.dot, size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} aria-hidden />
            {RATING_LABEL[rating]}
        </span>
    );
}

const LEVEL_TEXT: Record<HazardLevel, string> = { VLO: "Very low", LOW: "Low", MED: "Medium", HIG: "High", "no-data": "No data" };
const LEVEL_TONE: Record<HazardLevel, string> = {
    HIG: "bg-[#d03b3b]/14 border-[#d03b3b]/40 text-on-surface",
    MED: "bg-[#fab219]/20 border-[#d9970a]/45 text-on-surface",
    LOW: "bg-[#0ca30c]/10 border-[#0ca30c]/30 text-on-surface",
    VLO: "bg-[#0ca30c]/[0.04] border-[#0ca30c]/20 text-on-surface-variant",
    "no-data": "border-dashed border-outline-variant text-on-surface-variant/70",
};

export function HazardChip({ level, muted, title }: { level: HazardLevel | null; muted?: boolean; title?: string }) {
    if (!level) return <span className="text-on-surface-variant/40">—</span>;
    return (
        <span
            title={title}
            className={cn(
                "inline-flex min-w-[54px] justify-center rounded border px-1 py-1 font-sans text-[11px] font-medium whitespace-nowrap",
                muted ? "border-outline-variant/60 bg-surface-container-low text-on-surface-variant/60" : LEVEL_TONE[level],
            )}>
            {LEVEL_TEXT[level]}
        </span>
    );
}

export const levelText = (l: HazardLevel) => LEVEL_TEXT[l];

export function NotRatedNote({ reason, className }: { reason: string | null; className?: string }) {
    if (!reason) return null;
    return (
        <p className={cn("flex items-start gap-1 text-[12px] text-on-surface-variant", className)}>
            <MaterialIcon name="info" size="xs" className="mt-0.5" />
            <span>{reason.charAt(0).toUpperCase() + reason.slice(1)}</span>
        </p>
    );
}

export function QualityTag({ quality }: { quality: DataQuality }) {
    if (quality === "measured") return <span className="text-[11px] text-on-surface-variant">Measured</span>;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                quality === "estimated" ? "border-[#d9970a]/50 bg-[#fab219]/12 text-on-surface" : "border-dashed border-outline text-on-surface-variant",
            )}>
            <MaterialIcon name={quality === "estimated" ? "change_history" : "remove"} size="xs" />
            {quality}
        </span>
    );
}

export function TriTag({ value, yesLabel = "Yes" }: { value: TriState; yesLabel?: string }) {
    const map = {
        yes: { text: yesLabel, cls: "border-secondary/30 bg-secondary/10 text-secondary" },
        no: { text: "No", cls: "border-outline-variant bg-surface-container-high text-on-surface-variant" },
        unknown: { text: "Unknown", cls: "border-dashed border-outline text-on-surface-variant" },
    }[value];
    return <span className={cn("inline-flex rounded border px-1.5 py-0.5 text-[11px] font-medium", map.cls)}>{map.text}</span>;
}

const STATUS_STEPS: { key: AssessmentStatus; label: string }[] = [
    { key: "draft", label: "Draft" },
    { key: "in_review", label: "In review" },
    { key: "approved", label: "Approved" },
];

export function StatusBadge({ status }: { status: AssessmentStatus }) {
    const label = STATUS_STEPS.find((s) => s.key === status)!.label;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                status === "approved" && "border-secondary/30 bg-secondary/10 text-secondary",
                status === "in_review" && "border-tertiary-container/20 bg-[#3980f4]/10 text-[#1c5cab]",
                status === "draft" && "border-outline-variant bg-surface-container-high text-on-surface-variant",
            )}>
            {status === "approved" && <MaterialIcon name="lock" size="xs" />}
            {label}
        </span>
    );
}

export function StatusSteps({ status }: { status: AssessmentStatus }) {
    const at = STATUS_STEPS.findIndex((s) => s.key === status);
    return (
        <ol className="flex items-center gap-2" aria-label="Assessment status">
            {STATUS_STEPS.map((s, i) => (
                <li key={s.key} className="flex items-center gap-2">
                    <span
                        aria-current={i === at ? "step" : undefined}
                        className={cn(
                            "flex items-center gap-1.5 text-[12px]",
                            i < at && "text-secondary",
                            i === at && "font-semibold text-on-surface",
                            i > at && "text-on-surface-variant/60",
                        )}>
                        <span
                            className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-full border text-[9px]",
                                i < at && "border-secondary bg-secondary text-white",
                                i === at && "border-on-surface bg-on-surface text-white",
                                i > at && "border-outline-variant",
                            )}>
                            {i < at ? "✓" : i + 1}
                        </span>
                        {s.label}
                    </span>
                    {i < STATUS_STEPS.length - 1 && <span className="h-px w-6 bg-outline-variant" aria-hidden />}
                </li>
            ))}
        </ol>
    );
}

// ─── Formatting (INR in crore, Indian digit grouping) ─────────────────────────
const CRORE = 1e7;
const inGroup = (n: number, digits = 0) => n.toLocaleString("en-IN", { maximumFractionDigits: digits, minimumFractionDigits: digits });
export const formatCrore = (inr: number | null) => (inr === null ? "—" : `₹${inGroup(inr / CRORE, inr / CRORE < 100 ? 1 : 0)} cr`);
export const formatT = (t: number | null) => (t === null ? "—" : inGroup(t));
export const formatPct = (p: number | null, digits = 1) => (p === null ? "—" : `${p.toFixed(digits)}%`);
export const formatInr = (n: number) => `₹${inGroup(n)}`;
export const formatDateTime = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
export const formatDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");
export { CRORE };

export function SectionTitle({ children, aside, id }: { children: ReactNode; aside?: ReactNode; id?: string }) {
    return (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 id={id} className="font-sans text-headline-sm text-on-surface">
                {children}
            </h3>
            {aside}
        </div>
    );
}

export function ErrorNote({ error }: { error: unknown }) {
    if (!error) return null;
    return (
        <p role="alert" className="flex items-center gap-1.5 rounded-md border border-error/30 bg-error/5 px-3 py-2 text-[12px] text-error">
            <MaterialIcon name="block" size="sm" />
            {error instanceof Error ? error.message : "Something went wrong."}
        </p>
    );
}

export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-[#1c5cab] underline-offset-2 hover:underline">
            {children}
            <MaterialIcon name="north_east" size="xs" />
        </a>
    );
}

export { LIMITS, THINKHAZARD_CREDIT } from "@/lib/climateRisk/report-text";
