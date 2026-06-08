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

type CalendarProps = {
    date: Date | null;
    onDateChange: (date: Date) => void;
    className?: string;
};

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Calendar({ date, onDateChange, className }: CalendarProps) {
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

    return (
        <div className={cn("rounded-md border border-outline-variant bg-surface-container-lowest p-2", className)}>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
                    className="inline-flex items-center justify-center rounded-md bg-transparent text-on-surface px-2 py-1 font-extrabold hover:bg-transparent"
                    aria-label="Previous month">
                    <MaterialIcon name="chevron_left" size="lg" className="!text-lg" />
                </button>
                <div className="text-sm font-semibold text-on-surface">{format(currentMonth, "MMMM yyyy")}</div>
                <button
                    type="button"
                    onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                    className="inline-flex items-center justify-center rounded-md bg-transparent text-on-surface px-2 py-1 font-extrabold hover:bg-transparent"
                    aria-label="Next month">
                    <MaterialIcon name="chevron_right" size="lg" className="!text-lg" />
                </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                {weekdays.map((day) => (
                    <div key={day} className="text-center">
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-0.5">
                {calendarDays.map((calendarDay) => {
                    const selected = date ? isSameDay(calendarDay, date) : false;
                    const outOfMonth = !isSameMonth(calendarDay, currentMonth);
                    const today = isToday(calendarDay);
                    const buttonClasses = cn(
                        "h-8 w-8 p-0 flex items-center justify-center rounded-md text-sm font-medium transition duration-150",
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
