import { It, Mock, Times } from 'moq.ts';
import "reflect-metadata";
import { Employee } from "../../../../src/models/employee";
import { Expanders } from "../../../../src/services/expanders/expanders";
import { IManagerExpander } from '../../../../src/services/expanders/interfaces';
import { ManagerExpander } from "../../../../src/services/expanders/managerExpander";
import { IEmployeeProvider } from "../../../../src/services/providers/interfaces";
import { arraysEqual } from '../../helper';

describe("Manager expander", () => {
    let managerExpander: IManagerExpander;
    let employeeProviderMock: Mock<IEmployeeProvider>;
    let employees: Employee[];

    beforeEach(() => {
        employeeProviderMock = new Mock<IEmployeeProvider>();
        managerExpander = new ManagerExpander(employeeProviderMock.object());
        // create employees
        employees = [];
        employees.push(new Employee(1));
        employees.push(new Employee(2));
        employees.push(new Employee(3));
        employeeProviderMock.setup(x => x.getByIds(It.Is(v => arraysEqual(v as number[], [1, 3])))).returns(Promise.resolve([employees[0], employees[2]]));
        employeeProviderMock.setup(x => x.getByIds(It.Is(v => arraysEqual(v as number[], [1, 2, 3])))).returns(Promise.resolve(employees));
    });

    it("should handle manager expansion", () => {
        expect(managerExpander.applyTo(Expanders.manager)).toBeTrue();
    });

    it("should expand from", () => {
        const expandFrom = managerExpander.expandFrom();
        expect(expandFrom).toContain(Expanders.employee);
        expect(expandFrom).toContain(Expanders.manager);
    });

    it("should expand entity in entities to expand", async () => {
        const entitiesToExpand = [];
        const entity = { manager: employees[0].id };
        // add 2 entities with same value in property to expand
        entitiesToExpand.push(entity);
        entitiesToExpand.push({ ...entity });
        entitiesToExpand.push({ ...entity, manager: employees[2].id });
        // act on expand
        const entitiesExpandedReturned = await managerExpander.expand(entitiesToExpand);
        // assert
        employeeProviderMock.verify(x => x.getByIds(It.Is(v => arraysEqual(v as number[],[employees[0].id, employees[2].id]))), Times.Exactly(1));
        // avoid returning duplicated values
        expect(entitiesExpandedReturned).toHaveSize(2);
        expect(entitiesExpandedReturned[0]).toBe(employees[0]);
        expect(entitiesExpandedReturned[1]).toBe(employees[2]);
        // entities should have been expanded to the proper one, first and second to the same entity
        expect(entitiesToExpand[0].manager).toBe(employees[0]);
        expect(entitiesToExpand[1].manager).toBe(employees[0]);
        expect(entitiesToExpand[2].manager).toBe(employees[2]);
    });

    it("should not expand already expanded property", async () => {
        // clone and assign expanded entity that will be returned by provider
        const entity = { manager: { ...employees[0] } };
        const entitiesToExpand = [];
        entitiesToExpand.push(entity);
        employeeProviderMock.setup(x => x.getByIds(It.IsAny())).returns(Promise.resolve([employees[0]]));
        // act on expand
        const entitiesExpandedReturned = await managerExpander.expand(entitiesToExpand);
        // assert, shoudl keep object already expanded instead of the one returned by provider
        expect(entitiesExpandedReturned[0]).toBe(entity.manager);
        expect(entity.manager).not.toBe(employees[0]);
    });

    it("should not expand entity not found", async () => {
        const entity = { manager: employees[0].id };
        const entitiesToExpand = [];
        entitiesToExpand.push(entity);
        employeeProviderMock.setup(x => x.getByIds(It.IsAny())).returns(Promise.resolve([]));
        // act on expand
        const entitiesExpandedReturned = await managerExpander.expand(entitiesToExpand);
        // assert
        employeeProviderMock.verify(x => x.getByIds(It.Is(v => arraysEqual(v as number[], [employees[0].id]))), Times.Exactly(1));
        // not expanded, collection returned will be empty
        expect(entitiesExpandedReturned).toHaveSize(0);
        // no expansion, keep id
        expect(entity.manager).toBe(employees[0].id);
    });

    it("should not expand entity with undefined expandable", async () => {
        const entity = { manager: undefined };
        const entitiesToExpand = [];
        entitiesToExpand.push(entity);
        employeeProviderMock.setup(x => x.getByIds([])).returns(Promise.resolve([]));
        // act on expand
        const entitiesExpandedReturned = await managerExpander.expand(entitiesToExpand);
        // not expanded, collection returned will be empty
        expect(entitiesExpandedReturned).toHaveSize(0);
        // no expansion, keep undefined
        expect(entity.manager).toBeUndefined();
    });

    it("should not expand entity with null expandable", async () => {
        const entity = { manager: null };
        const entitiesToExpand = [];
        entitiesToExpand.push(entity);
        employeeProviderMock.setup(x => x.getByIds([])).returns(Promise.resolve([]));
        // act on expand
        const entitiesExpandedReturned = await managerExpander.expand(entitiesToExpand);
        // not expanded, collection returned will be empty
        expect(entitiesExpandedReturned).toHaveSize(0);
        // no expansion, keep undefined
        expect(entity.manager).toBeNull();
    });
});