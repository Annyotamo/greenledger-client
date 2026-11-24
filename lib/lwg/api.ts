// lib/lwg/api.ts

import { privateApi } from "@/lib/http/client";
import type {
    CreateLwgAuditResultPayload,
    CreateLwgDepartmentPayload,
    CreateLwgEvidencePayload,
    CreateLwgProfilePayload,
    LwgAuditResult,
    LwgAuditResultDto,
    LwgDashboardData,
    LwgDashboardDto,
    LwgDepartment,
    LwgDepartmentDto,
    LwgEnergy,
    LwgEnergyDto,
    LwgEvidence,
    LwgEvidenceDto,
    LwgExcelImportSummary,
    LwgExcelImportSummaryDto,
    LwgProduction,
    LwgProductionDto,
    LwgTanneryProfile,
    LwgTanneryProfileDto,
    LwgWater,
    LwgWaterDto,
    UpdateLwgDepartmentPayload,
    UpdateLwgProfilePayload,
    UpsertLwgEnergyPayload,
    UpsertLwgProductionPayload,
    UpsertLwgWaterPayload,
} from "./types";

interface ApiResponse<T> {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
    error: unknown;
}

// ============================================================================
// FORMATTERS (DTO -> DOMAIN ENTITIES)
// ============================================================================

export function formatLwgDepartment(dto: LwgDepartmentDto): LwgDepartment {
    return {
        id: dto.id || "",
        tenantId: dto.tenant_id || "",
        tanneryProfileId: dto.tannery_profile_id || "",
        name: dto.name || "",
        stage: dto.stage || "common",
        description: dto.description ?? null,
        isActive: dto.is_active ?? true,
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
    };
}

export function formatLwgProfile(
    dto: LwgTanneryProfileDto | null,
): LwgTanneryProfile | null {
    if (!dto) return null;
    return {
        id: dto.id || "",
        tenantId: dto.tenant_id || "",
        facilityId: dto.facility_id || "",
        tanneryName: dto.tannery_name || "",
        state: dto.state || "",
        city: dto.city || "",
        stagesRun: Array.isArray(dto.stages_run) ? dto.stages_run : [],
        effluentTreatmentType: dto.effluent_treatment_type || "both",
        usesSubcontractors: Boolean(dto.uses_subcontractors),
        outputUnit: dto.output_unit || "sq_ft",
        dataWindowStart: dto.data_window_start || "",
        dataWindowEnd: dto.data_window_end || "",
        departments: Array.isArray(dto.departments)
            ? dto.departments.map(formatLwgDepartment)
            : [],
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
    };
}

export function formatLwgProduction(dto: LwgProductionDto): LwgProduction {
    return {
        id: dto.id || "",
        tenantId: dto.tenant_id || "",
        tanneryProfileId: dto.tannery_profile_id || "",
        month: dto.month || "",
        stage: dto.stage,
        inputQuantityTonnes: Number(dto.input_quantity_tonnes) || 0,
        inputMaterial: dto.input_material,
        outputQuantityM2: Number(dto.output_quantity_m2) || 0,
        outputQuantitySqft: Number(dto.output_quantity_sqft) || 0,
        soldAtStageM2: Number(dto.sold_at_stage_m2) || 0,
        soldAtStageSqft: Number(dto.sold_at_stage_sqft) || 0,
        notes: dto.notes ?? null,
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
    };
}

export function formatLwgEnergy(dto: LwgEnergyDto): LwgEnergy {
    return {
        id: dto.id || "",
        tenantId: dto.tenant_id || "",
        tanneryProfileId: dto.tannery_profile_id || "",
        month: dto.month || "",
        source: dto.source,
        quantity: Number(dto.quantity) || 0,
        unit: dto.unit || "kwh",
        energyGj: Number(dto.energy_gj) || 0,
        departmentId: dto.department_id ?? null,
        departmentName: dto.department_name || (dto.department_id ? "Department" : "Whole site"),
        isRenewable: Boolean(dto.is_renewable),
        isOnsite: Boolean(dto.is_onsite),
        billProofFileKey: dto.bill_proof_file_key ?? null,
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
    };
}

