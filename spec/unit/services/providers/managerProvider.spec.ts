import * as moxios from "moxios";
import { config } from 'node-config-ts';
import { Employee } from '../../../../src/models/employee';
import { EmployeeProvider } from '../../../../src/services/providers/employeeProvider';
import { ProvidersErrorCodes } from '../../../../src/services/providers/providersError';
import { ServicesError } from '../../../../src/services/servicesError';
import { executeGetAll } from "./managerProviderGetAll.spec";
import { executeGetById } from "./managerProviderGetById.spec";
import { executeGetByIds } from "./managerProviderGetByIds.spec";

interface IEmployeeProviderTest {
    testUrl: string,
    employeeFunction: () => Promise<Employee> | Promise<Employee[]>,
    checkEmptyFunction: (employees: Employee | Employee[]) => void
}

export function executeErrorSharedTests(createInstanceFn: () => IEmployeeProviderTest) {
    describe('when external service returning errors', () => {
        let testUrl: string;
        let employeeFunction: () => Promise<Employee> | Promise<Employee[]>;
        let checkEmptyFunction: (employees: Employee | Employee[]) => void;

        beforeEach(() => {
            ({ testUrl, employeeFunction, checkEmptyFunction } = createInstanceFn());
        });

        it("should get error when 404 and response null", async () => {
            moxios.stubRequest(testUrl, null);

            try {
                await employeeFunction();
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ProvidersErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE);
                expect(error.errors).toHaveSize(1);
            }
        });

        it("should get error when 500", async () => {
            moxios.stubRequest(testUrl, {
                status: 500,
                response: { message: "invalid" },
            });

            try {
                await employeeFunction();
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(ServicesError);
                expect(error.errorCode).toBe(ProvidersErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE);
                expect(error.errors).toHaveSize(1);
            }
        });

        it("should get empty when no employees", async () => {
            moxios.stubRequest(testUrl, {
                status: 200,
                response: []
            });

            const returnedEmployees = await employeeFunction();
            checkEmptyFunction(returnedEmployees);
        });

        it("should get empty with undefined employees", async () => {
            moxios.stubRequest(testUrl, {
                status: 200,
                response: undefined
            });

            const returnedEmployees = await employeeFunction();
            checkEmptyFunction(returnedEmployees);
        });

        it("should get empty with null employees", async () => {
            moxios.stubRequest(testUrl, {
                status: 200,
                response: null
            });

            const returnedEmployees = await employeeFunction();
            checkEmptyFunction(returnedEmployees);
        });

        it("should get empty when no employee with 404", async () => {
            moxios.stubRequest(testUrl, {
                status: 404,
                response: []
            });

            const returnedEmployees = await employeeFunction();
            checkEmptyFunction(returnedEmployees);
        });
    });
}

describe("Employee provider", () => {
    let employeeProvider: EmployeeProvider;
    const originalEmployeesUrl = config.employeesUrl;

    beforeAll(() => {
        employeeProvider = new EmployeeProvider();
    });

    beforeEach(() => {
        config.employeesUrl = "/employeetest"
        // import and pass your custom axios instance to this method
        moxios.install();
    })

    afterEach(() => {
        config.employeesUrl = originalEmployeesUrl;
        // import and pass your custom axios instance to this method
        moxios.uninstall();
    })

    it("should get error with wrong config", async () => {
        config.employeesUrl = undefined;
        expect(() => new EmployeeProvider()).toThrowMatching(error => {
            expect(error).toBeInstanceOf(ServicesError);
            expect(error.errorCode).toBe(ProvidersErrorCodes.EMPLOYEE_PROVIDER_MISSING_CONFIG);
            expect(error.errors).toHaveSize(1);
            expect(error.errors[0]).toBe(`Please provide a valid employee URL in the config`);
            return true;
        });
    });

    executeGetById();
    executeGetByIds();
    executeGetAll();
});