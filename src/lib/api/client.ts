import { ApiEnvelope, ApiError } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
}

export async function apiFetch<T>(
    path: string,
    init: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...init,
        cache: init.cache ?? 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(init.headers || {}),
        }
    });

    const text = await response.text();
    const body = (text ? JSON.parse(text) : {}) as ApiEnvelope<T> | T | null;

    if (!body) {
        if (!response.ok) {
            throw new ApiError({
                success: false,
                statusCode: response.status,
                errorCode: 'EMPTY_BODY',
                message: response.statusText || 'Empty error response',
                errors: [],
                timestamp: new Date().toISOString(),
            });
        }
        return null as T;
    }

    if (isApiEnvelope<T>(body)) {
        if (body.success) return body.data;
        throw new ApiError(body);
    }

    if (response.ok) return body as T;

    throw new ApiError({
        success: false,
        statusCode: response.status,
        errorCode: 'RAW_ERROR_RESPONSE',
        message: response.statusText || 'Request failed',
        errors: [],
        timestamp: new Date().toISOString(),
    });
}

function isApiEnvelope<T>(body: ApiEnvelope<T> | T): body is ApiEnvelope<T> {
    return (
        typeof body === 'object' &&
        body !== null &&
        'success' in body &&
        'statusCode' in body &&
        'timestamp' in body
    );
}