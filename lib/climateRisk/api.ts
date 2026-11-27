// Risk Assessment API: calls /tenant/climate-risk on the GreenLedger server.
// Every function unwraps the server's { success, data, message } envelope and throws RiskApiError with
// the server's own message, so screens can show it as is.
import axios from "axios";
import { privateApi } from "@/lib/http/client";
import type {
    AssessmentDetail,
    CarbonPrice,
    Rating,
    RiskAccess,
    RiskAssessment,
    RiskRating,
    RulesetVersion,
    ThinkHazardDivision,
    TriState,
} from "./types";

const BASE = "/tenant/climate-risk";
// Runs call ThinkHazard (up to 3 attempts per district) and the GHG engine, so they get more than the default 15 s.
const RUN_TIMEOUT_MS = 120_000;
// The server retries ThinkHazard's district search 3 times (up to ~35 s when ThinkHazard hangs).
const SEARCH_TIMEOUT_MS = 45_000;

export class RiskApiError extends Error {}

type Envelope<T> = { success: boolean; message: string; data: T };
type ErrorBody = { message?: string; error?: { validation?: { message?: string }[] } };

function toRiskError(error: unknown): RiskApiError {
    if (axios.isAxiosError<ErrorBody>(error)) {
        const body = error.response?.data;
        // Validation errors carry the readable reason per field, e.g. "Pick a district (admin2) …".
        const detail = body?.error?.validation?.[0]?.message?.replace(/^Value error, /, "");
        if (detail || body?.message) return new RiskApiError(detail ?? body!.message!);
        if (error.code === "ECONNABORTED") return new RiskApiError("The server took too long to answer. Try again.");
        // Reached a server, but not one that knows this API (e.g. a 404 from a server without these routes).
        if (error.response) return new RiskApiError(`The server answered ${error.response.status} for ${error.config?.url ?? "this request"}.`);
    }
    return new RiskApiError("Could not reach the server. Check your connection and try again.");
}

async function call<T>(request: Promise<{ data: Envelope<T> }>): Promise<T> {
    try {
        return (await request).data.data;
    } catch (error) {
        throw toRiskError(error);
    }
}

// ─── Access ────────────────────────────────────────────────────────────────────

/** The signed-in user's access to this module, from their role and custom permissions. */
export async function getRiskAccess(): Promise<RiskAccess> {
    const data = await call(privateApi.get<Envelope<{ effective_permissions: Record<string, string> }>>("/user/auth/permissions"));
    const level = (data.effective_permissions.climate_risk ?? "none") as RiskAccess["level"];
    return { level, canRead: level !== "none", canWrite: level === "write" || level === "admin", canApprove: level === "admin" };
}

// ─── Assessments ───────────────────────────────────────────────────────────────

export type AssessmentListItem = RiskAssessment & {
    ruleset_label: string;
    physical: Rating | null;
    transition: Rating | null;
};

export async function listAssessments(): Promise<AssessmentListItem[]> {
    const data = await call(privateApi.get<Envelope<{ items: AssessmentListItem[] }>>(`${BASE}/assessments`, { params: { page_size: 200 } }));
    return data.items;
}

export function createAssessment(input: { reporting_year: number; revenue_inr: number | null }): Promise<RiskAssessment> {
    return call(privateApi.post(`${BASE}/assessments`, input));
}

/** One assessment with every result. User ids in *_by fields are swapped for names from `people`. */
export async function getAssessment(id: string): Promise<AssessmentDetail> {
    const d = await call(privateApi.get<Envelope<AssessmentDetail>>(`${BASE}/assessments/${id}`));
    const name = (userId: string | null) => (userId ? (d.people[userId] ?? "Unknown user") : null);
    return {
        ...d,
        assessment: { ...d.assessment, created_by: name(d.assessment.created_by)!, approved_by: name(d.assessment.approved_by) },
        ratings: d.ratings.map((r) => ({ ...r, overridden_by: name(r.overridden_by) })),
        facilities: d.facilities.map((f) => ({ ...f, location: { ...f.location, confirmed_by: name(f.location.confirmed_by) } })),
    };
}

