import "reflect-metadata";
import { EmployeeController } from "../../../src/controllers/employeeController";
import { executeSharedTests } from './baseRouting.spec';

describe("Employee routing", () => {
    executeSharedTests<EmployeeController>(EmployeeController, "employees");
});