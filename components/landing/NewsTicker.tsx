import React from "react";
import { FaGlobe } from "react-icons/fa";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

const NEWS = [
    "The SEC has launched a formal process to rescind corporate climate reporting rules, moving to scrap previous climate disclosure mandates.",
    "DigitalBridge acquired electrification and decarbonization investor ArcLight for $1 billion to scale AI and power grid infrastructure.",
    "Fusion startups saw major capital injections, including Thea Energy raising $100 million and Focused Energy securing $240 million for laser fusion power in Germany.",
    "McDonald's announced it will miss its 2030 value chain decarbonization target, but reaffirmed its commitment to reaching net-zero emissions by 2050.",
    "The European Investment Fund backed a €200 million European biomethane investment fund alongside CIP to accelerate renewable gas projects.",
    "Stockholm officially became the world's fifth largest buyer of permanent carbon removals to offset municipal emissions.",
];

const ICONS = ["public", "bolt", "rocket_launch", "flag", "currency_eur", "location_on"];

export default function NewsTicker() {
    return (
        <section className="full-bleed overflow-hidden bg-emerald-950/95 px-4 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:px-6">
            <div className="flex h-20 items-center overflow-hidden">
                <div className="news-ticker-track inline-flex min-w-max items-center gap-8 whitespace-nowrap text-body-lg font-body-lg text-emerald-100">
                    {NEWS.concat(NEWS).map((item, idx) => (
                        <span key={idx} className="news-ticker-item inline-flex items-center gap-3 pr-14 text-left">
                            <FaGlobe className="text-emerald-200/90" />
                            <span className="max-w-136 truncate text-emerald-100/95">{item}</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
