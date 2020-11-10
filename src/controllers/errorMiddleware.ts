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
        // if is it a single message, just get the first instead of sending array
        if (Array.isArray(messages) && messages.length === 1) {
            this.messages = messages[0];
        }
    }
    error: string;
    messages: string | string[];
}

// tslint:disable: no-string-literal
/**
 * Middleware to handle errors
 * @param error Error being received
 * @param request Express request
 * @param response Express response
 * @param next Express next function handler
 */
export function errorMiddleware(error: any, request: Request, response: Response, next: NextFunction) {
    // if it is a service error but wrapped with status code
    if (error instanceof ServicesError && error["statusCode"] !== undefined) {
        // set error status in response and send error details
        response.status(error["statusCode"]).json(new AppError(ErrorCodes[error.errorCode], error.errors));
    }
    else {
        // check amount of info you want to disclosure to client
        response.status(HttpStatusCode.INTERNAL_SERVER).json(new AppError("UNEXPECTED_ERROR", error.message));
        next(error);
    }
}