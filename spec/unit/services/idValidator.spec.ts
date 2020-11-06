import { validateId } from "../../../src/services/idValidator";
import { ErrorCodes, ServicesError } from "../../../src/services/servicesError";

describe("Id validator", () => {
    it("should be ok id is greater than 0", () => {
        expect(() => validateId(1)).not.toThrow();
    });

    it("should throw error when id is string", () => {
        expect(() => validateId("id")).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should throw error when id is 0", () => {
        expect(() => validateId(0)).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should throw error when id is less than 0", () => {
        expect(() => validateId(-1)).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should return service error type", () => {
        try {
            validateId("aaaa");
            fail();
        }
        catch (error) {
            expect(error).toBeInstanceOf(ServicesError);
            expect(error.errorCode).toBe(ErrorCodes.ID_ERROR);
            expect(error.errors).toHaveSize(1);
            expect(error.errors[0]).toBe(`Id should be greater than 0`);
        }
    });
});