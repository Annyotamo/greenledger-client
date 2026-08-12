import React from "react";
import {
    LuTarget,
    LuShieldCheck,
    LuLayers,
    LuFlame,
    LuFlaskConical,
    LuZap,
    LuGitBranch,
    LuGlobe,
    LuTrendingUp,
    LuFileCheck,
    LuWind,
    LuLock,
    LuBuilding2,
    LuUserCheck,
    LuLayoutDashboard,
    LuSparkles,
    LuArrowRight,
    LuCheck,
    LuTriangleAlert,
    LuBanknote,
    LuArrowUpRight,
    LuChevronRight,
    LuSlidersHorizontal,
    LuLayoutGrid,
} from "react-icons/lu";

interface IconProps {
    name: string;
    className?: string;
}

export function BeforeAfterIcon({ name, className = "w-5 h-5" }: IconProps) {
    switch (name) {
        case "TargetIcon":
            return <LuTarget className={className} />;
        case "ShieldCheckIcon":
            return <LuShieldCheck className={className} />;
        case "LayersIcon":
            return <LuLayers className={className} />;
        case "FlameIcon":
            return <LuFlame className={className} />;
        case "TestTubeIcon":
            return <LuFlaskConical className={className} />;
        case "ZapIcon":
            return <LuZap className={className} />;
        case "GitBranchIcon":
            return <LuGitBranch className={className} />;
        case "GlobeIcon":
            return <LuGlobe className={className} />;
        case "TrendingUpIcon":
            return <LuTrendingUp className={className} />;
        case "FileCheckIcon":
            return <LuFileCheck className={className} />;
        case "WindIcon":
            return <LuWind className={className} />;
        case "LockIcon":
            return <LuLock className={className} />;
        case "Building2Icon":
            return <LuBuilding2 className={className} />;
        case "UserCheckIcon":
            return <LuUserCheck className={className} />;
        case "LayoutDashboardIcon":
            return <LuLayoutDashboard className={className} />;
        case "SparklesIcon":
            return <LuSparkles className={className} />;
        case "ArrowRightIcon":
            return <LuArrowRight className={className} />;
        case "CheckIcon":
            return <LuCheck className={className} />;
        case "AlertTriangleIcon":
            return <LuTriangleAlert className={className} />;
        case "BanknoteIcon":
            return <LuBanknote className={className} />;
        case "ArrowUpRightIcon":
            return <LuArrowUpRight className={className} />;
        case "ChevronRightIcon":
            return <LuChevronRight className={className} />;
        case "SlidersIcon":
            return <LuSlidersHorizontal className={className} />;
        case "GridIcon":
            return <LuLayoutGrid className={className} />;
        default:
            return <LuSparkles className={className} />;
    }
}
