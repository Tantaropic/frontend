// Mirrors backend/src/common/dtos/response.dto.ts — keep in sync manually.

export interface ApiSuccess<T> {
    success: true;
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
    requestId?: string;
    path?: string;
}

export interface ApiFailure {
    success: false;
    statusCode: number;
    errorCode: string;
    message: string;
    errors: string[];
    timestamp: string;
    path?: string;
    requestId?: string;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
    readonly statusCode: number;
    readonly errorCode: string;
    readonly errors: string[];

    constructor(failure: ApiFailure) {
        super(failure.message);
        this.name = 'ApiError';
        this.statusCode = failure.statusCode;
        this.errorCode = failure.errorCode;
        this.errors = failure.errors ?? [];
    }
}