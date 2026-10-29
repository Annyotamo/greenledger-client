import { privateApi } from "@/lib/http/client";
import {
    CreateScope3DocumentJsonPayload,
    normalizeScope3Category,
    PendingDocumentAttachment,
    PresignedUploadUrlResponse,
    PresignScope3DocumentPayload,
    Scope3Document,
    Scope3DocumentApiResponse,
    Scope3DocumentDto,
    Scope3DocumentType,
    UploadScope3DocumentMultipartPayload,
} from "./types";

export function mapScope3Document(dto: Scope3DocumentDto): Scope3Document {
    const rawFileName = dto.file_name || dto.document_name || "document";
    const extensionFromDoc = rawFileName.includes(".")
        ? "." + rawFileName.split(".").pop()?.toLowerCase()
        : "";

    return {
        id: dto.id,
        createdAt: dto.created_at || new Date().toISOString(),
        updatedAt: dto.updated_at || new Date().toISOString(),
        tenantId: dto.tenant_id || "",
        category: dto.category,
        activityId: dto.activity_id,
        documentType: dto.document_type || Scope3DocumentType.INVOICE_BILL,
        documentName: dto.document_name || rawFileName,
        sourceUrl: dto.source_url || "",
        downloadUrl: dto.download_url || "",
        viewUrl: dto.view_url || "",
        s3PresignedUrl: dto.s3_presigned_url,
        fileName: rawFileName,
        fileExtension: dto.file_extension || extensionFromDoc,
        mimeType: dto.mime_type || "application/octet-stream",
        notes: dto.notes || null,
        documentDate: dto.document_date || null,
        issuedBy: dto.issued_by || null,
        uploadedBy: dto.uploaded_by || null,
    };
}

/**
 * Fetches all attached supporting documents for a specific Scope 3 activity entry.
 */
export async function getScope3Documents(
    category: string | number,
    activityId: string,
): Promise<Scope3Document[]> {
    if (!activityId) return [];
    const cat = normalizeScope3Category(category);

    try {
        const response = await privateApi.get<Scope3DocumentApiResponse>(
            `/tenant/scope3/${cat}/${activityId}/documents`,
        );

        const dataPayload = response.data?.data;
        const rawItems = Array.isArray(dataPayload)
            ? dataPayload
            : (dataPayload as { items?: Scope3DocumentDto[] })?.items ?? [];

        return Array.isArray(rawItems) ? rawItems.map(mapScope3Document) : [];
    } catch {
        // Return empty list on failure or in demo mode without throwing unhandled exceptions
        return [];
    }
}

/**
 * Uploads a document directly using multipart/form-data.
 */
export async function uploadScope3Document(
    category: string | number,
    activityId: string,
    payload: UploadScope3DocumentMultipartPayload,
): Promise<Scope3Document> {
    const cat = normalizeScope3Category(category);
    const formData = new FormData();

    formData.append("file", payload.file);
    if (payload.document_name) {
        formData.append("document_name", payload.document_name);
    } else if (payload.file?.name) {
        formData.append("document_name", payload.file.name);
    }
    formData.append("document_type", payload.document_type || Scope3DocumentType.INVOICE_BILL);
    if (payload.document_date) formData.append("document_date", payload.document_date);
    if (payload.issued_by) formData.append("issued_by", payload.issued_by);
    if (payload.notes) formData.append("notes", payload.notes);

    const response = await privateApi.post<Scope3DocumentApiResponse<Scope3DocumentDto>>(
        `/tenant/scope3/${cat}/${activityId}/documents`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    const dto = response.data.data as Scope3DocumentDto;
    return mapScope3Document(dto);
}

/**
 * Helper to upload a pending document attachment for a newly created or existing activity.
 */
export async function uploadPendingScope3Document(
    category: string | number,
    activityId: string,
    pending: PendingDocumentAttachment,
): Promise<Scope3Document | null> {
    if (!pending || !pending.file || !activityId) return null;
    return uploadScope3Document(category, activityId, {
        file: pending.file,
        document_type: pending.documentType,
        document_date: pending.documentDate,
        issued_by: pending.issuedBy,
        notes: pending.notes,
    });
}

/**
 * Requests a presigned S3 upload URL for two-step upload.
 */
export async function presignScope3DocumentUrl(
    category: string | number,
    activityId: string,
    payload: PresignScope3DocumentPayload,
): Promise<PresignedUploadUrlResponse> {
    const cat = normalizeScope3Category(category);
    const response = await privateApi.post<{ success: boolean; data: PresignedUploadUrlResponse }>(
        `/tenant/scope3/${cat}/${activityId}/documents/presign`,
        {
            category: cat,
            activity_id: activityId,
            document_name: payload.document_name,
            content_type: payload.content_type,
        },
    );
    return response.data.data;
}

/**
 * Completes the document attachment record after a direct S3 PUT.
 */
export async function attachScope3DocumentRecord(
    category: string | number,
    activityId: string,
    payload: CreateScope3DocumentJsonPayload,
): Promise<Scope3Document> {
    const cat = normalizeScope3Category(category);
    const response = await privateApi.post<Scope3DocumentApiResponse<Scope3DocumentDto>>(
        `/tenant/scope3/${cat}/${activityId}/documents`,
        {
            category: cat,
            activity_id: activityId,
            ...payload,
        },
    );
    const dto = response.data.data as Scope3DocumentDto;
    return mapScope3Document(dto);
}

/**
 * Soft-deletes a document attachment from a Scope 3 activity entry.
 */
export async function deleteScope3Document(
    category: string | number,
    activityId: string,
    documentId: string,
): Promise<boolean> {
    const cat = normalizeScope3Category(category);
    const response = await privateApi.delete(
        `/tenant/scope3/${cat}/${activityId}/documents/${documentId}`,
    );
    return response.data?.success ?? true;
}

/**
 * Safely triggers inline view of a document in the browser.
 */
export function openScope3DocumentView(
    doc: Scope3Document,
    category: string | number,
    activityId: string,
): void {
    if (doc.s3PresignedUrl) {
        window.open(doc.s3PresignedUrl, "_blank", "noopener,noreferrer");
        return;
    }

    if (doc.viewUrl) {
        const fullUrl = doc.viewUrl.startsWith("http")
            ? doc.viewUrl
            : `${process.env.NEXT_PUBLIC_BASE_URL || "https://dev.greenledgeresg.com/api/v1"}${doc.viewUrl.startsWith("/") ? "" : "/"}${doc.viewUrl}`;
        window.open(fullUrl, "_blank", "noopener,noreferrer");
        return;
    }

    const cat = normalizeScope3Category(category);
    const fallbackEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL || "https://dev.greenledgeresg.com/api/v1"}/tenant/scope3/${cat}/${activityId}/documents/${doc.id}/view`;
    window.open(fallbackEndpoint, "_blank", "noopener,noreferrer");
}

/**
 * Safely triggers downloading of a document file.
 */
export function downloadScope3Document(
    doc: Scope3Document,
    category: string | number,
    activityId: string,
): void {
    const downloadTarget =
        doc.s3PresignedUrl ||
        doc.downloadUrl ||
        (doc.sourceUrl?.startsWith("http") ? doc.sourceUrl : null);

    if (downloadTarget) {
        const a = document.createElement("a");
        a.href = downloadTarget;
        a.download = doc.fileName || doc.documentName || "document";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    const cat = normalizeScope3Category(category);
    const fallbackEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL || "https://dev.greenledgeresg.com/api/v1"}/tenant/scope3/${cat}/${activityId}/documents/${doc.id}/download`;
    window.open(fallbackEndpoint, "_blank");
}

