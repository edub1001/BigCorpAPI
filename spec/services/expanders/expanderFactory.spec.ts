import { It, Mock, Times } from 'moq.ts';
import "reflect-metadata";
import { Employee } from "../../../src/models/employee";
import { Office } from "../../../src/models/office";
import { ExpanderFactory } from "../../../src/services/expanders/expanderFactory";
import { Expanders } from "../../../src/services/expanders/expanders";
import { IExpander, IExpanderFactory } from '../../../src/services/expanders/interfaces';
import { OfficeExpander } from "../../../src/services/expanders/officeExpander";

describe("Expander factory", () => {
    let departmentExpanderMock : Mock<IExpander>;
    let officeExpanderMock: Mock<IExpander>;
    let superdepartmentExpanderMock: Mock<IExpander>;
    let managerExpanderMock: Mock<IExpander>;
    let expanderFactory: IExpanderFactory;

    beforeEach(() => {
        departmentExpanderMock = new Mock<IExpander>();
        officeExpanderMock = new Mock<IExpander>();
        superdepartmentExpanderMock = new Mock<IExpander>();
        managerExpanderMock = new Mock<IExpander>();
        expanderFactory = new ExpanderFactory([
            departmentExpanderMock.object(),
            officeExpanderMock.object(),
            superdepartmentExpanderMock.object(),
            managerExpanderMock.object()
        ]);
    });

    it("should fail if constructed with null", () => {
        expect(() => new ExpanderFactory(null)).toThrowError();
    });

    it("should fail if constructed with undefined", () => {
        expect(() => new ExpanderFactory(undefined)).toThrowError();
    });

    it("should fail if constructed with empty array of expanders", () => {
        expect(() => new ExpanderFactory([])).toThrowError();
    });

    it("should get fist instance", () => {
        const mockExpander1 = new Mock<IExpander>();
        const mockExpander2 = new Mock<IExpander>();
        mockExpander1.setup(x => x.applyTo(Expanders.employee)).returns(true);
        mockExpander2.setup(x => x.applyTo(Expanders.employee)).returns(true);
        // act on expand
        expanderFactory = new ExpanderFactory([mockExpander1.object(), mockExpander2.object()])
        const employeeExpander = expanderFactory.getExpander(Expanders.employee);
        // assert
        mockExpander1.verify(x => x.applyTo(It.Is(v=> v === Expanders.employee)), Times.Exactly(1));
        mockExpander2.verify(x => x.applyTo(It.Is(v=> v === Expanders.employee)), Times.Never());
        expect(employeeExpander).toBe(mockExpander1.object());
    });

    it("should get department expander when asking for deparment", () => {
        departmentExpanderMock.setup(x => x.applyTo(Expanders.department)).returns(true);
        // act on expand
        const departmentExpander = expanderFactory.getExpander(Expanders.department);
        // assert
        departmentExpanderMock.verify(x => x.applyTo(It.Is(v=> v === Expanders.department)), Times.Exactly(1));
        expect(departmentExpander).toBe(departmentExpanderMock.object());
    });

    it("should get office expander when asking for office", () => {
        departmentExpanderMock.setup(x => x.applyTo(Expanders.office)).returns(false);
        officeExpanderMock.setup(x => x.applyTo(Expanders.office)).returns(true);
        // act on expand
        const officeExpander = expanderFactory.getExpander(Expanders.office);
        // assert
        officeExpanderMock.verify(x => x.applyTo(It.Is(v=> v === Expanders.office)), Times.Exactly(1));
        expect(officeExpander).toBe(officeExpanderMock.object());
    });

    it("should get superdepartment expander when asking for superdeparment", () => {
        departmentExpanderMock.setup(x => x.applyTo(Expanders.superdepartment)).returns(false);
        officeExpanderMock.setup(x => x.applyTo(Expanders.superdepartment)).returns(false);
        superdepartmentExpanderMock.setup(x => x.applyTo(Expanders.superdepartment)).returns(true);
        // act on expand
        const superdepartmentExpander = expanderFactory.getExpander(Expanders.superdepartment);
        // assert
        superdepartmentExpanderMock.verify(x => x.applyTo(It.Is(v=> v === Expanders.superdepartment)), Times.Exactly(1));
        expect(superdepartmentExpander).toBe(superdepartmentExpanderMock.object());
    });

    it("should get manager expander when asking for manager", () => {
        departmentExpanderMock.setup(x => x.applyTo(Expanders.manager)).returns(false);
        officeExpanderMock.setup(x => x.applyTo(Expanders.manager)).returns(false);
        superdepartmentExpanderMock.setup(x => x.applyTo(Expanders.manager)).returns(false);
        managerExpanderMock.setup(x => x.applyTo(Expanders.manager)).returns(true);
        // act on expand
        const managerExpander = expanderFactory.getExpander(Expanders.manager);
        // assert
        managerExpanderMock.verify(x => x.applyTo(It.Is(v=> v === Expanders.manager)), Times.Exactly(1));
        expect(managerExpander).toBe(managerExpanderMock.object());
    });
});