export function formatLwgWater(dto: LwgWaterDto): LwgWater {
    return {
        id: dto.id || "",
        tenantId: dto.tenant_id || "",
        tanneryProfileId: dto.tannery_profile_id || "",
        month: dto.month || "",
        source: dto.source,
        volumeM3: Number(dto.volume_m3) || 0,
        meterId: dto.meter_id ?? null,
        departmentId: dto.department_id ?? null,
        departmentName: dto.department_name || (dto.department_id ? "Department" : "Whole site"),
        meterPhotoFileKey: dto.meter_photo_file_key ?? null,
        isFreshWater: Boolean(dto.is_fresh_water),
        isRecycled: Boolean(dto.is_recycled),
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
    };
}

export function formatLwgEvidence(dto: LwgEvidenceDto): LwgEvidence {
    return {
        id: dto.id || "",
        tenantId: dto.tenant_id || "",
        tanneryProfileId: dto.tannery_profile_id || "",
        fileKey: dto.file_key || "",
        fileName: dto.file_name || "",
        fileSizeBytes: Number(dto.file_size_bytes) || 0,
        mimeType: dto.mime_type || "application/pdf",
        lwgSection: Number(dto.lwg_section) || 1,
        documentType: dto.document_type || "other",
        periodFrom: dto.period_from ?? null,
        periodTo: dto.period_to ?? null,
        expiryDate: dto.expiry_date ?? null,
        meterId: dto.meter_id ?? null,
        notes: dto.notes ?? null,
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
    };
}

export function formatLwgAuditResult(
    dto: LwgAuditResultDto | null,
): LwgAuditResult | null {
    if (!dto) return null;
    return {
        id: dto.id || "",
        tenantId: dto.tenant_id || "",
        tanneryProfileId: dto.tannery_profile_id || "",
        auditDate: dto.audit_date || "",
        overallMedal: dto.overall_medal || "fail",
        sectionScores: dto.section_scores || {},
        holdingDownSections: Array.isArray(dto.holding_down_sections)
            ? dto.holding_down_sections
            : [],
        auditReportFileKey: dto.audit_report_file_key ?? null,
        notes: dto.notes ?? null,
        createdAt: dto.created_at || "",
        updatedAt: dto.updated_at || "",
    };
}

