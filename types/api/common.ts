export interface ApiEnvelope<TData> {
    response: string;
    stsCode: number;
    data: TData;
}

export interface ApiErrorBody {
    response?: string;
    message?: string;
    stsCode?: number;
}

export interface Option {
    label: string;
    value: string;
}
