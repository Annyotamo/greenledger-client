import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
    return <table className={cn("w-full border-collapse text-left", className)} {...props} />;
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
    return <thead className={cn("border-b border-outline-variant bg-surface-container-high/30", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody className={cn("font-mono text-[12px] text-on-surface", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            className={cn("border-b border-outline-variant transition-colors hover:bg-surface-container", className)}
            {...props}
        />
    );
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn(
                "px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-wide text-on-surface-variant",
                className
            )}
            {...props}
        />
    );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
    return <td className={cn("px-4 py-4", className)} {...props} />;
}
