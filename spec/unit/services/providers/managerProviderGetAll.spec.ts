import * as moxios from "moxios";
import { Employee } from '../../../../src/models/employee';
import { EmployeeProvider } from '../../../../src/services/providers/employeeProvider';
import { executeErrorSharedTests } from "./managerProvider.spec";

export function executeGetAll() {
    describe('when getting all employees', () => {
        const employeeUrl = "/employeetest?limit=2&offset=3";
        let employeeProvider: EmployeeProvider;

        beforeAll(() => {
            employeeProvider = new EmployeeProvider();
        });

        it("should get employees with correct ids", async () => {
            const employee = new Employee(4);
            employee.first = "Eduardo";
            const employee2 = new Employee(5);
            employee.first = "Eduardo 2";

            moxios.stubRequest(employeeUrl, {
                status: 200,
                response: [employee, employee2]
            });

            const returnedEmployees = await employeeProvider.getAll(2, 3);
            // check basic office data
            expect(returnedEmployees).toHaveSize(2);
            expect(returnedEmployees[0].id).toBe(employee.id);
            expect(returnedEmployees[0].first).toBe(employee.first);
            expect(returnedEmployees[1].id).toBe(employee2.id);
            expect(returnedEmployees[1].first).toBe(employee2.first);
        });

        executeErrorSharedTests(() => {
            return {
                testUrl: employeeUrl,
                employeeFunction: () => employeeProvider.getAll(2, 3),
                checkEmptyFunction: (employees: Employee | Employee[]) => expect(employees).toHaveSize(0)
            }
        });
    });
}