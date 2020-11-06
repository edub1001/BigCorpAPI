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
 *               message:
 *                   description: A more detailed description of the error
 *                   type: string
 *           example:
 *               error: UNEXPECTED_ERROR
 *               message: "Please contact system admin"
 */
export class AppError {
    error: string;
    message: string;
}

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