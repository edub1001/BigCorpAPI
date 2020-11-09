import "reflect-metadata";
import { DepartmentController } from "../../../src/controllers/departmentController";
import { executeSharedTests } from './baseRouting.spec';

describe("Department routing", () => {
    executeSharedTests<DepartmentController>(DepartmentController, "departments");
});