import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva("inline-flex items-center rounded border font-mono text-[10px] font-bold uppercase", {
    variants: {
        variant: {
            positive: "border-secondary/20 bg-secondary/10 text-secondary",
            negative: "border-error/20 bg-error/10 text-error",
            active: "border-secondary/20 bg-secondary-container/30 text-on-secondary-container",
            neutral: "border-outline-variant bg-surface-container-high text-on-surface-variant",
            tag: "border-outline-variant bg-surface-container-high text-on-surface-variant uppercase tracking-wide",
        },
        size: {
            sm: "px-1.5 py-0.5",
            md: "px-2 py-0.5",
        },
    },
    defaultVariants: {
        variant: "neutral",
        size: "sm",
    },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
    return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { badgeVariants };
