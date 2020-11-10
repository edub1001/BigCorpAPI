import { ExpandersErrorCodes } from "./expanders/expandersError";
import { ProvidersErrorCodes } from "./providers/providersError";

export enum ValidationErrorCodes {
    ID_ERROR = 1,
    LIMIT_ERROR = 2,
    OFFSET_ERROR = 3,
    NOT_EXISTING = 4
}

// joint error codes from validation, providers and expanders
export type ErrorCodes = ValidationErrorCodes | ProvidersErrorCodes | ExpandersErrorCodes;
export const ErrorCodes = { ...ValidationErrorCodes, ...ProvidersErrorCodes, ...ExpandersErrorCodes }

/** Main class for handling services errors that might occur in the layer */
export class ServicesError extends Error {
    // internal error array that will go to the client of the services
    public errors: string[];
    constructor(public errorCode:ErrorCodes, ...errors:string[]) {
        // go to the base error class with joined error messages
        super(errors.join(". "));
        this.errors = errors;
    }
}