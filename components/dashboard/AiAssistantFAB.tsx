"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function AiAssistantFAB() {
    return (
        <div className="pointer-events-none fixed bottom-8 right-8 z-60 flex items-center">
            <button
                type="button"
                className="pointer-events-auto group flex items-center gap-3 rounded-2xl border border-white/20 bg-primary px-4 py-3 text-on-primary shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-95">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-container transition-transform group-hover:rotate-12">
                    <MaterialIcon name="smart_toy" className="text-on-secondary-container" />
                </span>
                <span className="flex flex-col items-start leading-tight">
                    <span className="font-mono text-[12px] font-bold">Ask Assistant</span>
                    <span className="font-mono text-[9px] uppercase tracking-widest opacity-70">AI Insights Ready</span>
                </span>
            </button>
        </div>
    );
}