export function formatLwgDashboard(dto: LwgDashboardDto): LwgDashboardData {
    return {
        readiness: {
            overallPercent: Number(dto.readiness?.overall_percent) || 0,
            productionPercent: Number(dto.readiness?.production_percent) || 0,
            energyPercent: Number(dto.readiness?.energy_percent) || 0,
            waterPercent: Number(dto.readiness?.water_percent) || 0,
            status: dto.readiness?.status || "not_started",
        },
        energyIntensity: {
            title: dto.energy_intensity?.title || "Energy Intensity",
            unit: dto.energy_intensity?.unit || "MJ/m²",
            currentL12: Number(dto.energy_intensity?.current_l12) || 0,
            previousP12: Number(dto.energy_intensity?.previous_p12) || 0,
            yoyChangePercent: Number(dto.energy_intensity?.yoy_change_percent) || 0,
            isFavorable: Boolean(dto.energy_intensity?.is_favorable),
        },
        waterIntensity: {
            title: dto.water_intensity?.title || "Water Intensity",
            unit: dto.water_intensity?.unit || "L/m²",
            currentL12: Number(dto.water_intensity?.current_l12) || 0,
            previousP12: Number(dto.water_intensity?.previous_p12) || 0,
            yoyChangePercent: Number(dto.water_intensity?.yoy_change_percent) || 0,
            isFavorable: Boolean(dto.water_intensity?.is_favorable),
        },
        renewableShare: {
            title: dto.renewable_share?.title || "Renewable Energy Share",
            percentage: Number(dto.renewable_share?.percentage) || 0,
            detail: dto.renewable_share?.detail || "",
        },
        onsiteRenewableShare: dto.onsite_renewable_share
            ? {
                  title: dto.onsite_renewable_share.title || "On-site Renewable Share",
                  percentage: Number(dto.onsite_renewable_share.percentage) || 0,
                  detail: dto.onsite_renewable_share.detail || "",
              }
            : undefined,
        recycledWaterShare: {
            title: dto.recycled_water_share?.title || "Recycled Water Share",
            percentage: Number(dto.recycled_water_share?.percentage) || 0,
            detail: dto.recycled_water_share?.detail || "",
        },
        monthGrid: Array.isArray(dto.month_grid)
            ? dto.month_grid.map((m) => ({
                  month: m.month,
                  monthLabel: m.month_label,
                  productionComplete: Boolean(m.production_complete),
                  energyComplete: Boolean(m.energy_complete),
                  waterComplete: Boolean(m.water_complete),
                  isFullyComplete: Boolean(m.is_fully_complete),
              }))
            : [],
        gapList: Array.isArray(dto.gap_list)
            ? dto.gap_list.map((g) => ({
                  severity: g.severity,
                  checkCode: g.check_code,
                  message: g.message,
                  fixUrl: g.fix_url,
                  sectionNumber: Number(g.section_number) || 0,
                  month: g.month ?? null,
              }))
            : [],
        sectionStatuses: Array.isArray(dto.section_statuses)
            ? dto.section_statuses.map((s) => ({
                  sectionNumber: Number(s.section_number) || 0,
                  sectionName: s.section_name || "",
                  status: s.status || "not_in_mvp",
                  isInMvp: Boolean(s.is_in_mvp),
                  isCritical: Boolean(s.is_critical),
              }))
            : [],
        medalStatus: {
            overallMedal: dto.medal_status?.overall_medal || "fail",
            sectionRatings: dto.medal_status?.section_ratings || {},
            holdingDownSections: Array.isArray(dto.medal_status?.holding_down_sections)
                ? dto.medal_status.holding_down_sections
                : [],
            holdingDownSectionNames: Array.isArray(dto.medal_status?.holding_down_section_names)
                ? dto.medal_status.holding_down_section_names
                : [],
            message: dto.medal_status?.message || "",
        },
    };
}

export function formatLwgExcelImportSummary(
    dto: LwgExcelImportSummaryDto,
): LwgExcelImportSummary {
    return {
        success: Boolean(dto.success),
        productionRowsImported: Number(dto.production_rows_imported) || 0,
        energyRowsImported: Number(dto.energy_rows_imported) || 0,
        waterRowsImported: Number(dto.water_rows_imported) || 0,
        totalImported: Number(dto.total_imported) || 0,
        totalFailed: Number(dto.total_failed) || 0,
        errors: Array.isArray(dto.errors)
            ? dto.errors.map((e) => ({
                  sheetName: e.sheet_name || "",
                  rowNumber: Number(e.row_number) || 0,
                  field: e.field || "",
                  errorMessage: e.error_message || "",
                  rawData: e.raw_data,
              }))
            : [],
    };
}

// ============================================================================
// 1. TANNERY PROFILE APIS
// ============================================================================

export async function getLwgProfile(): Promise<LwgTanneryProfile | null> {
    const res = await privateApi.get<ApiResponse<LwgTanneryProfileDto | null>>(
        "/tenant/lwg/profile",
    );
    return formatLwgProfile(res.data?.data ?? null);
}

export async function createLwgProfile(
    payload: CreateLwgProfilePayload,
): Promise<LwgTanneryProfile> {
    const body: Record<string, unknown> = {
        facility_id: payload.facilityId,
        tannery_name: payload.tanneryName.trim(),
        state: payload.state.trim(),
        city: payload.city.trim(),
        stages_run: payload.stagesRun,
        effluent_treatment_type: payload.effluentTreatmentType,
        uses_subcontractors: Boolean(payload.usesSubcontractors),
        output_unit: payload.outputUnit || "sq_ft",
    };

    const res = await privateApi.post<ApiResponse<LwgTanneryProfileDto>>(
        "/tenant/lwg/profile",
        body,
    );
    const formatted = formatLwgProfile(res.data.data);
    if (!formatted) {
        throw new Error("Failed to format created LWG profile response.");
    }
    return formatted;
}

