import { Employee } from "../../../src/models/employee";
import { validateEntity } from "../../../src/services/entityValidator";
import { ErrorCodes, ServicesError } from "../../../src/services/servicesError";

describe("Entity validator", () => {
    it("should be ok if entity is valid", () => {
        expect(() => validateEntity(new Employee(1))).not.toThrow();
    });

    it("should throw error when entity is null", () => {
        expect(() => validateEntity(null)).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should throw error when entity is undefined", () => {
        expect(() => validateEntity(undefined)).toThrowMatching((error) => error instanceof ServicesError);
    });

    it("should return service error type", () => {
        try {
            validateEntity(null);
            fail();
        }
        catch (error) {
            expect(error).toBeInstanceOf(ServicesError);
            expect(error.errorCode).toBe(ErrorCodes.NOT_EXISTING);
            expect(error.errors).toHaveSize(1);
            expect(error.errors[0]).toBe(`Resource with given id not found`);
        }
    });
});