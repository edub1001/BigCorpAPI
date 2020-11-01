export class ParamError extends Error {
    constructor(...errors:string[]) {
        super(...errors);
    }
}