export async function updateLwgProfile(
    payload: UpdateLwgProfilePayload,
): Promise<LwgTanneryProfile> {
    const body: Record<string, unknown> = {};
    if (payload.tanneryName !== undefined) body.tannery_name = payload.tanneryName.trim();
    if (payload.state !== undefined) body.state = payload.state.trim();
    if (payload.city !== undefined) body.city = payload.city.trim();
    if (payload.stagesRun !== undefined) body.stages_run = payload.stagesRun;
    if (payload.effluentTreatmentType !== undefined) {
        body.effluent_treatment_type = payload.effluentTreatmentType;
    }
    if (payload.usesSubcontractors !== undefined) {
        body.uses_subcontractors = payload.usesSubcontractors;
    }
    if (payload.outputUnit !== undefined) body.output_unit = payload.outputUnit;

    const res = await privateApi.put<ApiResponse<LwgTanneryProfileDto>>(
        "/tenant/lwg/profile",
        body,
    );
    const formatted = formatLwgProfile(res.data.data);
    if (!formatted) {
        throw new Error("Failed to format updated LWG profile response.");
    }
    return formatted;
}

// ============================================================================
// 2. FACTORY DEPARTMENTS APIS
// ============================================================================

export async function getLwgDepartments(
    activeOnly = true,
): Promise<LwgDepartment[]> {
    const res = await privateApi.get<ApiResponse<LwgDepartmentDto[]>>(
        `/tenant/lwg/departments?active_only=${activeOnly}`,
    );
    return Array.isArray(res.data?.data)
        ? res.data.data.map(formatLwgDepartment)
        : [];
}

export async function createLwgDepartment(
    payload: CreateLwgDepartmentPayload,
): Promise<LwgDepartment> {
    const body: Record<string, unknown> = {
        name: payload.name.trim(),
        stage: payload.stage,
    };
    if (payload.description?.trim()) body.description = payload.description.trim();

    const res = await privateApi.post<ApiResponse<LwgDepartmentDto>>(
        "/tenant/lwg/departments",
        body,
    );
    return formatLwgDepartment(res.data.data);
}

export async function updateLwgDepartment(
    departmentId: string,
    payload: UpdateLwgDepartmentPayload,
): Promise<LwgDepartment> {
    const body: Record<string, unknown> = {};
    if (payload.name !== undefined) body.name = payload.name.trim();
    if (payload.stage !== undefined) body.stage = payload.stage;
    if (payload.description !== undefined) {
        body.description = payload.description ? payload.description.trim() : null;
    }
    if (payload.isActive !== undefined) body.is_active = payload.isActive;

    const res = await privateApi.put<ApiResponse<LwgDepartmentDto>>(
        `/tenant/lwg/departments/${departmentId}`,
        body,
    );
    return formatLwgDepartment(res.data.data);
}

export async function deleteLwgDepartment(departmentId: string): Promise<void> {
    await privateApi.delete(`/tenant/lwg/departments/${departmentId}`);
}

// ============================================================================
// 3. MONTHLY PRODUCTION DATA APIS (SECTION 5)
// ============================================================================

export async function getLwgProduction(filters?: {
    start_date?: string;
    end_date?: string;
}): Promise<LwgProduction[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);

    const qs = params.toString();
    const res = await privateApi.get<ApiResponse<LwgProductionDto[]>>(
        `/tenant/lwg/production${qs ? `?${qs}` : ""}`,
    );
    return Array.isArray(res.data?.data)
        ? res.data.data.map(formatLwgProduction)
        : [];
}

