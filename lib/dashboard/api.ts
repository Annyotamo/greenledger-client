import { privateApi } from "@/lib/http/client";
import type {
    EnergyDashboardApiResponse,
    EnergyDashboardResponseDataDto,
    ParsedEnergyDashboardData,
    ParsedFacilityEnergySummary,
    EnergyBarItem,
    EnergySourceNode,
    EnergyTrendPoint,
    MetricCardData,
    Scope2Segment,
} from "./types";

export function parseEnergyDashboardData(raw: EnergyDashboardResponseDataDto): ParsedEnergyDashboardData {
    const summary = raw.summary || {};
    
    const totalConsumedMwh = Number(summary.total_electricity_consumed_mwh) || 0;
    const totalConsumedKwh = Number(summary.total_electricity_consumed_kwh) || 0;
    const totalProducedMwh = Number(summary.total_produced_electricity_mwh) || 0;
    const totalProducedKwh = Number(summary.total_produced_electricity_kwh) || 0;
    const totalImportedMwh = Number(summary.total_imported_electricity_mwh) || 0;
    const totalImportedKwh = Number(summary.total_imported_electricity_kwh) || 0;
    const totalExportedMwh = Number(summary.total_exported_electricity_mwh) || 0;
    
    const gridDependencyPercentage = Number(summary.grid_dependency_percentage) || 0;
    const gridDisplacementMwh = Number(summary.grid_displacement_mwh) || 0;
    const gridDisplacementPercentage = Number(summary.grid_displacement_percentage) || 0;

    // 1. Metric Cards
    const metricCards: MetricCardData[] = [
        {
            id: "energy-total",
            label: "Total Energy Consumed",
            icon: "leaderboard",
            value: totalConsumedMwh,
            unit: "MWh",
            progressPercent: 100,
            progressClassName: "bg-primary",
        },
        {
            id: "energy-captive",
            label: "Captive Generated",
            icon: "energy_savings_leaf",
            value: totalProducedMwh,
            unit: "MWh",
            trend: {
                value: `${gridDisplacementPercentage.toFixed(1)}%`,
                direction: "up",
            },
            progressPercent: Math.min(100, Math.max(0, gridDisplacementPercentage)),
            progressClassName: "bg-secondary",
        },
        {
            id: "energy-grid",
            label: "Grid Sourced",
            icon: "bolt",
            value: totalImportedMwh,
            unit: "MWh",
            trend: {
                value: `${gridDependencyPercentage.toFixed(1)}%`,
                direction: "down",
            },
            progressPercent: Math.min(100, Math.max(0, gridDependencyPercentage)),
            progressClassName: "bg-primary-container",
        },
        {
            id: "energy-displacement",
            label: "Grid Displacement",
            icon: "trending_up",
            value: gridDisplacementPercentage,
            unit: "%",
            statusLabel: "Self-Reliance Rate",
            progressPercent: Math.min(100, Math.max(0, gridDisplacementPercentage)),
            progressClassName: "bg-secondary-fixed-dim shadow-[0_0_8px_rgba(78,222,163,0.5)]",
        },
    ];

    // 2. Monthly Trends
    const monthlyTrends: EnergyTrendPoint[] = (raw.monthly_trends || []).map((item) => ({
        month: item.month_label || item.month,
        captive: Number(item.captive_generated_mwh) || 0,
        grid: Number(item.grid_sourced_mwh) || 0,
    }));

    // 3. Energy Mix Segments
    const energyMixSegments: Scope2Segment[] = [
        {
            label: "Captive Generated",
            percent: Number(gridDisplacementPercentage.toFixed(1)),
            color: "var(--gl-secondary)",
        },
        {
            label: "Grid Purchase",
            percent: Number(gridDependencyPercentage.toFixed(1)),
            color: "#fb923c",
        },
    ];

    // 4. Energy Hierarchy (Value chain breakdown)
    const fuelGenMwh = Number(raw.fuel_activities_summary?.total_electricity_generated_mwh) || 0;
    const gridImportMwh = Number(raw.import_breakdown?.grid_import_mwh) || 0;
    const whrbGenMwh = Number(raw.production_breakdown?.non_renewable_produced_mwh) || 0;
    const renewableGenMwh = Number(raw.production_breakdown?.renewable_produced_mwh) || 0;

    const maxVal = Math.max(fuelGenMwh, gridImportMwh, whrbGenMwh, renewableGenMwh, 1);

    const energyHierarchy: EnergyBarItem[] = [
        {
            label: "Captive Fuel Gen",
            value: fuelGenMwh,
            percent: Math.round((fuelGenMwh / maxVal) * 100),
            color: "var(--gl-secondary)",
        },
        {
            label: "Grid Import",
            value: gridImportMwh,
            percent: Math.round((gridImportMwh / maxVal) * 100),
            color: "#fb923c",
        },
        {
            label: "Captive WHRB",
            value: whrbGenMwh,
            percent: Math.round((whrbGenMwh / maxVal) * 100),
            color: "#60a5fa",
        },
    ];

    if (renewableGenMwh > 0) {
        energyHierarchy.push({
            label: "Renewable Sourced",
            value: renewableGenMwh,
            percent: Math.round((renewableGenMwh / maxVal) * 100),
            color: "#4edea3",
        });
    }

    // 5. Energy Source Tree
    const fuelChildren: EnergySourceNode[] = (raw.fuel_activities_summary?.fuels || []).map((f) => ({
        label: `${f.fuel_name} (${Number(f.quantity).toLocaleString()} ${f.unit_symbol})`,
        value: Number(f.generated_electricity_mwh) || 0,
        unit: "MWh",
        note: `Energy Content: ${Number(f.energy_content_gj).toLocaleString()} GJ`,
    }));

    const whrbSources: EnergySourceNode[] = (raw.production_breakdown?.by_source || []).map((s) => ({
        label: `Waste Heat Recovery (${s.source_type.toUpperCase()})`,
        value: Number(s.electricity_mwh) || 0,
        unit: "MWh",
        note: `${s.activity_count} verified activities`,
    }));

    const energySourceTree: EnergySourceNode[] = [
        {
            label: "Captive Generated",
            value: totalProducedMwh,
            unit: "MWh",
            children: [
                {
                    label: "Thermal & Fuel Generation",
                    value: fuelGenMwh,
                    unit: "MWh",
                    children: fuelChildren.length > 0 ? fuelChildren : undefined,
                },
                {
                    label: "Waste Heat Recovery (WHRB)",
                    value: whrbGenMwh,
                    unit: "MWh",
                    children: whrbSources.length > 0 ? whrbSources : undefined,
                },
            ],
        },
        {
            label: "Grid DISCOM Import",
            value: totalImportedMwh,
            unit: "MWh",
            note: "National Grid / CEA Central Electricity Authority Factors",
        },
    ];

    // 6. Captive Generation Sources Bar List
    const captiveGenMax = Math.max(fuelGenMwh, whrbGenMwh, 1);
    const captiveGenerationSources: EnergyBarItem[] = [
        {
            label: "Fuel Combustion Gen",
            value: fuelGenMwh,
            percent: Math.round((fuelGenMwh / captiveGenMax) * 100),
            color: "var(--gl-secondary)",
        },
        {
            label: "WHRB Recovery",
            value: whrbGenMwh,
            percent: Math.round((whrbGenMwh / captiveGenMax) * 100),
            color: "#60a5fa",
        },
    ];

    // 7. Boiler & Fuel Mix Items
    const totalFuelGj = Number(raw.fuel_activities_summary?.total_fuel_consumed_gj) || 0;
    const boilerFuelMix: EnergyBarItem[] = (raw.fuel_activities_summary?.fuels || []).map((f) => {
        const genMwh = Number(f.generated_electricity_mwh) || 0;
        const fuelGj = Number(f.energy_content_gj) || 0;
        const pct = totalFuelGj > 0 ? Math.round((fuelGj / totalFuelGj) * 100) : 100;
        return {
            label: f.fuel_name,
            value: genMwh,
            percent: Math.min(100, Math.max(10, pct)),
            color: "#fb923c",
        };
    });

    if (boilerFuelMix.length === 0) {
        boilerFuelMix.push({
            label: "WHRB (Waste Heat)",
            value: whrbGenMwh,
            percent: 100,
            color: "var(--gl-secondary)",
        });
    }

    // 8. Facilities
    const facilities: ParsedFacilityEnergySummary[] = (raw.facility_summaries || []).map((f) => ({
        facilityId: f.facility_id,
        facilityName: f.facility_name,
        facilityCode: f.facility_code,
        activityCount: f.activity_count,
        producedMwh: Number(f.produced_electricity_mwh) || 0,
        importedMwh: Number(f.imported_electricity_mwh) || 0,
        exportedMwh: Number(f.exported_electricity_mwh) || 0,
        consumedMwh: Number(f.consumed_electricity_mwh) || 0,
        gridDependencyPercent: Number(f.grid_dependency_percentage) || 0,
        gridDisplacementMwh: Number(f.grid_displacement_mwh) || 0,
    }));

    const recentActivitiesCount =
        (raw.electricity_activities?.length || 0) + (raw.fuel_activities?.length || 0);

    return {
        summary: {
            totalConsumedMwh,
            totalConsumedKwh,
            totalProducedMwh,
            totalProducedKwh,
            totalImportedMwh,
            totalImportedKwh,
            totalExportedMwh,
            gridDependencyPercentage,
            gridDisplacementMwh,
            gridDisplacementPercentage,
        },
        metricCards,
        monthlyTrends,
        energyMixSegments,
        energyMixTotalMwh: totalConsumedMwh,
        energyHierarchy,
        energySourceTree,
        captiveGenerationSources,
        boilerFuelMix,
        facilities,
        recentActivitiesCount,
        documentsCount: raw.activity_documents?.length || 0,
        raw,
    };
}

export async function getEnergyDashboard(): Promise<ParsedEnergyDashboardData> {
    const response = await privateApi.get<EnergyDashboardApiResponse>("/tenant/energy/dashboard");
    if (!response.data || !response.data.data) {
        throw new Error("Failed to load energy dashboard data");
    }
    return parseEnergyDashboardData(response.data.data);
}
