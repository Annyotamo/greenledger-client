"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiX } from "react-icons/fi";
import { Sidebar } from "@/components/dashboard/SidebarShell";
import { useSidebarStore } from "@/lib/sidebarStore";
import { getCompanyDetails } from "@/lib/report/api";
import { useCompanyStore } from "@/lib/companyStore";
import { addUser, getAllUsers, type NewUserInput, type UserRecord } from "@/lib/user/api";

const defaultPermissions = {
    scope1: "WRITE",
    scope2: "READ_ONLY",
    facilities: "WRITE",
    users: "NO_ACCESS",
    company: "READ_ONLY",
    reports: "NO_ACCESS",
} as const;

const defaultUserForm: NewUserInput = {
    name: "",
    email: "",
    company: "",
    tenantId: "",
    role: "ADMIN",
    facilityName: "",
    facilityId: "",
    phNo: "",
    userName: "",
    password: "",
    superAdmin: false,
    permissions: { ...defaultPermissions },
};

export default function UsersPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);
    const setActiveSection = useSidebarStore((s) => s.setActiveSection);

    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [formState, setFormState] = useState<NewUserInput>({ ...defaultUserForm });

    const companyDetails = useCompanyStore((state) => state.companyDetails);
    const setCompanyDetails = useCompanyStore((state) => state.setCompanyDetails);

    useEffect(() => {
        setActiveSection("users");
        loadUsers();

        if (!companyDetails) {
            loadCompanyDetails();
        }
    }, [setActiveSection, companyDetails]);

    async function loadUsers() {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unable to load users.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    async function loadCompanyDetails() {
        try {
            const details = await getCompanyDetails();
            if (details) {
                setCompanyDetails(details);
            }
        } catch (err) {
            console.error("Failed to load company details for team page:", err);
        }
    }

    async function handleAddUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setSubmitError(null);

        if (!formState.name || !formState.email || !formState.userName || !formState.password) {
            setSubmitError("Please complete all required fields.");
            setSaving(false);
            return;
        }

        if (!companyDetails) {
            setSubmitError("Unable to resolve company details. Please visit the company page first.");
            setSaving(false);
            return;
        }

        const payload: NewUserInput = {
            ...formState,
            company: companyDetails.displayName,
            tenantId: companyDetails.tenantId,
        };

        try {
            await addUser(payload);
            setFormState({ ...defaultUserForm });
            setShowAddForm(false);
            await loadUsers();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to add user.";
            setSubmitError(message);
        } finally {
            setSaving(false);
        }
    }

    function updateField<Key extends keyof NewUserInput>(field: Key, value: NewUserInput[Key]) {
        setFormState((current) => ({ ...current, [field]: value }));
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
            <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden z-0">
                <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-300/15 blur-[140px] animate-pulse" />
                <div
                    className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-300/15 blur-[120px] animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-green-300/10 blur-[100px]" />
            </div>

            <Sidebar />

            <main
                className={[
                    "gl-main-offset relative z-10 px-4 pb-16 pt-20 sm:px-6 lg:pr-12 lg:pt-10",
                    !sidebarOpen ? "gl-main-offset--collapsed" : "",
                ].join(" ")}>
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700/80">
                                Team Management
                            </p>
                            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                                Team
                            </h1>
                            <p className="mt-3 max-w-2xl text-base font-medium text-slate-600">
                                View and add team members for your organization.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddForm((current) => !current);
                                setSubmitError(null);
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.8)] transition-all duration-200 hover:bg-emerald-700 hover:shadow-[0_14px_35px_-14px_rgba(16,185,129,0.9)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                            <FiPlus className="h-4 w-4" />
                            {showAddForm ? "Close form" : "Add new user"}
                        </button>
                    </motion.div>

                    <AnimatePresence>
                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center sm:p-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                    transition={{ duration: 0.25 }}
                                    className="scrollbar-thin w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[2rem] border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10">
                                    <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">Add team member</h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Add a new member to your company team.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
                                            <FiX className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <form
                                        onSubmit={handleAddUser}
                                        className="grid gap-6 px-6 py-6 md:grid-cols-[1.2fr_0.8fr]">
                                        <div className="space-y-4">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                                    Name
                                                    <input
                                                        value={formState.name}
                                                        onChange={(event) => updateField("name", event.target.value)}
                                                        required
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </label>
                                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                                    Email
                                                    <input
                                                        value={formState.email}
                                                        onChange={(event) => updateField("email", event.target.value)}
                                                        type="email"
                                                        required
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </label>
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                                    User name
                                                    <input
                                                        value={formState.userName}
                                                        onChange={(event) =>
                                                            updateField("userName", event.target.value)
                                                        }
                                                        required
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </label>
                                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                                    Password
                                                    <input
                                                        value={formState.password}
                                                        onChange={(event) =>
                                                            updateField("password", event.target.value)
                                                        }
                                                        type="password"
                                                        required
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </label>
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                                    Role
                                                    <select
                                                        value={formState.role}
                                                        onChange={(event) => updateField("role", event.target.value)}
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                                                        <option value="ADMIN">ADMIN</option>
                                                        <option value="USER">USER</option>
                                                        <option value="VIEWER">VIEWER</option>
                                                    </select>
                                                </label>
                                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                                    Phone
                                                    <input
                                                        value={formState.phNo}
                                                        onChange={(event) => updateField("phNo", event.target.value)}
                                                        type="tel"
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </label>
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                                    Facility name
                                                    <input
                                                        value={formState.facilityName}
                                                        onChange={(event) =>
                                                            updateField("facilityName", event.target.value)
                                                        }
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </label>
                                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                                    Facility ID
                                                    <input
                                                        value={formState.facilityId}
                                                        onChange={(event) =>
                                                            updateField("facilityId", event.target.value)
                                                        }
                                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">Permissions</p>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Grant access levels for each area.
                                                    </p>
                                                </div>
                                                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                                    {formState.superAdmin ? "Super Admin" : "Standard"}
                                                </span>
                                            </div>
                                            <div className="grid gap-4">
                                                {(
                                                    Object.entries(formState.permissions) as Array<
                                                        [
                                                            keyof typeof formState.permissions,
                                                            (typeof formState.permissions)[keyof typeof formState.permissions],
                                                        ]
                                                    >
                                                ).map(([key, value]) => (
                                                    <label
                                                        key={key}
                                                        className="space-y-2 text-sm font-medium text-slate-700">
                                                        {key
                                                            .replace(/([A-Z])/g, " $1")
                                                            .replace(/^./, (str) => str.toUpperCase())}
                                                        <select
                                                            value={value}
                                                            onChange={(event) =>
                                                                setFormState((current) => ({
                                                                    ...current,
                                                                    permissions: {
                                                                        ...current.permissions,
                                                                        [key]: event.target.value as
                                                                            | "WRITE"
                                                                            | "READ_ONLY"
                                                                            | "NO_ACCESS",
                                                                    },
                                                                }))
                                                            }
                                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                                                            <option value="WRITE">WRITE</option>
                                                            <option value="READ_ONLY">READ_ONLY</option>
                                                            <option value="NO_ACCESS">NO_ACCESS</option>
                                                        </select>
                                                    </label>
                                                ))}
                                            </div>
                                            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={formState.superAdmin}
                                                    onChange={(event) =>
                                                        updateField("superAdmin", event.target.checked)
                                                    }
                                                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                Grant super admin privileges
                                            </label>
                                            {submitError ? (
                                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                                    {submitError}
                                                </div>
                                            ) : null}
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="inline-flex items-center justify-center w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.9)] transition-all duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                                                {saving ? "Saving team member..." : "Create team member"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
                        <div className="border-b border-slate-200 px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Team directory</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    All team members loaded from the backend with bearer-auth protected calls.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600">
                                {users.length} members
                            </div>
                        </div>

                        <div className="min-w-full overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                                        <th className="px-6 py-4 font-semibold text-slate-700">Last login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    <AnimatePresence>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-24 text-center text-slate-500">
                                                    Loading team members...
                                                </td>
                                            </tr>
                                        ) : error ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-24 text-center text-rose-600">
                                                    {error}
                                                </td>
                                            </tr>
                                        ) : users.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-24 text-center text-slate-600">
                                                    No team members found yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <motion.tr
                                                    key={user.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="hover:bg-slate-50">
                                                    <td className="px-6 py-4 text-slate-900">{user.name}</td>
                                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                                    <td className="px-6 py-4 text-slate-600">{user.role}</td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {user.lastLogin ?? "—"}
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
