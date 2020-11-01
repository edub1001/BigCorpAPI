import { It, Mock, Times } from 'moq.ts';
import "reflect-metadata";
import { Employee } from "../../../src/models/employee";
import { Office } from "../../../src/models/office";
import { IOfficeProvider } from "../../../src/providers/interfaces";
import { Expanders } from "../../../src/services/expanders/expanders";
import { OfficeExpander } from "../../../src/services/expanders/officeExpander";

describe("Office expander", () => {
    let officeExpander : OfficeExpander;
    let officeProviderMock: Mock<IOfficeProvider>;
    let office : Office;
    let office2 : Office;
    let office3 : Office;
    let employees : Employee[];

    beforeEach(() => {
        officeProviderMock = new Mock<IOfficeProvider>();
        officeExpander = new OfficeExpander(officeProviderMock.object());
        // create office
        office = new Office(1);
        office2 = new Office(2);
        office3 = new Office(3);
        // reset employee
        employees = [];
    });

    it("should expand office in employee", () => {
        const employee = new Employee(1);
        employee.office = 1;
        employees.push(employee);
        employees.push({...employee});
        employees.push({...employee, office:3});
        officeProviderMock.setup(x => x.getById(1)).returns(office);
        officeProviderMock.setup(x => x.getById(3)).returns(office3);
        // act on expand
        const offices = officeExpander.expand(employees);
        // assert
        officeProviderMock.verify(x => x.getById(It.Is(v=> v === 1)), Times.Exactly(1));
        officeProviderMock.verify(x => x.getById(It.Is(v=> v === 2)), Times.Never());
        officeProviderMock.verify(x => x.getById(It.Is(v=> v === 3)), Times.Exactly(1));
        // avoid returning duplicated values
        expect(offices).toHaveSize(2);
        expect(offices[0]).toBe(office);
        expect(offices[1]).toBe(office3);
        expect(employees[0].office).toBe(office);
        expect(employees[1].office).toBe(office);
        expect(employees[2].office).toBe(office3);
    });

    it("should not expand already expanded", () => {
        const employee = new Employee(1);
        employee.office = {...office};
        employees.push(employee);
        officeProviderMock.setup(x => x.getById(It.IsAny())).returns(office);
        // act on expand
        const offices = officeExpander.expand(employees);
        // assert
        expect(offices[0]).toBe(employee.office);
        expect(employee.office).not.toBe(office);
    });

    it("should not expand office not found", () => {
        const employee = new Employee(1);
        employee.office = 1;
        employees.push(employee);
        officeProviderMock.setup(x => x.getById(It.IsAny())).returns(undefined);
        // act on expand
        const offices = officeExpander.expand(employees);
        // assert
        officeProviderMock.verify(x => x.getById(It.Is(v=> v === 1)), Times.Exactly(1));
        expect(offices).toHaveSize(0);
        expect(employee.office).toBe(1);
    });

    it("should handle office expansion", () => {
        expect(officeExpander.applyTo(Expanders.office)).toBeTrue();
    });
});