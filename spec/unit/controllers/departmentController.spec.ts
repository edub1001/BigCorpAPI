import { Mock } from 'moq.ts';
import "reflect-metadata";
import { DepartmentController } from "../../../src/controllers/departmentController";
import { Department } from '../../../src/models/department';
import { IExpanderFactory } from '../../../src/services/expanders/interfaces';
import { ExpanderTreeValidator } from '../../../src/services/expanders/treeExpanderValidator';
import { IDepartmentProvider } from "../../../src/services/providers/interfaces";
import { executeSharedTests } from './baseController.spec';

describe("Department controller", () => {
    let controller:DepartmentController;
    let providerMock: Mock<IDepartmentProvider>;

    const createInstance = (expanderFactory: IExpanderFactory, expanderTreeValidator: ExpanderTreeValidator) => {
        providerMock = new Mock<IDepartmentProvider>();
        controller = new DepartmentController(providerMock.object(), expanderFactory, expanderTreeValidator);
        return {
            controller,
            providerMock,
            propertyName: "department"
        };
    };

    executeSharedTests<Department>(createInstance);
});