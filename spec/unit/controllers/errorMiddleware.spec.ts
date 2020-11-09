import { NextFunction, Request, Response } from "express";
import { It, Mock, Times } from 'moq.ts';
import { HttpStatusCode } from "../../../src/controllers/baseController";
import { errorMiddleware } from "../../../src/controllers/errorMiddleware"
import { ExpandersErrorCodes } from "../../../src/services/expanders/expandersError";
import { ProvidersErrorCodes } from "../../../src/services/providers/providersError";
import { ErrorCodes, ServicesError } from '../../../src/services/servicesError';

describe("Error middleware", () => {
    let error: ServicesError;
    let request: Mock<Request>;
    let response: Mock<Response>;
    let next: Mock<NextFunction>;

    beforeEach(() => {
        error = new ServicesError(ErrorCodes.ID_ERROR);
        request = new Mock<Request>();
        response = new Mock<Response>();
        next = new Mock<NextFunction>();
        response.setup(x => x.json(It.IsAny())).returns(response.object());
        response.setup(x => x.status(It.IsAny())).returns(response.object());
    });

    it("should call next", () => {
        errorMiddleware(error, request.object(), response.object(), next.object())
        next.verify(x => x(error), Times.Exactly(1));
    });

    describe('when wrapping http status code', () => {
        it("should set status to the one set by controller", () => {
            (error as any).statusCode = HttpStatusCode.BAD_REQUEST;

            errorMiddleware(error, request.object(), response.object(), next.object())
            // set status to specified one
            response.verify(x => x.status(HttpStatusCode.BAD_REQUEST), Times.Exactly(1));
            response.verify(x => x.json(It.Is<any>(v => {
                return v.error === "ID_ERROR" && v.message.length === 0;
            })), Times.Exactly(1));
        });

        it("should set status to the one set by controller with original error code", () => {
            (error as any).statusCode = HttpStatusCode.INTERNAL_SERVER;
            error.errorCode = ProvidersErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE;

            errorMiddleware(error, request.object(), response.object(), next.object())
            // set status to specified one
            response.verify(x => x.status(HttpStatusCode.INTERNAL_SERVER), Times.Exactly(1));
            response.verify(x => x.json(It.Is<any>(v => {
                return v.error === "EMPLOYEE_PROVIDER_ERROR_RESPONSE" && v.message.length === 0;
            })), Times.Exactly(1));
        });

        it("should set error response to the error message", () => {
            (error as any).statusCode = HttpStatusCode.INTERNAL_SERVER;
            error.errorCode = ExpandersErrorCodes.FACTORY_MISSING_EXPANDERS;
            error.errors.push("Missing factory 1");
            error.errors.push("Missing factory 2");

            errorMiddleware(error, request.object(), response.object(), next.object())
            // set status to specified one
            response.verify(x => x.status(HttpStatusCode.INTERNAL_SERVER), Times.Exactly(1));
            response.verify(x => x.json(It.Is<any>(v => {
                return v.error === "FACTORY_MISSING_EXPANDERS" && v.message.length === 2
                &&  v.message[0] === "Missing factory 1" && v.message[1] === "Missing factory 2";
            })), Times.Exactly(1));
        });
    });

    describe('when no http status code', () => {
        it("should set status to internal server error", () => {
            const serviceError = new ServicesError(ErrorCodes.OFFSET_ERROR, "Fatal error");
            errorMiddleware(serviceError, request.object(), response.object(), next.object())
            // set status to specified one
            response.verify(x => x.status(HttpStatusCode.INTERNAL_SERVER), Times.Exactly(1));
            response.verify(x => x.json(It.Is<any>(v => {
                return v.error === "UNEXPECTED_ERROR" && v.message === "Fatal error";
            })), Times.Exactly(1));
        });
    });

    describe('when no http status code and not service error', () => {
        it("should set status to internal server error", () => {
            const notServiceError = new Error("Not sent by services");
            errorMiddleware(notServiceError, request.object(), response.object(), next.object())
            // set status to specified one
            response.verify(x => x.status(HttpStatusCode.INTERNAL_SERVER), Times.Exactly(1));
            response.verify(x => x.json(It.Is<any>(v => {
                return v.error === "UNEXPECTED_ERROR"  && v.message === "Not sent by services";
            })), Times.Exactly(1));
        });
    });
});