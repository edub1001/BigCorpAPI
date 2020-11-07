import { ExpandersErrorCodes } from "./expanders/expandersError";
import { ProvidersErrorCodes } from "./providers/providersError";

export enum ValidationErrorCodes {
    ID_ERROR,
    LIMIT_ERROR,
    OFFSET_ERROR,
    NOT_EXISTING
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