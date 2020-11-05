import { ServicesError } from "../servicesError"

export enum ErrorCodes {
    EMPLOYEE_PROVIDER_MISSING_CONFIG,
    EMPLOYEE_PROVIDER_ERROR_RESPONSE,
    EMPLOYEE_PROVIDER_NOT_FOUND
}

export class ProvidersError extends ServicesError {
    constructor(errorCode,...errors:any[]) {
        super(errorCode, ...errors);
    }
}