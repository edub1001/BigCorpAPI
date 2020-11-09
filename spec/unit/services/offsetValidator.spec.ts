import { validateOffset } from "../../../src/services/offsetValidator";
import { ErrorCodes, ServicesError } from "../../../src/services/servicesError";

describe("Offset validator", () => {
    it("should be ok offset is 0", () => {
        expect(() => validateOffset(0)).not.toThrow();
    });

    it("should be ok offset is greater than 0", () => {
        expect(() => validateOffset(1)).not.toThrow();
    });

    it("should throw error when offset is string", () => {
        expect(() => validateOffset("aaaa")).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should throw error when offset is less than 0", () => {
        expect(() => validateOffset(-1)).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should return service error type", () => {
        try {
            validateOffset("aaaa");
            fail();
        }
        catch (error) {
            expect(error).toBeInstanceOf(ServicesError);
            expect(error.errorCode).toBe(ErrorCodes.OFFSET_ERROR);
            expect(error.errors).toHaveSize(1);
            expect(error.errors[0]).toBe(`Offset should be greater or equal than 0`);
        }
    });
});