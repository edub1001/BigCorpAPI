import "reflect-metadata";
import { OfficeController } from "../../../src/controllers/officeController";
import { executeSharedTests } from './baseRouting.spec';

describe("Office routing", () => {
    executeSharedTests<OfficeController>(OfficeController, "offices", false);
});