import * as moxios from "moxios";
import { Employee } from '../../../../src/models/employee';
import { EmployeeProvider } from '../../../../src/services/providers/employeeProvider';
import { ProvidersErrorCodes } from '../../../../src/services/providers/providersError';
import { ServicesError } from '../../../../src/services/servicesError';
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

        it("should get error when no employee", async () => {
            moxios.stubRequest(employeeUrl, {
                status: 200,
                response: []
            });

            try {
                await employeeProvider.getById(1);
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ProvidersErrorCodes.NOT_FOUND);
                expect(error.errors).toHaveSize(1);
                expect(error.errors[0]).toBe(`Employee with id 1 not found`);
            }
        });

        it("should get error with undefined employee", async () => {
            moxios.stubRequest(employeeUrl, {
                status: 200,
                response: undefined
            });

            await expectAsync(employeeProvider.getById(1)).toBeRejectedWithError(
                ServicesError, "Employee with id 1 not found"
            );
        });

        it("should get error with null employee", async () => {
            moxios.stubRequest(employeeUrl, {
                status: 200,
                response: null
            });

            await expectAsync(employeeProvider.getById(1)).toBeRejectedWithError(
                ServicesError, "Employee with id 1 not found"
            );
        });

        it("should get error when no employee with 404", async () => {
            moxios.stubRequest(employeeUrl, {
                status: 404,
                response: []
            });

            await expectAsync(employeeProvider.getById(1)).toBeRejectedWithError(
                ServicesError, "Employee with id 1 not found"
            );
        });

        executeErrorSharedTests(
            () => {
                return { testUrl: employeeUrl, employeeFunction: () => employeeProvider.getById(1) }
            }, true);
    });
}