export async function upsertLwgProduction(
    payload: UpsertLwgProductionPayload,
): Promise<LwgProduction> {
    const body: Record<string, unknown> = {
        month: payload.month,
        stage: payload.stage,
        input_quantity_tonnes: Number(payload.inputQuantityTonnes),
        input_material: payload.inputMaterial,
        output_quantity: Number(payload.outputQuantity),
        sold_at_stage: Number(payload.soldAtStage || 0),
    };
    if (payload.notes?.trim()) body.notes = payload.notes.trim();

    const res = await privateApi.post<ApiResponse<LwgProductionDto>>(
        "/tenant/lwg/production",
        body,
    );
    return formatLwgProduction(res.data.data);
}

export async function deleteLwgProduction(productionId: string): Promise<void> {
    await privateApi.delete(`/tenant/lwg/production/${productionId}`);
}

// ============================================================================
// 4. MONTHLY ENERGY CONSUMPTION APIS (SECTION 10)
// ============================================================================

export async function getLwgEnergy(filters?: {
    start_date?: string;
    end_date?: string;
}): Promise<LwgEnergy[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);

    const qs = params.toString();
    const res = await privateApi.get<ApiResponse<LwgEnergyDto[]>>(
        `/tenant/lwg/energy${qs ? `?${qs}` : ""}`,
    );
    return Array.isArray(res.data?.data) ? res.data.data.map(formatLwgEnergy) : [];
}

export async function upsertLwgEnergy(
    payload: UpsertLwgEnergyPayload,
): Promise<LwgEnergy> {
    const body: Record<string, unknown> = {
        month: payload.month,
        source: payload.source,
        quantity: Number(payload.quantity),
        unit: payload.unit.toLowerCase(),
        department_id: payload.departmentId || null,
        bill_proof_file_key: payload.billProofFileKey || null,
    };

    const res = await privateApi.post<ApiResponse<LwgEnergyDto>>(
        "/tenant/lwg/energy",
        body,
    );
    return formatLwgEnergy(res.data.data);
}

export async function deleteLwgEnergy(energyId: string): Promise<void> {
    await privateApi.delete(`/tenant/lwg/energy/${energyId}`);
}

// ============================================================================
// 5. MONTHLY WATER USAGE APIS (SECTION 11)
// ============================================================================

export async function getLwgWater(filters?: {
    start_date?: string;
    end_date?: string;
}): Promise<LwgWater[]> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);

    const qs = params.toString();
    const res = await privateApi.get<ApiResponse<LwgWaterDto[]>>(
        `/tenant/lwg/water${qs ? `?${qs}` : ""}`,
    );
    return Array.isArray(res.data?.data) ? res.data.data.map(formatLwgWater) : [];
}

export async function upsertLwgWater(
    payload: UpsertLwgWaterPayload,
): Promise<LwgWater> {
    const body: Record<string, unknown> = {
        month: payload.month,
        source: payload.source,
        volume_m3: Number(payload.volumeM3),
        meter_id: payload.meterId?.trim() || null,
        department_id: payload.departmentId || null,
        meter_photo_file_key: payload.meterPhotoFileKey || null,
    };

    const res = await privateApi.post<ApiResponse<LwgWaterDto>>(
        "/tenant/lwg/water",
        body,
    );
    return formatLwgWater(res.data.data);
}

export async function deleteLwgWater(waterId: string): Promise<void> {
    await privateApi.delete(`/tenant/lwg/water/${waterId}`);
}

// ============================================================================
// 6. EVIDENCE VAULT APIS (SECTIONS 1–17)
// ============================================================================

export async function getLwgEvidence(sectionNumber?: number): Promise<LwgEvidence[]> {
    const qs = sectionNumber ? `?section_number=${sectionNumber}` : "";
    const res = await privateApi.get<ApiResponse<LwgEvidenceDto[]>>(
        `/tenant/lwg/evidence${qs}`,
    );
    return Array.isArray(res.data?.data)
        ? res.data.data.map(formatLwgEvidence)
        : [];
}

