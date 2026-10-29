import { CustomSelectOption } from "@/components/ui/select";

/**
 * Supported Scope 3 Document Types Enum
 */
export enum Scope3DocumentType {
    INVOICE_BILL = "invoice_bill",
    PURCHASE_PROCUREMENT_RECORD = "purchase_procurement_record",
    SUPPLIER_DATA = "supplier_data",
    UTILITY_ENERGY_RECORD = "utility_energy_record",
    TRANSPORT_LOGISTICS_RECORD = "transport_logistics_record",
    WEIGHBRIDGE_QUANTITY_RECORD = "weighbridge_quantity_record",
    WASTE_DISPOSAL_RECORD = "waste_disposal_record",
    TRAVEL_EXPENSE_RECORD = "travel_expense_record",
    CERTIFICATE_THIRD_PARTY_DOCUMENT = "certificate_third_party_document",
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
    { label: "Invoice / bill", value: Scope3DocumentType.INVOICE_BILL },
    { label: "Purchase / Procurement Record", value: Scope3DocumentType.PURCHASE_PROCUREMENT_RECORD },
    { label: "Supplier data", value: Scope3DocumentType.SUPPLIER_DATA },
    { label: "Utility / energy record", value: Scope3DocumentType.UTILITY_ENERGY_RECORD },
    { label: "Transport / logistics record", value: Scope3DocumentType.TRANSPORT_LOGISTICS_RECORD },
    { label: "Weighbridge / quantity record", value: Scope3DocumentType.WEIGHBRIDGE_QUANTITY_RECORD },
    { label: "Waste / disposal record", value: Scope3DocumentType.WASTE_DISPOSAL_RECORD },
    { label: "Travel / expense record", value: Scope3DocumentType.TRAVEL_EXPENSE_RECORD },
    { label: "Certificate / third party document", value: Scope3DocumentType.CERTIFICATE_THIRD_PARTY_DOCUMENT },
    { label: "Other", value: Scope3DocumentType.OTHER },
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

