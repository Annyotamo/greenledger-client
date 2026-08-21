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
    GhgDashboardApiResponse,
    GhgDashboardResponseDataDto,
    ParsedGhgDashboardData,
    EmissionsTrendPoint,
    ScopeComparisonMonth,
    Scope1FuelItem,
    FacilityRow,
    ActivityItem,
    TopKpiCardData,
    ScopeDistributionItem,
    YearlyEmissionsTrendPoint,
    TopEmissionSourceItem,
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

// ==========================================
// GHG Dashboard Parser & API Call
// ==========================================

export function parseGhgDashboardData(raw: GhgDashboardResponseDataDto): ParsedGhgDashboardData {
    const kpi = raw.kpi_summary || {};
    const totalCurrent = Number(kpi.total_emissions?.current_tco2e || 0);
    const totalPrevious = Number(kpi.total_emissions?.previous_tco2e || 0);
    const totalChangePct = Number(kpi.total_emissions?.change_pct || 0);

    const s1Current = Number(kpi.scope_1?.current_tco2e || 0);
    const s1Previous = Number(kpi.scope_1?.previous_tco2e || 0);
    const s1ChangePct = Number(kpi.scope_1?.change_pct || 0);
    const s1SharePct = Number(kpi.scope_1?.percentage_of_total || (totalCurrent > 0 ? (s1Current / totalCurrent) * 100 : 0));

    const s2Current = Number(kpi.scope_2?.current_tco2e || 0);
    const s2Previous = Number(kpi.scope_2?.previous_tco2e || 0);
    const s2ChangePct = Number(kpi.scope_2?.change_pct || 0);
    const s2SharePct = Number(kpi.scope_2?.percentage_of_total || (totalCurrent > 0 ? (s2Current / totalCurrent) * 100 : 0));

    const s3Current = Number(kpi.scope_3?.current_tco2e || 0);
    const s3Previous = Number(kpi.scope_3?.previous_tco2e || 0);
    const s3ChangePct = Number(kpi.scope_3?.change_pct || 0);
    const s3SharePct = Number(kpi.scope_3?.percentage_of_total || (totalCurrent > 0 ? (s3Current / totalCurrent) * 100 : 0));

    const bioCurrent = Number(kpi.biogenic_emissions?.current_tco2e || 0);
    const bioPrevious = Number(kpi.biogenic_emissions?.previous_tco2e || 0);
    const bioChangePct = Number(kpi.biogenic_emissions?.change_pct || 0);
    const bioSharePct = Number(kpi.biogenic_emissions?.percentage_of_total || 0);

    const perTonneProduct = Number(kpi.emissions_intensity?.per_tonne_product || 0);
    const perRevenueMillion = Number(kpi.emissions_intensity?.per_revenue_million || 0);

    // 1. Top KPI Summary Cards (6 Cards)
    const topKpiCards: TopKpiCardData[] = [
        {
            id: "total_emissions",
            label: "Total GHG Emissions",
            value: totalCurrent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            numericValue: totalCurrent,
            unit: "tCO2e",
            changePct: totalChangePct,
            changeLabel: "YoY Change",
            changeDirection: totalChangePct <= 0 ? "down" : "up",
            icon: "leaderboard",
            colorClassName: "text-primary",
            iconBgClassName: "bg-primary/10 text-primary",
        },
        {
            id: "scope_1",
            label: "Scope 1 Direct",
            value: s1Current.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            numericValue: s1Current,
            unit: "tCO2e",
            changePct: s1ChangePct,
            changeLabel: "YoY Change",
            changeDirection: s1ChangePct <= 0 ? "down" : "up",
            icon: "factory",
            colorClassName: "text-orange-600",
            iconBgClassName: "bg-orange-500/10 text-orange-600",
            subtitle: `${s1SharePct.toFixed(1)}% of total`,
        },
        {
            id: "scope_2",
            label: "Scope 2 Indirect",
            value: s2Current.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            numericValue: s2Current,
            unit: "tCO2e",
            changePct: s2ChangePct,
            changeLabel: "YoY Change",
            changeDirection: s2ChangePct <= 0 ? "down" : "up",
            icon: "bolt",
            colorClassName: "text-blue-600",
            iconBgClassName: "bg-blue-500/10 text-blue-600",
            subtitle: `${s2SharePct.toFixed(1)}% of total`,
        },
        {
            id: "scope_3",
            label: "Scope 3 Value Chain",
            value: s3Current.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            numericValue: s3Current,
            unit: "tCO2e",
            changePct: s3ChangePct,
            changeLabel: "YoY Change",
            changeDirection: s3ChangePct <= 0 ? "down" : "up",
            icon: "hub",
            colorClassName: "text-emerald-600",
            iconBgClassName: "bg-emerald-500/10 text-emerald-600",
            subtitle: `${s3SharePct.toFixed(1)}% of total`,
        },
        {
            id: "biogenic_emissions",
            label: "Biogenic Emissions",
            value: bioCurrent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            numericValue: bioCurrent,
            unit: "tCO2e",
            changePct: bioChangePct,
            changeLabel: "YoY Change",
            changeDirection: bioChangePct <= 0 ? "down" : "up",
            icon: "eco",
            colorClassName: "text-purple-600",
            iconBgClassName: "bg-purple-500/10 text-purple-600",
            subtitle: `${bioSharePct.toFixed(1)}% of total`,
        },
        {
            id: "emissions_intensity",
            label: "Emissions Intensity",
            value: perTonneProduct > 0 ? perTonneProduct.toFixed(4) : "—",
            numericValue: perTonneProduct,
            unit: "tCO2e / tonne product",
            icon: "speed",
            colorClassName: "text-sky-600",
            iconBgClassName: "bg-sky-500/10 text-sky-600",
            intensityTonne: perTonneProduct,
            intensityRevenue: perRevenueMillion,
            secondaryValue: perRevenueMillion > 0 ? perRevenueMillion.toFixed(4) : "—",
            secondaryLabel: "tCO2e / M INR revenue",
        },
    ];

    // 2. Scope Distribution (Chart 1)
    const SCOPE_COLORS: Record<string, string> = {
        "Scope 1": "#f97316",
        "Scope 2": "#3b82f6",
        "Scope 3": "#10b981",
    };

    const rawScopeDist = raw.scope_distribution || [
        { scope_name: "Scope 1", tco2e: s1Current, share_pct: s1SharePct },
        { scope_name: "Scope 2", tco2e: s2Current, share_pct: s2SharePct },
        { scope_name: "Scope 3", tco2e: s3Current, share_pct: s3SharePct },
    ];

    const scopeDistribution: ScopeDistributionItem[] = rawScopeDist.map((sd) => ({
        scopeName: sd.scope_name,
        tco2e: Number(sd.tco2e || 0),
        sharePct: Number(sd.share_pct || 0),
        color: SCOPE_COLORS[sd.scope_name] || "#64748b",
    }));

    // 3. Yearly Emissions Trend (Chart 2)
    const yearlyTrend: YearlyEmissionsTrendPoint[] = (raw.yearly_emissions_trend || []).map((y) => ({
        year: Number(y.year || 0),
        yearLabel: y.year_label || `FY ${y.year}`,
        totalTco2e: Number(y.total_tco2e || 0),
        scope1Tco2e: Number(y.scope_1_tco2e || 0),
        scope2Tco2e: Number(y.scope_2_tco2e || 0),
        scope3Tco2e: Number(y.scope_3_tco2e || 0),
        yoyChangePct: Number(y.yoy_change_pct || 0),
    }));

    // 4. Detailed Source Breakdowns
    const dsb = raw.detailed_source_breakdowns || {};
    const detailedSourceBreakdowns = {
        scope1: {
            stationaryCombustion: Number(dsb.scope_1?.stationary_combustion_tco2e || 0),
            mobileCombustion: Number(dsb.scope_1?.mobile_combustion_tco2e || 0),
            processEmissions: Number(dsb.scope_1?.process_emissions_tco2e || 0),
            fugitiveEmissions: Number(dsb.scope_1?.fugitive_emissions_tco2e || 0),
            total: Number(dsb.scope_1?.total_tco2e || s1Current),
        },
        scope2: {
            purchasedElectricity: Number(dsb.scope_2?.purchased_electricity_tco2e || 0),
            purchasedSteam: Number(dsb.scope_2?.purchased_steam_tco2e || 0),
            purchasedHeatCooling: Number(dsb.scope_2?.purchased_heat_cooling_tco2e || 0),
            locationBased: Number(dsb.scope_2?.location_based_tco2e || 0),
            marketBased: Number(dsb.scope_2?.market_based_tco2e || 0),
            total: Number(dsb.scope_2?.total_tco2e || s2Current),
        },
        scope3: {
            categories: (dsb.scope_3?.categories || []).map((cat) => ({
                categoryCode: cat.category_code,
                categoryName: cat.category_name,
                tco2e: Number(cat.tco2e || 0),
                sharePct: Number(cat.share_pct || 0),
            })),
            total: Number(dsb.scope_3?.total_tco2e || s3Current),
        },
    };

    // 5. Top 5 Emission Sources Across All Scopes
    const top5EmissionSources: TopEmissionSourceItem[] = (raw.top_5_emission_sources || []).map((src) => ({
        rank: Number(src.rank || 1),
        sourceName: src.source_name,
        scopeName: src.scope_name,
        tco2e: Number(src.tco2e || 0),
        sharePct: Number(src.share_pct || 0),
    }));

    // Legacy compatibility fields
    const metricCards: MetricCardData[] = topKpiCards.slice(0, 4).map((c) => ({
        id: c.id,
        label: c.label,
        icon: c.icon,
        value: c.numericValue,
        unit: c.unit,
        trend: {
            value: `${c.changePct && c.changePct >= 0 ? "+" : ""}${(c.changePct || 0).toFixed(1)}%`,
            direction: (c.changePct || 0) <= 0 ? "down" : "up",
        },
        progressPercent: 100,
        progressClassName: "bg-primary",
    }));

    const emissionsTrend: EmissionsTrendPoint[] = (raw.emissions_trend || []).map((item) => ({
        month: item.period_key,
        actual: Number(item.actual_tco2e || 0),
        target: Number(item.target_tco2e || 0),
    }));

    const monthlyScopeComparison: ScopeComparisonMonth[] = (raw.monthly_scope_comparison || []).map((m) => ({
        month: `${m.month_name.slice(0, 3)} '${m.year.toString().slice(2)}`,
        scope1: Number(m.scope_1_tco2e || 0),
        scope2: Number(m.scope_2_tco2e || 0),
    }));

    const GAS_COLORS: Record<string, string> = {
        CO2: "#10b981",
        CH4: "#60a5fa",
        N2O: "#fb923c",
        "Biogenic CO2": "#a855f7",
    };

    const gasBreakdown: Scope2Segment[] = (raw.gas_breakdown || []).map((g) => ({
        label: g.gas_name,
        percent: Number(g.share_pct || 0),
        color: GAS_COLORS[g.gas_name] || "var(--gl-secondary)",
    }));

    const rawFuels = raw.source_categories?.fuel_breakdown || [];
    const fuelBreakdown: Scope1FuelItem[] = [...rawFuels]
        .sort((a, b) => Number(b.tco2e || 0) - Number(a.tco2e || 0))
        .slice(0, 5)
        .map((f) => ({
            label: f.fuel_name,
            value: Number(f.tco2e || 0),
            unit: "tCO2e",
            percent: Number(f.share_pct || 0),
        }));

    const categories = (raw.source_categories?.categories || []).map((c) => ({
        categoryName: c.category_name,
        scopeType: c.scope_type,
        tco2e: Number(c.tco2e || 0),
        sharePct: Number(c.share_pct || 0),
    }));

    const rawFacilities = raw.top_facilities || [];
    const facilityRows: FacilityRow[] = [...rawFacilities]
        .sort((a, b) => Number(b.total_tco2e || 0) - Number(a.total_tco2e || 0))
        .slice(0, 5)
        .map((f) => {
            const yoyVal = Number(f.yoy_change_pct || 0);
            return {
                id: f.facility_code || (f.facility_id ? f.facility_id.slice(0, 8) : "FAC"),
                region: `${f.facility_name} (${f.city}, ${f.country})`,
                status: f.is_active ? "ACTIVE" : "INACTIVE",
                emissions: Number(f.total_tco2e || 0),
                yoyChange: `${yoyVal >= 0 ? "+" : ""}${yoyVal.toFixed(1)}%`,
                yoyDirection: yoyVal <= 0 ? "down" : "up",
                dataQuality: Number(f.data_quality?.measured_pct || 100),
            };
        });

    const recentActivities: ActivityItem[] = (raw.recent_activities || [])
        .slice(0, 12)
        .map((act) => {
            const isScope1 = act.scope === "Scope 1";
            const isScope2 = act.scope === "Scope 2";
            return {
                id: act.activity_id,
                icon: isScope1 ? "local_fire_department" : isScope2 ? "bolt" : "hub",
                iconBgClassName: isScope1
                    ? "bg-orange-500/10 text-orange-500"
                    : isScope2
                    ? "bg-blue-500/10 text-blue-500"
                    : "bg-emerald-500/10 text-emerald-500",
                iconColorClassName: isScope1 ? "text-orange-500" : isScope2 ? "text-blue-500" : "text-emerald-500",
                title: act.activity_title,
                subtitle: `${act.facility_name ? act.facility_name + " • " : ""}${act.activity_date} • ${Number(act.tco2e).toFixed(2)} tCO2e • ${act.status.toUpperCase()}`,
            };
        });

    return {
        topKpiCards,
        scopeDistribution,
        yearlyTrend,
        detailedSourceBreakdowns,
        top5EmissionSources,
        metricCards,
        emissionsTrend,
        monthlyScopeComparison,
        gasBreakdown,
        fuelBreakdown,
        categories,
        facilityRows,
        recentActivities,
        netZeroProgress: kpi.net_zero_progress
            ? {
                  reductionPct: Number(kpi.net_zero_progress.reduction_pct || 0),
                  statusLabel: kpi.net_zero_progress.status_label || "On Track",
                  targetYear: kpi.net_zero_progress.target_year || 2030,
                  baselineYear: kpi.net_zero_progress.baseline_year || 2021,
              }
            : undefined,
        raw,
    };
}

export async function getGhgDashboard(): Promise<ParsedGhgDashboardData> {
    const response = await privateApi.get<GhgDashboardApiResponse>("/tenant/ghg/dashboard");
    if (!response.data || !response.data.data) {
        throw new Error("Failed to load GHG dashboard data");
    }
    return parseGhgDashboardData(response.data.data);
}
