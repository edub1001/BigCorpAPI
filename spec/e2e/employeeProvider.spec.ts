import "reflect-metadata";
import { IEmployeeProvider } from "../../src/services/providers/interfaces";
import { EmployeeProvider } from "../../src/services/providers/employeeProvider";

describe("Basic Employee Provider check", () => {
    let employeeProvider: IEmployeeProvider;

    beforeEach(() => {
        employeeProvider = new EmployeeProvider();
    });

    it("should return employees with ids", async () => {
        const employees = await employeeProvider.getByIds([1,2,3]);
        expect(employees).toHaveSize(3);
        expect(employees[0].id).toBe(1);
        expect(employees[1].id).toBe(2);
        expect(employees[2].id).toBe(3);
    });

    it("should return employees with offset and limit", async () => {
        const employees = await employeeProvider.getAll(3, 2);
        expect(employees).toHaveSize(3);
        expect(employees[0].id).toBe(3);
        expect(employees[1].id).toBe(4);
        expect(employees[2].id).toBe(5);
    });
});