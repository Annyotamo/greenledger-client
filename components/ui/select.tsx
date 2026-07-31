"use client";

import { useEffect, useState } from "react";
import Select, { GroupBase, Props as SelectProps, StylesConfig } from "react-select";

export interface CustomSelectOption {
    label: string;
    value: string;
}

interface CustomSelectProps extends Omit<SelectProps<CustomSelectOption, false, GroupBase<CustomSelectOption>>, "onChange" | "value"> {
    options: CustomSelectOption[];
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    placeholder?: string;
    variant?: "default" | "compact";
    className?: string;
}

export function CustomSelect({
    options,
    value,
    onChange,
    error,
    placeholder = "Select...",
    variant = "default",
    className,
    ...props
}: CustomSelectProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value) || null;

    const styles: StylesConfig<CustomSelectOption, false, GroupBase<CustomSelectOption>> = {
        control: (provided, state) => {
            if (variant === "compact") {
                return {
                    ...provided,
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    boxShadow: "none",
                    borderRadius: "0.375rem",
                    minHeight: "unset",
                    height: "auto",
                    cursor: "pointer",
                    padding: "2px 6px",
                    display: "inline-flex",
                    transition: "all 150ms ease",
                    "&:hover": {
                        backgroundColor: "var(--gl-surface-container-low, #f3f4f5)",
                        borderColor: "transparent",
                    },
                };
            }
            return {
                ...provided,
                backgroundColor: "var(--gl-surface-container-lowest, #ffffff)",
                borderColor: error
                    ? "var(--gl-error, #ba1a1a)"
                    : state.isFocused
                    ? "var(--gl-primary, #000000)"
                    : "var(--gl-outline-variant, #c6c6cd)",
                boxShadow: state.isFocused
                    ? "0 0 0 1px var(--gl-primary, #000000)"
                    : "none",
                borderRadius: "0.25rem",
                minHeight: "42px",
                height: "42px",
                cursor: "pointer",
                transition: "all 200ms ease",
                "&:hover": {
                    borderColor: error
                        ? "var(--gl-error, #ba1a1a)"
                        : "var(--gl-primary-2, #4ea56c)",
                },
            };
        },
        valueContainer: (provided) => ({
            ...provided,
            padding: variant === "compact" ? "0 2px" : "0 12px",
            height: variant === "compact" ? "auto" : "40px",
            display: "flex",
            alignItems: "center",
        }),
        input: (provided) => ({
            ...provided,
            color: "var(--gl-on-surface, #191c1d)",
            fontFamily: "var(--font-hanken), Inter, sans-serif",
            fontSize: variant === "compact" ? "0.875rem" : "0.95rem",
            margin: 0,
            padding: 0,
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "var(--gl-on-surface-variant, #45464c)",
            fontFamily: "var(--font-hanken), Inter, sans-serif",
            fontSize: variant === "compact" ? "0.875rem" : "0.95rem",
            opacity: 0.6,
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "var(--gl-on-surface, #191c1d)",
            fontFamily: "var(--font-hanken), Inter, sans-serif",
            fontSize: variant === "compact" ? "0.875rem" : "0.95rem",
            fontWeight: variant === "compact" ? 600 : 400,
        }),
        dropdownIndicator: (provided, state) => ({
            ...provided,
            color: "var(--gl-outline, #76777d)",
            padding: variant === "compact" ? "0" : "0 8px",
            transition: "transform 150ms ease",
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
            "& svg": variant === "compact" ? {
                width: "12px",
                height: "12px",
            } : undefined,
            "&:hover": {
                color: "var(--gl-primary, #000000)",
            },
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "var(--gl-surface-container-lowest, #ffffff)",
            borderRadius: "0.5rem",
            border: "1px solid var(--gl-outline-variant, #c6c6cd)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            zIndex: 99999,
            overflow: "hidden",
            width: variant === "compact" ? "120px" : "100%",
            right: variant === "compact" ? 0 : "auto",
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 99999,
        }),
        menuList: (provided) => ({
            ...provided,
            padding: "4px 0",
            maxHeight: "250px",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "var(--gl-secondary-container, #6cf8bb)"
                : state.isFocused
                ? "var(--gl-surface-container-low, #f3f4f5)"
                : "transparent",
            color: state.isSelected
                ? "var(--gl-on-secondary-container, #00714d)"
                : "var(--gl-on-surface, #191c1d)",
            padding: variant === "compact" ? "6px 10px" : "8px 12px",
            fontSize: variant === "compact" ? "0.875rem" : "0.95rem",
            fontFamily: "var(--font-hanken), Inter, sans-serif",
            cursor: "pointer",
            transition: "all 150ms ease",
            "&:active": {
                backgroundColor: "var(--gl-secondary-container, #6cf8bb)",
            },
        }),
    };

    if (!isMounted) {
        if (variant === "compact") {
            return (
                <div className="inline-flex items-center gap-1 px-1 py-0.5 text-sm font-semibold text-on-surface opacity-60">
                    {placeholder}
                </div>
            );
        }
        return (
            <div className={`relative w-full rounded-lg border ${error ? "border-error" : "border-outline-variant"} bg-white min-h-[42px] px-3 py-2 text-body-md text-on-surface`}>
                <span className="opacity-60">{placeholder}</span>
            </div>
        );
    }

    return (
        <Select
            {...props}
            options={options}
            value={selectedOption}
            onChange={(val) => onChange((val as CustomSelectOption)?.value || "")}
            styles={styles}
            placeholder={placeholder}
            className={className}
            menuPortalTarget={isMounted && typeof document !== "undefined" ? document.body : undefined}
        />
    );
}
