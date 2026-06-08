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
        <div className={cn("rounded-md border border-outline-variant bg-surface-container-lowest p-4", className)}>
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
                    className="inline-flex p-1 px-2 font-extrabold items-center justify-center rounded-xl border border-outline-variant bg-white text-on-surface transition hover:bg-surface-container-high"
                    aria-label="Previous month">
                    <MaterialIcon name="chevron_left" size="sm" />
                </button>
                <div className="text-sm font-semibold text-on-surface">{format(currentMonth, "MMMM yyyy")}</div>
                <button
                    type="button"
                    onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
                    className="inline-flex px-2 p-1 font-extrabold items-center justify-center rounded-xl border border-outline-variant bg-white text-on-surface transition hover:bg-surface-container-high"
                    aria-label="Next month">
                    <MaterialIcon name="chevron_right" size="sm" />
                </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                {weekdays.map((day) => (
                    <div key={day} className="text-center">
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1">
                {calendarDays.map((calendarDay) => {
                    const selected = date ? isSameDay(calendarDay, date) : false;
                    const outOfMonth = !isSameMonth(calendarDay, currentMonth);
                    const today = isToday(calendarDay);
                    const buttonClasses = cn(
                        "aspect-square h-[20px] w-[20px] p-4 flex items-center justify-center rounded-md text-sm font-medium transition duration-150",
                        selected
                            ? "bg-primary text-on-primary shadow-sm"
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
                                    today && !selected ? "ring ring-primary/30" : "",
                                    "inline-flex h-9 w-9 items-center justify-center rounded-full",
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
