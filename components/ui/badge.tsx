import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva("inline-flex items-center rounded-md border font-sans text-[11px] font-medium tracking-tight select-none", {
    variants: {
        variant: {
            positive: "border-secondary/30 bg-secondary/10 text-secondary font-semibold",
            negative: "border-error/30 bg-error/10 text-error font-semibold",
            active: "border-secondary/30 bg-secondary-container/30 text-on-secondary-container font-semibold",
            neutral: "border-outline-variant bg-surface-container-high text-on-surface-variant",
            tag: "border-outline-variant bg-surface-container-high text-on-surface-variant uppercase tracking-wider text-[10px] font-semibold",
        },
        size: {
            sm: "px-2 py-0.5",
            md: "px-2.5 py-1",
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
