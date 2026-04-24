"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiBars3BottomRight } from "react-icons/hi2";
import { FiChevronDown } from "react-icons/fi";

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const NAV: NavItem[] = [
  {
    label: "GHG",
    href: "/ghg",
    children: [
      {
        label: "Scope 1",
        href: "/ghg/scope-1",
        children: [{ label: "Factors", href: "/ghg/scope-1/factors" }],
      },
    ],
  },
];

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);

  const activeTop = useMemo(() => NAV.find((n) => isActive(pathname, n.href))?.label ?? null, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl border border-black/5 bg-white grid place-items-center shadow-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-(--brand) shadow-[0_0_18px_rgba(37,99,235,0.30)]" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">GreenLedger</div>
              <div className="text-[11px] text-(--muted) -mt-0.5">Super Admin</div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpen(item.label)}
              onMouseLeave={() => setOpen((cur) => (cur === item.label ? null : cur))}
            >
              <Link
                href={item.href ?? "#"}
                className={[
                  "px-3 py-2 rounded-full text-sm flex items-center gap-1.5 transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-black/5 text-black"
                    : "text-black/80 hover:bg-black/5",
                ].join(" ")}
              >
                <span>{item.label}</span>
                {item.children?.length ? <FiChevronDown className="opacity-70" /> : null}
              </Link>

              <AnimatePresence>
                {open === item.label && item.children?.length ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-56 gl-card p-2 shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
                  >
                    {item.children.map((c) => (
                      <NestedItem key={c.label} item={c} pathname={pathname} />
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="relative">
          <button
            className={[
              "px-3 py-2 text-sm flex items-center gap-2 rounded-full bg-white shadow-sm border border-black/5 hover:bg-black/5 transition-colors",
              accountOpen ? "bg-black/5" : "",
            ].join(" ")}
            onClick={() => setAccountOpen((v) => !v)}
            aria-label="Account menu"
          >
            <HiBars3BottomRight className="text-lg opacity-85" />
            <div className="flex flex-col leading-[1.05] text-left">
              <span className="text-xs text-(--muted)">Account</span>
              <span className="text-sm font-medium">{activeTop ?? "Menu"}</span>
            </div>
          </button>

          <AnimatePresence>
            {accountOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-44 gl-card p-2 shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
              >
                <Link
                  href="/login"
                  className="block rounded-xl px-3 py-2 text-sm hover:bg-black/5"
                  onClick={() => setAccountOpen(false)}
                >
                  Login
                </Link>
                <button
                  className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-black/5"
                  onClick={logout}
                >
                  Logout
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NestedItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={item.href ?? "#"}
        className={[
          "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
          isActive(pathname, item.href) ? "bg-black/5" : "hover:bg-black/5",
        ].join(" ")}
      >
        <span>{item.label}</span>
        {item.children?.length ? <FiChevronDown className="-rotate-90 opacity-70" /> : null}
      </Link>

      <AnimatePresence>
        {open && item.children?.length ? (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-2 w-52 gl-card p-2 shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
          >
            {item.children.map((c) => (
              <Link
                key={c.label}
                href={c.href ?? "#"}
                className={[
                  "block rounded-xl px-3 py-2 text-sm transition-colors",
                  isActive(pathname, c.href) ? "bg-black/5" : "hover:bg-black/5",
                ].join(" ")}
              >
                {c.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

