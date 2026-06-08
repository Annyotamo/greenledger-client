import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    className?: string;
    /** Metric tiles only — subtle border highlight on hover */
    interactive?: boolean;
};

export function Card({ children, className, interactive = false }: CardProps) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest",
                interactive && "cursor-default transition-[border-color] duration-200 hover:border-primary",
                className,
            )}>
            {children}
        </div>
    );
}

type CardHeaderProps = {
    children: ReactNode;
    className?: string;
    bordered?: boolean;
    /** `strip` = muted band (facility / activity); `flat` = card face (scope cards) */
    tone?: "strip" | "flat";
};

export function CardHeader({ children, className, bordered = true, tone = "strip" }: CardHeaderProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between px-card-padding py-2",
                tone === "strip" ? "bg-surface-container" : "bg-surface-container-lowest",
                bordered && "border-b border-outline-variant",
                className,
            )}>
            {children}
        </div>
    );
}

type CardBodyProps = {
    children: ReactNode;
    className?: string;
};

export function CardBody({ children, className }: CardBodyProps) {
    return <div className={cn("p-card-padding", className)}>{children}</div>;
}
