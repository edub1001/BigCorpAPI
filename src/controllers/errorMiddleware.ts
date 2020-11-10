import { NextFunction, Request, Response } from "express";
import { ServicesError, ErrorCodes } from "../services/servicesError";
import { HttpStatusCode } from "./baseController";

/**
 * @swagger
 * components:
 *   schemas:
 *       AppError:
 *           type: object
 *           properties:
 *               error:
 *                   description: The error code given by the app
 *                   type: string
 *               messages:
 *                   description: A more detailed description of the error
 *                   type: array | string
 *                   items: string
 *           example:
 *               error: UNEXPECTED_ERROR
 *               messages: "Please contact system admin"
 */
export class AppError {
    constructor(error:string, messages: string | string[]) {
        this.error = error;
        this.messages = messages;
        if (Array.isArray(messages) && messages.length === 1) {
            this.messages = messages[0];
        }
    }
    error: string;
    messages: string | string[];
}

// tslint:disable: no-string-literal
export function errorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
    if (error instanceof ServicesError && error["statusCode"] !== undefined) {
        response.status(error["statusCode"]).json(new AppError(ErrorCodes[error.errorCode], error.errors));
    }
    else {
        // check amount of info you want to disclosure to client
        response.status(HttpStatusCode.INTERNAL_SERVER).json(new AppError("UNEXPECTED_ERROR", error.message));
        next(error);
    }
}