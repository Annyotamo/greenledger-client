import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant overflow-hidden min-h-[850px]">
                {/* Left Side: Narrative & Visuals */}
                <div className="lg:col-span-5 relative flex flex-col p-10 md:p-14 bg-surface-container-low border-r border-outline-variant">
                    <div className="z-10 flex flex-col h-full">
                        <div className="mb-12">
                            <h1 className="font-headline-md text-headline-md text-primary mb-1">Clarity ESG</h1>
                            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                                GHG Accounting v2.1
                            </p>
                        </div>
                        <div className="mt-auto">
                            <span className="inline-block px-3 py-1 bg-primary text-on-primary font-label-md text-label-md rounded-full mb-6 uppercase tracking-widest">
                                Start Onboarding
                            </span>
                            <h2 className="font-headline-lg text-headline-lg text-primary mb-6 leading-tight">
                                Create your Clarity ESG workspace
                            </h2>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-10 leading-relaxed">
                                Register your company, invite your first admin, and choose whether to seed a reporting
                                period or facility as part of onboarding.
                            </p>
                            <div className="space-y-6">
                                <div className="p-6 bg-white border border-outline-variant rounded-lg transition-all hover:border-primary">
                                    <h3 className="font-headline-sm text-headline-sm mb-2">Technical Precision</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant">
                                        Complete four clear steps and receive an email verification to activate your
                                        administrator account.
                                    </p>
                                </div>
                                <div className="p-6 bg-white border border-outline-variant rounded-lg transition-all hover:border-primary">
                                    <h3 className="font-headline-sm text-headline-sm mb-2">Audit-Ready Data</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant">
                                        Add tenant details, create an owner account, and optionally scaffold your first
                                        facility and reporting period.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <img
                            className="w-full h-full object-cover grayscale"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIxJn3-uXA-Rh0zk86GiPkFNo2lXvuMxCBX3NuiBU29qUbTVXU0JdceKqwv6_2O_WxTe0MfOelbzkwyh-K4PrxtjUK00dP8LHNfUCN8T8oNzfuPsZMCY8-O9D08wfktppXLRDpJztLdd3n7PmDsY1E7Rhuhewbhzo70E8puhTLDP6v1GIDO90O7EyYEN3diNMjFsA9Ewi2tRQI7gc144r1EJPu9uZKLZ_wtlWZaP8rVzpoAlNAFbscyMl7pEvS9SV-HM_Zu_96mrc"
                            alt="architectural background"
                        />
                    </div>
                </div>

                {/* Right Side: Form Content */}
                <div className="lg:col-span-7 flex flex-col p-10 md:p-14 overflow-y-auto custom-scrollbar">
                    <div className="max-w-2xl mx-auto w-full">
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
