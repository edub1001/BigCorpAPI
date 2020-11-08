import { ExpandersErrorCodes } from "./expanders/expandersError";
import { ProvidersErrorCodes } from "./providers/providersError";

export enum ValidationErrorCodes {
    ID_ERROR = 1,
    LIMIT_ERROR = 2,
    OFFSET_ERROR = 3,
    NOT_EXISTING = 4
}

export type ErrorCodes = ValidationErrorCodes | ProvidersErrorCodes | ExpandersErrorCodes;
export const ErrorCodes = { ...ValidationErrorCodes, ...ProvidersErrorCodes, ...ExpandersErrorCodes }

export class ServicesError extends Error {
    public errors: string[];
    constructor(public errorCode:ErrorCodes, ...errors:string[]) {
        super(errors.join(". "));
        this.errors = errors;
    }
}