export async function createLwgEvidence(
    payload: CreateLwgEvidencePayload,
): Promise<LwgEvidence> {
    const body: Record<string, unknown> = {
        file_key: payload.fileKey,
        file_name: payload.fileName,
        file_size_bytes: Number(payload.fileSizeBytes),
        mime_type: payload.mimeType,
        lwg_section: Number(payload.lwgSection),
        document_type: payload.documentType,
        period_from: payload.periodFrom || null,
        period_to: payload.periodTo || null,
        expiry_date: payload.expiryDate || null,
        meter_id: payload.meterId?.trim() || null,
        notes: payload.notes?.trim() || null,
    };

    const res = await privateApi.post<ApiResponse<LwgEvidenceDto>>(
        "/tenant/lwg/evidence",
        body,
    );
    return formatLwgEvidence(res.data.data);
}

export async function deleteLwgEvidence(evidenceId: string): Promise<void> {
    await privateApi.delete(`/tenant/lwg/evidence/${evidenceId}`);
}

// ============================================================================
// 7. PREVIOUS AUDIT RESULT & MEDAL EVALUATION APIS
// ============================================================================

export async function getLwgAuditResult(): Promise<LwgAuditResult | null> {
    const res = await privateApi.get<ApiResponse<LwgAuditResultDto | null>>(
        "/tenant/lwg/audit-result",
    );
    return formatLwgAuditResult(res.data?.data ?? null);
}

export async function createLwgAuditResult(
    payload: CreateLwgAuditResultPayload,
): Promise<LwgAuditResult> {
    const body: Record<string, unknown> = {
        audit_date: payload.auditDate,
        section_scores: payload.sectionScores,
        audit_report_file_key: payload.auditReportFileKey || null,
        notes: payload.notes?.trim() || null,
    };

    const res = await privateApi.post<ApiResponse<LwgAuditResultDto>>(
        "/tenant/lwg/audit-result",
        body,
    );
    const formatted = formatLwgAuditResult(res.data.data);
    if (!formatted) {
        throw new Error("Failed to format audit result response.");
    }
    return formatted;
}

// ============================================================================
// 8. COMPLIANCE & READINESS DASHBOARD APIS
// ============================================================================

export async function getLwgDashboard(): Promise<LwgDashboardData> {
    const res = await privateApi.get<ApiResponse<LwgDashboardDto>>(
        "/tenant/lwg/dashboard",
    );
    return formatLwgDashboard(res.data.data);
}

// ============================================================================
// 9. BULK EXCEL INGESTION & DATA PACK EXPORT APIS
// ============================================================================

export async function downloadLwgExcelTemplate(): Promise<Blob> {
    const res = await privateApi.get("/tenant/lwg/excel/template", {
        responseType: "blob",
    });
    return res.data;
}

export async function uploadLwgFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await privateApi.post<ApiResponse<string | { url?: string; file_key?: string }>>(
        "/tenant/upload/s3",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    const data = res.data?.data;
    if (typeof data === "string") {
        return data;
    }
    return (data?.url || data?.file_key || "") as string;
}

export async function uploadLwgExcelFile(
    file: File,
): Promise<LwgExcelImportSummary> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await privateApi.post<ApiResponse<LwgExcelImportSummaryDto>>(
        "/tenant/lwg/excel/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return formatLwgExcelImportSummary(res.data.data);
}

export async function downloadLwgAuditorPack(): Promise<{
    blob: Blob;
    filename: string;
}> {
    const res = await privateApi.get("/tenant/lwg/excel/export", {
        responseType: "blob",
    });

    let filename = "LWG_Auditor_Data_Pack.xlsx";
    const disposition = res.headers["content-disposition"];
    if (disposition) {
        const match = disposition.match(/filename="?([^";]+)"?/i);
        if (match && match[1]) {
            filename = match[1];
        }
    }

    return {
        blob: res.data,
        filename,
    };
}
