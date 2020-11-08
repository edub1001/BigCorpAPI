import * as moxios from "moxios";
import { Employee } from '../../../../src/models/employee';
import { EmployeeProvider } from '../../../../src/services/providers/employeeProvider';
import { executeErrorSharedTests } from "./managerProvider.spec";

export function executeGetByIds() {
    describe('when getting employees by ids', () => {
        const employeeUrl = "/employeetest?id=1&id=2";
        let employeeProvider: EmployeeProvider;

        beforeAll(() => {
            employeeProvider = new EmployeeProvider();
        });

        it("should get employees with correct ids", async () => {
            const employee = new Employee(1);
            employee.first = "Eduardo";
            const employee2 = new Employee(2);
            employee.first = "Eduardo 2";

            moxios.stubRequest(employeeUrl, {
                status: 200,
                response: [employee, employee2]
            });

            const returnedEmployees = await employeeProvider.getByIds([1, 2]);
            // check basic office data
            expect(returnedEmployees).toHaveSize(2);
            expect(returnedEmployees[0].id).toBe(employee.id);
            expect(returnedEmployees[0].first).toBe(employee.first);
            expect(returnedEmployees[1].id).toBe(employee2.id);
            expect(returnedEmployees[1].first).toBe(employee2.first);
        });

        it("should get empty if array is empty", async () => {
            const returnedEmployees = await employeeProvider.getByIds([]);
            // check basic office data
            expect(returnedEmployees).toHaveSize(0);
        });

        it("should get empty if array is null", async () => {
            const returnedEmployees = await employeeProvider.getByIds(null);
            // check basic office data
            expect(returnedEmployees).toHaveSize(0);
        });

        it("should get empty if array is null", async () => {
            const returnedEmployees = await employeeProvider.getByIds(undefined);
            // check basic office data
            expect(returnedEmployees).toHaveSize(0);
        });

        executeErrorSharedTests(() => {
            return {
                testUrl: employeeUrl,
                employeeFunction: () => employeeProvider.getByIds([1, 2]),
                checkEmptyFunction: (employees: Employee | Employee[]) => expect(employees).toHaveSize(0)
            }
        });
    });
}