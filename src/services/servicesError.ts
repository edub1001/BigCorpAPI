export enum ErrorCodes {
    ID_ERROR,
    LIMIT_ERROR,
    OFFSET_ERROR,
    EXPAND_ERROR,
    UNEXPECTED_ERROR
}

export class ServicesError extends Error {
    public errors: string[];
    constructor(public errorCode:ErrorCodes, ...errors:string[]) {
        super(errors.join(". "));
        this.errors = errors;
    }
}