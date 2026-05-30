import { cn } from "@/lib/utils/cn";

const MAX_SEGMENTS = 5;

type DataQualityBarProps = {
    score: number;
    className?: string;
};

export function DataQualityBar({ score, className }: DataQualityBarProps) {
    const filled = Math.min(Math.max(score, 0), MAX_SEGMENTS);

    return (
        <div className={cn("flex gap-0.5", className)} aria-label={`Data quality ${filled} of ${MAX_SEGMENTS}`}>
            {Array.from({ length: MAX_SEGMENTS }, (_, i) => (
                <div
                    key={i}
                    className={cn("h-4 w-1.5", i < filled ? "bg-secondary" : "bg-surface-container-highest")}
                />
            ))}
        </div>
    );
}
