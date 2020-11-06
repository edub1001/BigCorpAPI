export enum ErrorCodes {
    ID_ERROR,
    LIMIT_ERROR,
    OFFSET_ERROR,
    EXPAND_ERROR,
    UNEXPECTED_ERROR
}

export class ServicesError extends Error {
    constructor(public errorCode:ErrorCodes, ...errors:any[]) {
        super(...errors);
    }
}