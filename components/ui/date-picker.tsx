"use client";

import { useEffect, useRef, useState } from "react";
import { format, parse } from "date-fns";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils/cn";

interface DatePickerProps {
    value: string; // "yyyy-MM-dd" or ""
    onChange: (value: string) => void;
    error?: boolean;
    placeholder?: string;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    error,
    placeholder = "Select date...",
    className,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse value date or null
    const parsedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : null;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const displayLabel = parsedDate ? format(parsedDate, "PPP") : placeholder;

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-body-md transition duration-150 text-left cursor-pointer",
                    error ? "border-error" : "border-outline-variant",
                    isOpen ? "border-primary ring-1 ring-primary" : "hover:border-primary-2",
                    parsedDate ? "text-on-surface" : "text-on-surface-variant opacity-60"
                )}
            >
                <span>{displayLabel}</span>
                <MaterialIcon
                    name="calendar_month"
                    size="sm"
                    className="text-on-surface-variant"
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-1 z-50 rounded-lg shadow-lg border border-outline-variant bg-surface-container-lowest animate-fadeInUp">
                    <Calendar
                        size="small"
                        date={parsedDate}
                        onDateChange={(date) => {
                            onChange(format(date, "yyyy-MM-dd"));
                            setIsOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
