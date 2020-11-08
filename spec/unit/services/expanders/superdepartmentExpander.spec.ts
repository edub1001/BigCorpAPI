import { IDepartmentProvider } from "../../../../src/services/providers/interfaces";
import { SuperdepartmentExpander } from "../../../../src/services/expanders/superdepartmentExpander";
import { Expanders } from "../../../../src/services/expanders/expanders";
import { executeSharedTests } from './baseExpander.spec';
import { Mock } from "moq.ts";
import { Department } from "../../../../src/models/department";

describe("Superdepartment expander", () => {
    const createInstance = () => {
        const departmentProviderMock = new Mock<IDepartmentProvider>();
        const superdepartmentExpander = new SuperdepartmentExpander(departmentProviderMock.object());
        const departments = [];
        departments.push(new Department(1));
        departments.push(new Department(2));
        departments.push(new Department(3));
        departmentProviderMock.setup(x => x.getById(departments[0].id)).returns(departments[0]);
        departmentProviderMock.setup(x => x.getById(departments[1].id)).returns(departments[1]);
        departmentProviderMock.setup(x => x.getById(departments[2].id)).returns(departments[2]);
        return {
            expander: superdepartmentExpander,
            providerMock: departmentProviderMock,
            entitiesExpanded: departments,
            propertyName: "superdepartment"
        };
    };

    it("should handle department expansion", () => {
        expect(createInstance().expander.applyTo(Expanders.superdepartment)).toBeTrue();
    });

    it("should expand from", () => {
        const expandFrom = createInstance().expander.expandFrom();
        expect(expandFrom).toContain(Expanders.department);
        expect(expandFrom).toContain(Expanders.superdepartment);
    });

    executeSharedTests(createInstance);
});