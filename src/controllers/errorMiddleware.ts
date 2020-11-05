import { NextFunction, Request, Response } from "express";
import { ServicesError, ErrorCodes } from "../services/servicesError";
import { HttpStatusCode } from "./baseController";

// tslint:disable: no-string-literal
export function errorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
    if (error instanceof ServicesError && error["statusCode"] !== undefined) {
        response.status(error["statusCode"]).send({
            "error": ErrorCodes[error.errorCode],
            "message": error.message
        });
    }
    else {
        // check amount of info you want to send to client
        response.status(HttpStatusCode.INTERNAL_SERVER).send({
            "error" : ErrorCodes[ErrorCodes.UNEXPECTED_ERROR],
            "message": error.message
        });
    }
    next(error);
}