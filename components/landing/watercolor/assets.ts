import { getImageProps, type StaticImageData } from "next/image";

import logo from "@/assets/GLLogo.png";
import startupIndia from "@/assets/startupIndia.png";
import entrepreneurCafe from "@/assets/entrepreneurCafe.jpg";
import rpsg2 from "@/assets/rpsgLogo2.jpg";
import rpsg3 from "@/assets/rpsgLogo3.jpg";
import imi from "@/assets/IMIKolkata.jpg";
import sepc from "@/assets/sepc.png";
import iso from "@/assets/isoCertifaction.png";
import insight from "@/public/insights/demo_insight_image.jpg";
import steel from "@/assets/landing-images/blast-furnace.jpg";
import cement from "@/assets/landing-images/cement-kiln.jpg";
import finance from "@/assets/landing-images/bse-dalal-street.jpg";
import logistics from "@/assets/landing-images/container-port.jpg";
import boiler from "@/assets/boiler-house.jpg";
import pylon from "@/assets/anchor-pylon-of-high-voltage-overhead-power.jpg";
import koki from "@/assets/jrf-koki-104-1552.jpg";
import gri from "@/assets/standards/GRI-removebg-preview.png";
import brsr from "@/assets/standards/BRSR_logo.png";
import epa from "@/assets/standards/epa.png";
import ghg from "@/assets/standards/ghg_protocol3-removebg-preview.png";
import ipcc from "@/assets/standards/ipcc.png";
import tcfd from "@/assets/standards/tfcd-removebg-preview.png";
import sayan from "@/assets/team/Carousel Sample SM1.png";
import annyotamo from "@/assets/team/team-3.jpeg";
import juhi from "@/assets/team/team-4.jpeg";
import shubhi from "@/assets/team/team-5.jpeg";

/** URL of a resized copy from Next's image optimiser, so the 1–2 MB originals never reach the browser. */
const sized = (img: StaticImageData, width: number) =>
    getImageProps({ src: img, alt: "", width, height: Math.round((img.height * width) / img.width) }).props.src;

export const IMG = {
    logo: logo.src,
    startupIndia: startupIndia.src,
    entrepreneurCafe: entrepreneurCafe.src,
    rpsg2: rpsg2.src,
    rpsg3: rpsg3.src,
    imi: imi.src,
    sepc: sepc.src,
    iso: iso.src,
    insight: sized(insight, 1200),
    steel: sized(steel, 1920),
    cement: sized(cement, 1920),
    finance: sized(finance, 1920),
    logistics: sized(logistics, 1920),
};

/** Images the effects script builds into markup, keyed by the path it used in the design file (relative to assets/). */
const RUNTIME: Record<string, string> = {
    "landing-images/blast-furnace.jpg": IMG.steel,
    "landing-images/cement-kiln.jpg": IMG.cement,
    "landing-images/bse-dalal-street.jpg": IMG.finance,
    "landing-images/container-port.jpg": IMG.logistics,
    "standards/GRI-removebg-preview.png": sized(gri, 320),
    "standards/BRSR_logo.png": sized(brsr, 320),
    "standards/epa.png": sized(epa, 320),
    "standards/ghg_protocol3-removebg-preview.png": sized(ghg, 320),
    "standards/ipcc.png": sized(ipcc, 320),
    "standards/tfcd-removebg-preview.png": sized(tcfd, 320),
    "team/Carousel Sample SM1.png": sized(sayan, 720),
    "team/team-3.jpeg": sized(annyotamo, 720),
    "team/team-4.jpeg": sized(juhi, 720),
    "team/team-5.jpeg": sized(shubhi, 720),
};

/** One photograph per emission scope, used by the GHG Accounting page's scope ledger. */
export const SCOPE_PHOTO = { 1: sized(boiler, 1400), 2: sized(pylon, 1400), 3: sized(koki, 1400) } as const;

export function runtimeAsset(p: string): string {
    const url = RUNTIME[p];
    if (!url) throw new Error(`watercolor landing: no asset registered for "${p}"`);
    return url;
}
