import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => (
    <input
        ref={ref}
        type={type}
        className={cn(
            "w-full rounded-lg border border-outline-variant bg-surface-container py-2 pl-10 pr-4 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary",
            className,
        )}
        {...props}
    />
));
Input.displayName = "Input";
