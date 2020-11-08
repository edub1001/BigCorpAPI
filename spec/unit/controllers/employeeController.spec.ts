import { Mock } from 'moq.ts';
import "reflect-metadata";
import { EmployeeController } from "../../../src/controllers/employeeController";
import { Employee } from '../../../src/models/employee';
import { IExpanderFactory } from '../../../src/services/expanders/interfaces';
import { ExpanderTreeValidator } from '../../../src/services/expanders/treeExpanderValidator';
import { IEmployeeProvider } from "../../../src/services/providers/interfaces";
import { executeSharedTests } from './baseController.spec';

describe("Employee controller", () => {
    let controller: EmployeeController;
    let providerMock: Mock<IEmployeeProvider>;

    const createInstance = (expanderFactory: IExpanderFactory, expanderTreeValidator: ExpanderTreeValidator) => {
        providerMock = new Mock<IEmployeeProvider>();
        controller = new EmployeeController(providerMock.object(), expanderFactory, expanderTreeValidator);
        return {
            controller,
            providerMock,
            propertyName: "employee"
        };
    };

    executeSharedTests<Employee>(createInstance);
});