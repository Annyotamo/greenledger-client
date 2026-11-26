"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/lib/rbac/hooks";
import { useToggleMfa, useUpdateProfile } from "@/lib/user/hooks";
import { useFacilities } from "@/lib/facility/hooks";
import type { UserProfile } from "@/lib/rbac/types";
import { cn } from "@/lib/utils/cn";

// ----------------------------------------------------------------------------
// Password Confirmation Modal for MFA Toggle
// ----------------------------------------------------------------------------
function MfaPasswordModal({
    isOpen,
    targetState,
    onClose,
    onConfirm,
    isPending,
    error,
}: {
    isOpen: boolean;
    targetState: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
    isPending: boolean;
    error: string | null;
}) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                                <MaterialIcon name="lock" size="md" />
                            </div>
                            <div>
                                <h3 className="font-display text-headline-sm font-bold text-primary">
                                    {targetState ? "Enable Multi-Factor Auth" : "Disable Multi-Factor Auth"}
                                </h3>
                                <p className="font-sans text-xs text-on-surface-variant">
                                    Security verification required
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-1 text-on-surface-variant transition hover:bg-surface-container-high cursor-pointer">
                            <MaterialIcon name="close" size="sm" />
                        </button>
                    </div>

                    <p className="mt-4 font-sans text-xs leading-relaxed text-on-surface-variant">
                        To {targetState ? "enable" : "disable"} two-factor authentication on your account, please confirm your current GreenLedger account password.
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (password) onConfirm(password);
                        }}
                        className="mt-4 space-y-4">
                        <div>
                            <label className="font-sans text-xs font-semibold text-primary block mb-1.5">
                                Current Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your current password"
                                    autoFocus
                                    disabled={isPending}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
                                    disabled={isPending}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface cursor-pointer">
                                    <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} size="xs" />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg border border-error/30 bg-error/10 p-2.5 text-xs font-medium text-error flex items-center gap-2">
                                <MaterialIcon name="error" size="xs" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={onClose}
                                disabled={isPending}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={isPending || !password}>
                                {isPending ? "Verifying..." : targetState ? "Enable MFA" : "Disable MFA"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

// ----------------------------------------------------------------------------
// Editable Profile Section Component
// ----------------------------------------------------------------------------
function ProfileFormCard({
    user,
    onSaveSuccess,
    onSaveError,
}: {
    user: UserProfile;
    onSaveSuccess: (msg: string) => void;
    onSaveError: (msg: string) => void;
}) {
    const updateProfileMutation = useUpdateProfile();

    const [firstName, setFirstName] = useState(user.first_name || "");
    const [lastName, setLastName] = useState(user.last_name || "");
    const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");
    const [jobTitle, setJobTitle] = useState(user.job_title || "");
    const [bio, setBio] = useState(user.bio || "");
    const [backgroundUrl, setBackgroundUrl] = useState(user.background || "");
    const [logoUrl, setLogoUrl] = useState(user.logo || user.avatar || "");
    const [showAssetInputs, setShowAssetInputs] = useState(false);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfileMutation.mutateAsync({
                first_name: firstName.trim() || null,
                last_name: lastName.trim() || null,
                phone_number: phoneNumber.trim() || null,
                job_title: jobTitle.trim() || null,
                bio: bio.trim() || null,
                background: backgroundUrl.trim() || null,
                logo: logoUrl.trim() || null,
            });
            onSaveSuccess("Your profile information has been saved successfully.");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to update profile. Please try again.";
            onSaveError(msg);
        }
    };

    return (
        <Card>
            <CardHeader tone="strip" bordered>
                <div className="flex items-center gap-2">
                    <MaterialIcon name="badge" size="sm" className="text-on-surface-variant" />
                    <h3 className="font-display text-headline-sm font-semibold text-primary">
                        Personal & Contact Details
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => setShowAssetInputs((prev) => !prev)}
                    className="font-sans text-xs text-secondary hover:underline cursor-pointer inline-flex items-center gap-1 font-medium">
                    <MaterialIcon name="tune" size="xs" />
                    <span>{showAssetInputs ? "Hide Image URLs" : "Edit Image URLs"}</span>
                </button>
            </CardHeader>

            <CardBody>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="font-sans text-xs font-semibold text-primary block mb-1.5">
                                First Name
                            </label>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Jane"
                                required
                            />
                        </div>
                        <div>
                            <label className="font-sans text-xs font-semibold text-primary block mb-1.5">
                                Last Name
                            </label>
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="font-sans text-xs font-semibold text-primary block mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Input
                                    value={user.email}
                                    disabled
                                    className="bg-surface-container-high/40 text-on-surface-variant cursor-not-allowed pr-8 font-mono text-xs"
                                />
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary">
                                    <MaterialIcon name="verified" size="xs" />
                                </div>
                            </div>
                            <p className="mt-1 text-[11px] text-on-surface-variant">
                                Tenant-managed account email.
                            </p>
                        </div>

                        <div>
                            <label className="font-sans text-xs font-semibold text-primary block mb-1.5">
                                Phone Number
                            </label>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-sans text-xs font-semibold text-primary block mb-1.5">
                            Job Title / Organizational Position
                        </label>
                        <Input
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Chief Sustainability Officer / ESG Lead"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="font-sans text-xs font-semibold text-primary">
                                Professional Bio
                            </label>
                            <span className="font-mono text-[11px] text-on-surface-variant">
                                {bio.length}/500 chars
                            </span>
                        </div>
                        <textarea
                            rows={4}
                            maxLength={500}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write a brief description of your role, ESG targets, or plant responsibilities..."
                            className="w-full rounded-lg border border-outline-variant bg-white p-3 font-sans text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                        />
                    </div>

                    {/* Expandable Image URLs */}
                    <AnimatePresence>
                        {showAssetInputs && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pt-2 border-t border-outline-variant grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="font-sans text-xs font-semibold text-primary block mb-1">
                                        Cover Photo URL
                                    </label>
                                    <Input
                                        value={backgroundUrl}
                                        onChange={(e) => setBackgroundUrl(e.target.value)}
                                        placeholder="https://example.com/banner.jpg"
                                    />
                                    <p className="mt-1 text-[11px] text-on-surface-variant font-sans">
                                        High-resolution banner background image.
                                    </p>
                                </div>
                                <div>
                                    <label className="font-sans text-xs font-semibold text-primary block mb-1">
                                        Avatar Photo URL
                                    </label>
                                    <Input
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        placeholder="https://example.com/avatar.png"
                                    />
                                    <p className="mt-1 text-[11px] text-on-surface-variant font-sans">
                                        Custom user avatar picture URL.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={updateProfileMutation.isPending}>
                            <MaterialIcon name="save" size="xs" />
                            <span>{updateProfileMutation.isPending ? "Saving changes..." : "Save Profile Changes"}</span>
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}

