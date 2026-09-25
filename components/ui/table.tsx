import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
    return <table className={cn("w-full border-collapse text-left", className)} {...props} />;
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
    return <thead className={cn("border-b border-outline-variant bg-surface-container-high/30", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody className={cn("font-sans text-[13px] text-on-surface divide-y divide-outline-variant/40", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            className={cn("border-b border-outline-variant/60 transition-colors hover:bg-surface-container-low/60", className)}
            {...props}
        />
    );
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn(
                "px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant select-none",
                className
            )}
            {...props}
        />
    );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
    return <td className={cn("px-4 py-3.5 font-sans text-[13px] align-middle", className)} {...props} />;
}
