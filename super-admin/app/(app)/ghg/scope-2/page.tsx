import Link from "next/link";

export default function Scope2Page() {
  return (
    <div className="gl-card p-6">
      <h1 className="text-lg font-semibold tracking-tight">Scope 2</h1>
      <p className="mt-2 text-sm text-(--muted)">
        Manage Scope 2 factors and versioned emission values.
      </p>

      <div className="mt-4">
        <Link
          href="/ghg/scope-2/factors"
          className="inline-flex items-center rounded-xl bg-(--brand) px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
        >
          Open Scope 2 factors
        </Link>
      </div>
    </div>
  );
}

