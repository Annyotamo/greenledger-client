"use client";

import { animate } from "framer-motion";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { MetricCardData } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";

type MetricCardProps = {
    data: MetricCardData;
};

function AnimatedValue({ value, isPercent }: { value: number; isPercent: boolean }) {
    const [display, setDisplay] = useState(isPercent ? "0.0%" : "0.0");

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 1.2,
            ease: "easeOut",
            onUpdate: (v) => {
                setDisplay(
                    isPercent
                        ? `${v.toFixed(1)}%`
                        : v.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                );
            },
        });
        return controls.stop;
    }, [value, isPercent]);

    return <span className="font-mono text-[24px] font-bold text-primary">{display}</span>;
}

export function MetricCard({ data }: MetricCardProps) {
    const isPercent = data.id === "net-zero";

    return (
        <Card interactive className="p-card-padding">
            <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <MaterialIcon name={data.icon} size="sm" className="text-on-surface-variant" />
                    <span className="font-mono text-label-md uppercase tracking-tight text-on-surface-variant">
                        {data.label}
                    </span>
                </div>
                {data.trend && (
                    <Badge variant={data.trend.direction === "down" ? "positive" : "negative"}>
                        {data.trend.value}
                    </Badge>
                )}
                {data.statusLabel && (
                    <span className="font-mono text-[10px] text-on-surface-variant">{data.statusLabel}</span>
                )}
            </div>

            <div className="flex items-baseline gap-2">
                <AnimatedValue value={data.value} isPercent={isPercent} />
                <span className="font-mono text-[10px] text-on-surface-variant">{data.unit}</span>
            </div>

            <div className="mt-3">
                <ProgressBar
                    percent={data.progressPercent}
                    className={data.progressClassName}
                    trackClassName="h-1"
                />
            </div>
        </Card>
    );
}
