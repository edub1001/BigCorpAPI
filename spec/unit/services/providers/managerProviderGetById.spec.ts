import * as moxios from "moxios";
import { Employee } from '../../../../src/models/employee';
import { EmployeeProvider } from '../../../../src/services/providers/employeeProvider';
import { executeErrorSharedTests } from "./managerProvider.spec";

export function executeGetById() {
    describe('when getting employee by id', () => {
        const employeeUrl = "/employeetest?id=1";
        let employeeProvider: EmployeeProvider;

        beforeAll(() => {
            employeeProvider = new EmployeeProvider();
        });

        it("should get an employee with correct id", async () => {
            const employee = new Employee(1);
            employee.first = "Eduardo";

            moxios.stubRequest(employeeUrl, {
                status: 200,
                response: [employee]
            });

            const returnedEmployee = await employeeProvider.getById(1);
            // check basic office data
            expect(returnedEmployee.id).toBe(employee.id);
            expect(returnedEmployee.first).toBe(employee.first);
        });

        executeErrorSharedTests(() => {
            return {
                testUrl: employeeUrl,
                employeeFunction: () => employeeProvider.getById(1),
                checkEmptyFunction: (employee: Employee | Employee[]) => expect(employee).toBeUndefined()
            }
        });
    });
}