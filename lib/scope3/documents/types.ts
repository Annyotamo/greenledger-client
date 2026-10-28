import { CustomSelectOption } from "@/components/ui/select";

/**
 * Supported Scope 3 Document Types Enum
 */
export enum Scope3DocumentType {
    INVOICE = "invoice",
    DELIVERY_NOTE = "delivery_note",
    WEIGHBRIDGE_TICKET = "weighbridge_ticket",
    FLOW_METER_READING = "flow_meter_reading",
    METER_READING = "meter_reading",
    UTILITY_BILL = "utility_bill",
    LAB_REPORT = "lab_report",
    AUDIT_REPORT = "audit_report",
    ESTIMATION_BASIS = "estimation_basis",
    OTHER = "other",
}

/**
 * Normalizes any category string or number (e.g. 1, "cat1", "category-1", "category1", "CATEGORY_1")
 * to the canonical backend format "category_X" (1 to 15).
 */
export function normalizeScope3Category(category: string | number): string {
    const str = String(category).trim().toLowerCase();
    const match = str.match(/(?:category[_-]?|cat[_-]?)?(\d+)/);
    if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num >= 1 && num <= 15) {
            return `category_${num}`;
        }
    }
    return str.startsWith("category_") ? str : `category_${str}`;
}

/**
 * Returns a human-friendly display label for a Scope 3 category string.
 */
export function formatScope3CategoryLabel(category: string | number): string {
    const normalized = normalizeScope3Category(category);
    const num = normalized.replace("category_", "");
    return `Scope 3 Category ${num}`;
}

export const SCOPE3_DOCUMENT_TYPE_OPTIONS: CustomSelectOption[] = [
    { label: "Invoice (Purchase / Commercial)", value: Scope3DocumentType.INVOICE },
    { label: "Delivery Note / Challan", value: Scope3DocumentType.DELIVERY_NOTE },
    { label: "Weighbridge Ticket / Scale Slip", value: Scope3DocumentType.WEIGHBRIDGE_TICKET },
    { label: "Flow Meter Reading", value: Scope3DocumentType.FLOW_METER_READING },
    { label: "Meter Reading", value: Scope3DocumentType.METER_READING },
    { label: "Utility Bill", value: Scope3DocumentType.UTILITY_BILL },
    { label: "Lab Report / Analysis Certificate", value: Scope3DocumentType.LAB_REPORT },
    { label: "Audit Report / Third-Party Assurance", value: Scope3DocumentType.AUDIT_REPORT },
    { label: "Estimation Basis / Technical Memorandum", value: Scope3DocumentType.ESTIMATION_BASIS },
    { label: "Other Supporting Document", value: Scope3DocumentType.OTHER },
];

export function formatScope3DocumentType(type: string): string {
    const found = SCOPE3_DOCUMENT_TYPE_OPTIONS.find((o) => o.value === type);
    if (found) return found.label;
    return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Raw Document DTO returned by the backend API
 */
export interface Scope3DocumentDto {
    id: string;
    created_at: string;
    updated_at: string;
    tenant_id?: string;
    category: string;
    activity_id: string;
    document_type: Scope3DocumentType | string;
    document_name: string;
    source_url: string;
    download_url?: string;
    view_url?: string;
    s3_presigned_url?: string;
    file_name?: string;
    file_extension?: string;
    mime_type?: string;
    notes?: string | null;
    document_date?: string | null;
    issued_by?: string | null;
    uploaded_by?: string | null;
}

/**
 * Domain model used throughout UI components
 */
export interface Scope3Document {
    id: string;
    createdAt: string;
    updatedAt: string;
    tenantId: string;
    category: string;
    activityId: string;
    documentType: Scope3DocumentType | string;
    documentName: string;
    sourceUrl: string;
    downloadUrl: string;
    viewUrl: string;
    s3PresignedUrl?: string;
    fileName: string;
    fileExtension: string;
    mimeType: string;
    notes: string | null;
    documentDate: string | null;
    issuedBy: string | null;
    uploadedBy: string | null;
}

export interface UploadScope3DocumentMultipartPayload {
    file: File;
    document_name?: string;
    document_type?: Scope3DocumentType | string;
    document_date?: string;
    issued_by?: string;
    notes?: string;
}

export interface PresignScope3DocumentPayload {
    document_name: string;
    content_type: string;
}

export interface PresignedUploadUrlResponse {
    upload_url: string;
    object_key: string;
    expires_in_seconds: number;
}

export interface CreateScope3DocumentJsonPayload {
    document_name: string;
    document_type?: Scope3DocumentType | string;
    source_url: string;
    document_date?: string;
    issued_by?: string;
    notes?: string;
}

export interface Scope3DocumentApiResponse<T = Scope3DocumentDto[]> {
    success: boolean;
    status_code: number;
    message: string;
    data: T | { items: T; total?: number; page?: number; page_size?: number };
    error: unknown | null;
    method?: string;
    path?: string;
    timestamp?: string;
}

export interface PendingDocumentAttachment {
    file: File;
    documentType: Scope3DocumentType | string;
    documentDate?: string;
    issuedBy?: string;
    notes?: string;
}

