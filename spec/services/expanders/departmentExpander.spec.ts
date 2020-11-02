import { Mock } from 'moq.ts';
import "reflect-metadata";
import { Department } from "../../../src/models/department";
import { IDepartmentProvider } from "../../../src/providers/interfaces";
import { DepartmentExpander } from "../../../src/services/expanders/departmentExpander";
import { Expanders } from "../../../src/services/expanders/expanders";
import { executeSharedTests } from './baseExpander.spec';

describe("Department expander", () => {
    const createInstance = () => {
        const departmentProviderMock = new Mock<IDepartmentProvider>();
        const departmentExpander = new DepartmentExpander(departmentProviderMock.object());
        // create departments
        const departments = [];
        departments.push(new Department(1));
        departments.push(new Department(2));
        departments.push(new Department(3));
        departmentProviderMock.setup(x => x.getById(departments[0].id)).returns(departments[0]);
        departmentProviderMock.setup(x => x.getById(departments[1].id)).returns(departments[1]);
        departmentProviderMock.setup(x => x.getById(departments[2].id)).returns(departments[2]);
        return {
            expander: departmentExpander,
            providerMock: departmentProviderMock,
            entitiesExpanded: departments,
            propertyName: "department"
        };
    };

    it("should handle department expansion", () => {
        expect(createInstance().expander.applyTo(Expanders.department)).toBeTrue();
    });

    executeSharedTests(createInstance);
});