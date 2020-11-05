import { injectable } from "inversify";
import { ServicesError } from "../services/servicesError";

export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

@injectable()
export abstract class BaseController {
    wrapStatusCode = (fun, statusCode: HttpStatusCode) => {
        try {
            fun();
        } catch (error) {
            if (error instanceof ServicesError) {
                // tslint:disable-next-line: no-string-literal
                error["statusCode"] = statusCode;
            }
            throw error;
        }
    };
}