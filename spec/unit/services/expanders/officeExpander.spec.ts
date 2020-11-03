import { Mock } from 'moq.ts';
import "reflect-metadata";
import { Office } from "../../../../src/models/office";
import { IOfficeProvider } from "../../../../src/providers/interfaces";
import { Expanders } from "../../../../src/services/expanders/expanders";
import { OfficeExpander } from "../../../../src/services/expanders/officeExpander";
import { executeSharedTests } from './baseExpander.spec';

describe("Office expander", () => {
    const createInstance = () => {
        const officeProviderMock = new Mock<IOfficeProvider>();
        const officeExpander = new OfficeExpander(officeProviderMock.object());
        // create office
        const offices = [];
        offices.push(new Office(1));
        offices.push(new Office(2));
        offices.push(new Office(3));
        officeProviderMock.setup(x => x.getById(offices[0].id)).returns(offices[0]);
        officeProviderMock.setup(x => x.getById(offices[1].id)).returns(offices[1]);
        officeProviderMock.setup(x => x.getById(offices[2].id)).returns(offices[2]);
        return {
            expander: officeExpander,
            providerMock: officeProviderMock,
            entitiesExpanded: offices,
            propertyName: "office"
        };
    };

    it("should handle office expansion", () => {
        expect(createInstance().expander.applyTo(Expanders.office)).toBeTrue();
    });

    executeSharedTests(createInstance);
});