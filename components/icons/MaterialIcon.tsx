import { CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

const SIZE_MAP: Record<string, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
} as const;

type MaterialIconProps = {
    name: string;
    size?: keyof typeof SIZE_MAP;
    className?: string;
    filled?: boolean;
};

export function MaterialIcon({ name, size = "lg", className, filled = false }: MaterialIconProps) {
    const fontSize = SIZE_MAP[size] ?? 12;

    const style: CSSProperties = {
        fontSize: `${fontSize}px`,
        lineHeight: 1,
        fontVariationSettings: filled
            ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
            : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    };

    return (
        <span className={cn("material-symbols-outlined leading-none", className)} style={style} aria-hidden>
            {name}
        </span>
    );
}
