import { Mock } from 'moq.ts';
import "reflect-metadata";
import { OfficeController } from "../../../src/controllers/officeController";
import { Office } from '../../../src/models/office';
import { IExpanderFactory } from '../../../src/services/expanders/interfaces';
import { ExpanderTreeValidator } from '../../../src/services/expanders/treeExpanderValidator';
import { IOfficeProvider } from "../../../src/services/providers/interfaces";
import { executeSharedTests } from './baseController.spec';

describe("Employee controller", () => {
    let controller: OfficeController;
    let providerMock: Mock<IOfficeProvider>;

    const createInstance = (expanderFactory: IExpanderFactory, expanderTreeValidator: ExpanderTreeValidator) => {
        providerMock = new Mock<IOfficeProvider>();
        controller = new OfficeController(providerMock.object(), expanderFactory, expanderTreeValidator);
        return {
            controller,
            providerMock,
            propertyName: "office"
        };
    };

    executeSharedTests<Office>(createInstance);
});