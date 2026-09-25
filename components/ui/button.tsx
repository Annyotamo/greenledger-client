import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 font-sans text-sm font-medium tracking-[-0.01em] transition-[opacity,background-color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.99]",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary text-white! px-5 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity rounded-lg shadow-2xs font-semibold",
                secondary:
                    "inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 font-sans text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high shadow-2xs",
                ghost: "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-lg",
                danger: "text-error hover:bg-error-container/20 rounded-lg",
                surface: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-lg",
            },
            size: {
                sm: "rounded-md px-2.5 py-1.5 text-xs font-medium",
                md: "rounded-lg px-3.5 py-2 text-sm font-medium",
                lg: "rounded-lg px-5 py-2.5 text-sm font-semibold",
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