// ----------------------------------------------------------------------------
// Main Page View Component
// ----------------------------------------------------------------------------
export default function UserPage() {
    const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUser();
    const { data: facilities = [] } = useFacilities();
    const toggleMfaMutation = useToggleMfa();

    // UI Feedback state
    const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
    const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Media asset fallback states
    const [failedBannerUrl, setFailedBannerUrl] = useState<string | null>(null);
    const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

    const hasBanner = Boolean(user?.background && failedBannerUrl !== user.background);
    const avatarUrl = user?.logo || user?.avatar || null;
    const hasAvatar = Boolean(avatarUrl && failedAvatarUrl !== avatarUrl);

    // MFA Modal state
    const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
    const [targetMfaState, setTargetMfaState] = useState(false);
    const [mfaError, setMfaError] = useState<string | null>(null);

    // Handle MFA Toggle request
    const handleInitiateMfaToggle = () => {
        setTargetMfaState(!user?.mfa_enabled);
        setMfaError(null);
        setIsMfaModalOpen(true);
    };

    const handleConfirmMfaToggle = async (password: string) => {
        setMfaError(null);
        try {
            await toggleMfaMutation.mutateAsync({
                password,
                mfa_enabled: targetMfaState,
            });
            setIsMfaModalOpen(false);
            setSaveSuccessMessage(
                targetMfaState
                    ? "Multi-Factor Authentication enabled. Your account is now secured."
                    : "Multi-Factor Authentication has been disabled.",
            );
            setTimeout(() => setSaveSuccessMessage(null), 4000);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Authentication failed. Check your password.";
            setMfaError(msg);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(label);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (isUserLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                    Loading profile details...
                </p>
            </div>
        );
    }

    if (isUserError || !user) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                    <MaterialIcon name="error" size="md" />
                </div>
                <h3 className="font-display text-headline-sm font-semibold text-primary">Unable to load profile</h3>
                <p className="font-sans text-xs text-on-surface-variant max-w-sm">
                    There was an issue retrieving your account details. Please refresh or check your network connection.
                </p>
                <Link href="/dashboard">
                    <Button variant="secondary" size="md">
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    const assignedFacility = facilities.find(
        (f) => f.id === (user.assigned_facility_id || user.assigned_facility),
    ) || (user.facility ? {
        id: user.facility.id,
        name: user.facility.name,
        facilityCode: user.facility.facility_code || "—",
        city: user.facility.city || "—",
        country: user.facility.country || "—",
        facilityStatus: "active",
    } : null);

    const initials = `${(user.first_name || "").charAt(0)}${(user.last_name || "").charAt(0)}`.toUpperCase() || "GL";
    const roleLabel = (user.role || "USER").replace(/_/g, " ");

    return (
        <div className="space-y-6 pb-12 animate-fade-up max-w-7xl mx-auto">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-headline-lg font-bold text-primary tracking-tight">
                        Account Settings & Profile
                    </h1>
                    <p className="font-sans text-body-md text-on-surface-variant">
                        Manage your personal credentials, facility attribution, and account security.
                    </p>
                </div>
                <Link href="/dashboard">
                    <Button variant="secondary" size="md">
                        <MaterialIcon name="arrow_back" size="xs" />
                        <span>Dashboard</span>
                    </Button>
                </Link>
            </div>

            {/* Global Notification Alerts */}
            {saveSuccessMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 p-3.5 text-xs font-semibold text-secondary">
                    <MaterialIcon name="check_circle" size="sm" />
                    <span>{saveSuccessMessage}</span>
                </motion.div>
            )}

            {saveErrorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-xl border border-error/30 bg-error/10 p-3.5 text-xs font-semibold text-error">
                    <MaterialIcon name="error" size="sm" />
                    <span>{saveErrorMessage}</span>
                </motion.div>
            )}

            {/* Hero Profile Banner Card */}
            <Card className="overflow-hidden border border-outline-variant">
                {/* Banner / Cover Section */}
                <div className="relative h-48 sm:h-56 w-full bg-slate-900 overflow-hidden">
                    {hasBanner ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={user.background!}
                            alt="Profile Cover Banner"
                            onError={() => setFailedBannerUrl(user.background || null)}
                            className="h-full w-full object-cover select-none"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-r from-[#003723] via-[#006c49] to-[#0f2f14] relative">
                            {/* Decorative geometric patterns */}
                            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6cf8bb_1px,transparent_1px)] [background-size:16px_16px]" />
                            <div className="absolute right-8 bottom-4 text-white/10 font-mono text-5xl font-black select-none pointer-events-none">
                                GREENLEDGER
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Header Bar */}
                <div className="px-6 pb-6 pt-0 relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-28 w-28 rounded-2xl border-4 border-white bg-surface-container-lowest overflow-hidden shadow-md flex items-center justify-center">
                                {hasAvatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={avatarUrl!}
                                        alt={user.full_name}
                                        onError={() => setFailedAvatarUrl(avatarUrl)}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-secondary text-on-secondary font-display text-3xl font-bold">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            {user.mfa_enabled && (
                                <div
                                    title="MFA Active"
                                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container ring-2 ring-white shadow-xs">
                                    <MaterialIcon name="verified_user" size="xs" />
                                </div>
                            )}
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-purple-700 uppercase">
                                <MaterialIcon name="shield" size="xs" />
                                {roleLabel}
                            </span>

                            {user.is_verified && (
                                <span className="inline-flex items-center gap-1 rounded-md border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary">
                                    <MaterialIcon name="verified" size="xs" />
                                    Verified
                                </span>
                            )}

                            <Badge variant={user.mfa_enabled ? "active" : "neutral"} size="md">
                                {user.mfa_enabled ? "MFA Enabled" : "MFA Disabled"}
                            </Badge>
                        </div>
                    </div>

                    {/* User Identity Details */}
                    <div>
                        <h2 className="font-display text-headline-md font-bold text-primary">
                            {user.full_name || `${user.first_name} ${user.last_name}`}
                        </h2>
                        <p className="font-sans text-body-md text-on-surface-variant font-medium">
                            {user.job_title || "Sustainability Officer"} · {user.email}
                        </p>
                        {user.bio && (
                            <p className="mt-3 font-sans text-xs leading-relaxed text-on-surface-variant/90 max-w-2xl bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/40">
                                {user.bio}
                            </p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Two-Column Grid: Form Details + Security & Facility Attributions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left (2 Columns): Personal & Contact Information Form */}
                <div className="lg:col-span-2 space-y-6">
                    <ProfileFormCard
                        key={`${user.id}-${user.updated_at || ""}`}
                        user={user}
                        onSaveSuccess={(msg) => {
                            setSaveSuccessMessage(msg);
                            setTimeout(() => setSaveSuccessMessage(null), 4000);
                        }}
                        onSaveError={(msg) => {
                            setSaveErrorMessage(msg);
                        }}
                    />

                    {/* Facility Tenancy Card */}
                    <Card>
                        <CardHeader tone="strip" bordered>
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="domain" size="sm" className="text-on-surface-variant" />
                                <h3 className="font-display text-headline-sm font-semibold text-primary">
                                    Facility Assignment & Scope
                                </h3>
                            </div>
                            <span className="font-sans text-xs text-on-surface-variant">
                                Tenancy context
                            </span>
                        </CardHeader>

                        <CardBody>
                            {assignedFacility ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-secondary/20 bg-secondary/5">
                                    <div className="flex items-center gap-3.5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-on-secondary shadow-xs">
                                            <MaterialIcon name="factory" size="md" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-sans text-sm font-bold text-primary">
                                                    {assignedFacility.name}
                                                </h4>
                                                <span className="font-mono text-[10px] font-semibold text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">
                                                    {assignedFacility.facilityCode}
                                                </span>
                                            </div>
                                            <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                                                {assignedFacility.city}, {assignedFacility.country}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                                            <span className="h-2 w-2 rounded-full bg-secondary" />
                                            Operational
                                        </span>
                                        <Link href="/facilities">
                                            <Button variant="secondary" size="sm">
                                                View Facilities
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant bg-surface-container-low/60">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant">
                                        <MaterialIcon name="corporate_fare" size="sm" />
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-sm font-bold text-primary">
                                            Organization-Wide Coverage
                                        </h4>
                                        <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                                            You are not restricted to an individual facility. You hold organization-wide visibility across all reporting operational centers and value chain categories.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Right (1 Column): Security, MFA, and Account Governance */}
                <div className="space-y-6">
                    {/* Security & Multi-Factor Authentication Card */}
                    <Card>
                        <CardHeader tone="strip" bordered>
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="security" size="sm" className="text-on-surface-variant" />
                                <h3 className="font-display text-headline-sm font-semibold text-primary">
                                    Authentication & MFA
                                </h3>
                            </div>
                        </CardHeader>

                        <CardBody className="space-y-5">
                            {/* MFA Status Indicator */}
                            <div className="flex items-start justify-between gap-3 p-4 rounded-xl border border-outline-variant bg-surface-container-low">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-sans text-sm font-bold text-primary">
                                            Multi-Factor Authentication
                                        </p>
                                    </div>
                                    <p className="mt-1 font-sans text-xs text-on-surface-variant leading-relaxed">
                                        Requires a 6-digit one-time code sent to your email on every sign-in attempt.
                                    </p>
                                </div>
                                <span
                                    className={cn(
                                        "shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wider font-mono",
                                        user.mfa_enabled
                                            ? "bg-secondary/15 text-secondary border border-secondary/30"
                                            : "bg-surface-container-high text-on-surface-variant border border-outline-variant",
                                    )}>
                                    {user.mfa_enabled ? "Enabled" : "Disabled"}
                                </span>
                            </div>

                            {/* Toggle Action */}
                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="font-sans text-xs font-semibold text-primary">
                                        {user.mfa_enabled ? "Disable 2FA Protection" : "Enable 2FA Protection"}
                                    </p>
                                    <p className="font-sans text-[11px] text-on-surface-variant">
                                        Requires password verification
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleInitiateMfaToggle}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/40",
                                        user.mfa_enabled ? "bg-secondary" : "bg-outline-variant",
                                    )}
                                    role="switch"
                                    aria-checked={user.mfa_enabled}
                                    aria-label="Toggle Multi-Factor Authentication">
                                    <span
                                        className={cn(
                                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                                            user.mfa_enabled ? "translate-x-5" : "translate-x-0",
                                        )}
                                    />
                                </button>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Account Identity & Governance Identifiers */}
                    <Card>
                        <CardHeader tone="strip" bordered>
                            <div className="flex items-center gap-2">
                                <MaterialIcon name="fingerprint" size="sm" className="text-on-surface-variant" />
                                <h3 className="font-display text-headline-sm font-semibold text-primary">
                                    Account Governance
                                </h3>
                            </div>
                        </CardHeader>

                        <CardBody className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between text-xs font-medium text-on-surface-variant mb-1">
                                    <span>User ID</span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(user.id, "user_id")}
                                        className="text-secondary hover:underline cursor-pointer inline-flex items-center gap-1 text-[11px]">
                                        <MaterialIcon name="content_copy" size="xs" />
                                        <span>{copiedField === "user_id" ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                                <p className="font-mono text-xs text-on-surface bg-surface-container-high/60 px-2.5 py-1.5 rounded border border-outline-variant truncate select-all">
                                    {user.id}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-medium text-on-surface-variant mb-1">
                                    <span>Tenant ID</span>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(user.tenant_id, "tenant_id")}
                                        className="text-secondary hover:underline cursor-pointer inline-flex items-center gap-1 text-[11px]">
                                        <MaterialIcon name="content_copy" size="xs" />
                                        <span>{copiedField === "tenant_id" ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                                <p className="font-mono text-xs text-on-surface bg-surface-container-high/60 px-2.5 py-1.5 rounded border border-outline-variant truncate select-all">
                                    {user.tenant_id}
                                </p>
                            </div>

                            <div className="border-t border-outline-variant pt-3 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-on-surface-variant">
                                    <span>Account Status</span>
                                    <span className="font-semibold text-primary uppercase font-mono text-[11px]">
                                        {user.user_status || (user.is_active ? "Active" : "Inactive")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-on-surface-variant">
                                    <span>Member Since</span>
                                    <span className="font-mono text-[11px] text-on-surface">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-on-surface-variant">
                                    <span>Last Login</span>
                                    <span className="font-mono text-[11px] text-on-surface">
                                        {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Active session"}
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* MFA Confirmation Password Modal */}
            <MfaPasswordModal
                isOpen={isMfaModalOpen}
                targetState={targetMfaState}
                onClose={() => setIsMfaModalOpen(false)}
                onConfirm={handleConfirmMfaToggle}
                isPending={toggleMfaMutation.isPending}
                error={mfaError}
            />
        </div>
    );
}
