import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 font-mono text-label-md font-medium transition-[opacity,background-color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-primary text-on-primary hover:opacity-90 active:scale-[0.98]",
                secondary:
                    "inline-flex items-center gap-2 rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-mono text-label-md text-on-surface transition-colors hover:bg-surface-container-high",
                ghost: "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                danger: "text-error hover:bg-error-container/20",
                surface: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
            },
            size: {
                sm: "rounded px-3 py-1.5 text-[11px]",
                md: "rounded-lg px-4 py-2 text-label-md",
                icon: "rounded-full p-2",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";

export { buttonVariants };
