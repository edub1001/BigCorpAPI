import "reflect-metadata";
import { IEmployeeProvider } from "../../src/services/providers/interfaces";
import { EmployeeProvider } from "../../src/services/providers/employeeProvider";
import { config } from "node-config-ts";
import { ServicesError } from "../../src/services/servicesError";

describe("Basic Employee Provider check", () => {
    let employeeProvider: IEmployeeProvider;
    const originalEmployeesUrl = config.employeesUrl;

    beforeEach(() => {
        employeeProvider = new EmployeeProvider();
    });

    afterEach(() => {
        config.employeesUrl = originalEmployeesUrl;
    });

    it("should gracefully wrap error in service when using wrong url", async () => {
        config.employeesUrl = "http://invalid/"
        expectAsync(employeeProvider.getById(1)).toBeRejectedWithError(ServicesError);
    });

    it("should return employee with id", async () => {
        const employee = await employeeProvider.getById(1);
        expect(employee).not.toBeUndefined();
        expect(employee.id).toBe(1);
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