export function updateAssessmentSetup(
    id: string,
    patch: Partial<Pick<RiskAssessment, "reporting_year" | "revenue_inr" | "horizon_short" | "horizon_medium" | "horizon_long">>,
): Promise<RiskAssessment> {
    return call(privateApi.patch(`${BASE}/assessments/${id}`, patch, { timeout: RUN_TIMEOUT_MS }));
}

export function runPhysical(id: string): Promise<RiskAssessment> {
    return call(privateApi.post(`${BASE}/assessments/${id}/physical/run`, undefined, { timeout: RUN_TIMEOUT_MS }));
}

export function runTransition(id: string): Promise<RiskAssessment> {
    return call(privateApi.post(`${BASE}/assessments/${id}/transition/run`, undefined, { timeout: RUN_TIMEOUT_MS }));
}

export function scoreAssessment(id: string): Promise<RiskAssessment> {
    return call(privateApi.post(`${BASE}/assessments/${id}/score`));
}

/** CCTS and CBAM flags per facility; the analyst sets both (no CCTS module, CBAM installations are not linked to facilities). */
export function setPolicyFlag(id: string, facilityId: string, patch: { ccts_covered?: TriState; cbam_exporter?: TriState }) {
    return call(privateApi.patch(`${BASE}/assessments/${id}/flags/${facilityId}`, patch));
}

export function overrideRating(ratingId: string, finalRating: Rating, reason: string): Promise<RiskRating> {
    return call(privateApi.patch(`${BASE}/ratings/${ratingId}`, { final_rating: finalRating, reason }));
}

export function clearOverride(ratingId: string): Promise<RiskRating> {
    return call(privateApi.delete(`${BASE}/ratings/${ratingId}/override`));
}

export function submitAssessment(id: string): Promise<RiskAssessment> {
    return call(privateApi.post(`${BASE}/assessments/${id}/submit`));
}

/** In review → draft, so the analyst can change it again. */
export function reopenAssessment(id: string): Promise<RiskAssessment> {
    return call(privateApi.post(`${BASE}/assessments/${id}/reopen`));
}

export function approveAssessment(id: string): Promise<RiskAssessment> {
    return call(privateApi.post(`${BASE}/assessments/${id}/approve`));
}

/** New draft that supersedes an approved assessment; the old one stays untouched. */
export function createNewVersion(id: string): Promise<RiskAssessment> {
    return call(privateApi.post(`${BASE}/assessments/${id}/versions`));
}

/** CSV text: one row per facility × scenario × year, with sources, credit line and limits. */
export async function exportAssessmentCsv(id: string): Promise<string> {
    try {
        const res = await privateApi.get<string>(`${BASE}/assessments/${id}/export`, { params: { format: "csv" }, responseType: "text" });
        return res.data;
    } catch (error) {
        throw toRiskError(error);
    }
}

// ─── Setup shared by every assessment ─────────────────────────────────────────

export function updateCompanySasb(code: string | null) {
    return call(privateApi.patch(`${BASE}/company/sasb`, { sasb_industry_code: code }));
}

/** Proxies ThinkHazard's district search; the server returns districts only. */
export function searchThinkHazard(q: string): Promise<ThinkHazardDivision[]> {
    return call(privateApi.get(`${BASE}/locations/thinkhazard-search`, { params: { q }, timeout: SEARCH_TIMEOUT_MS }));
}

/** Confirm a facility's district, or clear it with null. */
export function saveFacilityLocation(facilityId: string, division: ThinkHazardDivision | null) {
    const body = division
        ? { thinkhazard_code: division.code, admin0: division.admin0, admin1: division.admin1 ?? null, admin2: division.admin2 ?? null }
        : {};
    return call(privateApi.put(`${BASE}/facilities/${facilityId}/location`, body));
}

/** Ruleset versions and their carbon prices. Read only here: the methodology lead edits them in the platform admin. */
export function listRulesets(): Promise<{ rulesets: RulesetVersion[]; prices: CarbonPrice[] }> {
    return call(privateApi.get(`${BASE}/rulesets`));
}
