import { validateLimit } from "../../../src/services/limitValidator";
import { ErrorCodes, ServicesError } from "../../../src/services/servicesError";

describe("Limit validator", () => {
    it("should be ok limit is greater than 0", () => {
        expect(() => validateLimit(1)).not.toThrow();
    });

    it("should be ok limit is less than 1000", () => {
        expect(() => validateLimit(999)).not.toThrow();
    });

    it("should be ok error when limit is 1000", () => {
        expect(() => validateLimit(1000)).not.toThrow();
    });

    it("should throw error when limit is string", () => {
        expect(() => validateLimit("aaaa")).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should throw error when limit is 0", () => {
        expect(() => validateLimit(0)).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should throw error when limit is less than 0", () => {
        expect(() => validateLimit(-1)).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should throw error when limit is greater than 1000", () => {
        expect(() => validateLimit(1001)).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should return service error type", () => {
        try {
            validateLimit("aaaa");
            fail();
        }
        catch (error) {
            expect(error).toBeInstanceOf(ServicesError);
            expect(error.errorCode).toBe(ErrorCodes.LIMIT_ERROR);
            expect(error.errors).toHaveSize(1);
            expect(error.errors[0]).toBe(`Limit should be greater than 0 and less or equal to 1000`);
        }
    });
});