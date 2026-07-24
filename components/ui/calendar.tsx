"use client";

import {
    addDays,
    addMonths,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";

import { CustomSelect } from "@/components/ui/select";

type CalendarProps = {
    date: Date | null;
    onDateChange: (date: Date) => void;
    className?: string;
    size?: "basic" | "small";
};

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const months = [
    { label: "Jan", value: "0" },
    { label: "Feb", value: "1" },
    { label: "Mar", value: "2" },
    { label: "Apr", value: "3" },
    { label: "May", value: "4" },
    { label: "Jun", value: "5" },
    { label: "Jul", value: "6" },
    { label: "Aug", value: "7" },
    { label: "Sep", value: "8" },
    { label: "Oct", value: "9" },
    { label: "Nov", value: "10" },
    { label: "Dec", value: "11" },
];

export function Calendar({ date, onDateChange, className, size = "basic" }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date>(date ?? new Date());

    useEffect(() => {
        if (date) {
            setCurrentMonth(date);
        }
    }, [date]);

    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarDays = useMemo(
        () => Array.from({ length: 42 }, (_, index) => addDays(startDate, index)),
        [startDate],
    );

    const currentYear = new Date().getFullYear();
    const years = useMemo(() => {
        const result = [];
        for (let y = currentYear - 10; y <= currentYear + 10; y++) {
            result.push({ label: String(y), value: String(y) });
        }
        return result;
    }, [currentYear]);

    return (
        <div className={cn(
            "rounded-md border border-outline-variant bg-white",
            size === "small" ? "p-1.5 w-[250px]" : "p-2 w-full max-w-[340px]",
            className
        )}>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
                    className="inline-flex items-center justify-center rounded-md bg-transparent text-on-surface px-1.5 py-1 font-extrabold hover:bg-transparent cursor-pointer"
                    aria-label="Previous month">
                    <MaterialIcon name="chevron_left" size="lg" className="!text-lg" />
                </button>
                <div className="flex items-center gap-0.5 text-sm font-semibold text-on-surface">
                    <CustomSelect
                        variant="compact"
                        options={months}
                        value={String(currentMonth.getMonth())}
                        isSearchable={false}
                        onChange={(val) => {
                            const newMonth = new Date(currentMonth.getFullYear(), Number(val), 1);
                            setCurrentMonth(newMonth);
                        }}
                    />
                    <CustomSelect
                        variant="compact"
                        options={years}
                        value={String(currentMonth.getFullYear())}
                        isSearchable={false}
                        onChange={(val) => {
                            const newMonth = new Date(Number(val), currentMonth.getMonth(), 1);
                            setCurrentMonth(newMonth);
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                    className="inline-flex items-center justify-center rounded-md bg-transparent text-on-surface px-1.5 py-1 font-extrabold hover:bg-transparent cursor-pointer"
                    aria-label="Next month">
                    <MaterialIcon name="chevron_right" size="lg" className="!text-lg" />
                </button>
            </div>

            <div className={cn(
                "mt-3 grid grid-cols-7 gap-0.5 font-semibold uppercase tracking-[0.18em] text-on-surface-variant text-center",
                size === "small" ? "text-[9px]" : "text-[11px]"
            )}>
                {weekdays.map((day) => (
                    <div key={day}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-0.5 justify-items-center">
                {calendarDays.map((calendarDay) => {
                    const selected = date ? isSameDay(calendarDay, date) : false;
                    const outOfMonth = !isSameMonth(calendarDay, currentMonth);
                    const today = isToday(calendarDay);
                    const buttonClasses = cn(
                        size === "small"
                            ? "h-7 w-7 p-0 flex items-center justify-center rounded-md text-xs font-medium transition duration-150"
                            : "h-8 w-8 p-0 flex items-center justify-center rounded-md text-sm font-medium transition duration-150",
                        selected
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-transparent text-on-surface hover:bg-surface-container-high",
                        outOfMonth && "text-on-surface-variant",
                    );

                    return (
                        <button
                            key={calendarDay.toISOString()}
                            type="button"
                            onClick={() => onDateChange(calendarDay)}
                            className={buttonClasses}
                            aria-pressed={selected}
                            title={format(calendarDay, "PPP")}>
                            <span
                                className={cn(
                                    today && !selected ? "" : "",
                                    "inline-flex items-center justify-center rounded-full px-1 py-0.5",
                                )}>
                                {format(calendarDay, "d")}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
