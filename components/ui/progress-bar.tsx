import { cn } from "@/lib/utils/cn";

type ProgressBarProps = {
    percent: number;
    className?: string;
    trackClassName?: string;
    animate?: boolean;
};

export function ProgressBar({ percent, className, trackClassName, animate = true }: ProgressBarProps) {
    const clamped = Math.min(Math.max(percent, 0), 100);

    return (
        <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-container-high", trackClassName)}>
            <div
                className={cn("h-full rounded-full", animate && "progress-grow", className)}
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
}
