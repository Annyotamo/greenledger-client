import Image from "next/image";
import Link from "next/link";
import greenLedgerLogo from "@/assets/GLLogo.png";

const navLinks = [
    { href: "/#pillars", label: "Platform" },
    { href: "/#deep-dive", label: "Solutions" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#traceability", label: "Traceability" },
    { href: "/#cta", label: "Demo" },
];

const Navbar = () => {
    return (
        <header className="absolute top-0 z-50 w-full bg-transparent backdrop-filter-none">
            <nav className="mx-auto flex w-full max-w-400 items-center justify-between gap-4 px-4 py-4 sm:px-5 md:px-6 lg:px-7 bg-transparent">
                <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <Image
                        src={greenLedgerLogo}
                        width={56}
                        height={56}
                        alt="GreenLedger"
                        className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
                    />
                    <span className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        GreenLedger
                    </span>
                </Link>

                <ul className="hidden items-center gap-1 text-md font-medium text-white/85 md:flex md:gap-2">
                    {navLinks.map((l) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                className="px-3 py-2 hover:text-[16.75px] hover:text-white hover:px-4 transition-all duration-100 ">
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-2">
                    <Link
                        href="/#cta"
                        className="shrink-0 rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:px-4 sm:text-sm">
                        Book demo
                    </Link>
                    <Link
                        href="/login"
                        className="hidden shrink-0 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition hover:border-white/50 hover:bg-white/20 sm:inline-flex sm:px-4 sm:text-sm">
                        Client login
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
