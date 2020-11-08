import { It, Mock, Times } from 'moq.ts';
import "reflect-metadata";
import { EmployeeController } from "../../../src/controllers/employeeController";
import { Employee } from '../../../src/models/employee';
import { Tree } from '../../../src/models/tree';
import { Expanders } from '../../../src/services/expanders/expanders';
import { IExpander, IExpanderFactory } from '../../../src/services/expanders/interfaces';
import { ExpanderTreeValidator } from '../../../src/services/expanders/treeExpanderValidator';
import { IEmployeeProvider } from "../../../src/services/providers/interfaces";
import { arraysEqual } from '../helper';

describe("Employee controller", () => {
    let controller: EmployeeController;
    let providerMock: Mock<IEmployeeProvider>;
    let expanderFactoryMock: Mock<IExpanderFactory>;
    let expanderMock: Mock<IExpander>;
    let expanderTreeValidator: Mock<ExpanderTreeValidator>;
    let employees: Employee[];
    let expansionTree: Tree<Expanders>;

    beforeEach(() => {
        expansionTree = new Tree<Expanders>(Expanders.employee);
        providerMock = new Mock<IEmployeeProvider>();
        expanderFactoryMock = new Mock<IExpanderFactory>();
        expanderMock = new Mock<IExpander>();
        expanderTreeValidator = new Mock<ExpanderTreeValidator>();
        controller = new EmployeeController(providerMock.object(), expanderFactoryMock.object(), expanderTreeValidator.object());
        expanderFactoryMock.setup(x => x.getExpander(It.IsAny())).returns(expanderMock.object());
        expanderTreeValidator.setup(x => x.tryToParseToExpanderTree(It.IsAny(), It.IsAny())).returns(expansionTree);
        // create employees
        employees = [];
        employees.push(new Employee(1));
        employees.push(new Employee(2));
        employees.push(new Employee(3));
    });

    it("should expand several levels", async () => {
        employees[0].manager = 2;
        employees[1].manager = 3;
        providerMock.setup(x => x.getById(employees[0].id)).returns(Promise.resolve(employees[0]));
        // set up expansion tree
        expansionTree.addChild(Expanders.manager).addChild(Expanders.manager);
        expanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as Employee[],[employees[0]])))).returns([employees[1]]);
        expanderMock.setup(x => x.expand(It.Is(v => arraysEqual(v as Employee[],[employees[1]])))).returns([employees[2]]);
        // act on expand
        const entitiesExpandedReturned = await controller.getEntity(1, ["manager.manager"]);
        // assert
        expanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as Employee[],[employees[0]]))), Times.Exactly(1));
        expanderMock.verify(x => x.expand(It.Is(v => arraysEqual(v as Employee[],[employees[1]]))), Times.Exactly(1));
        expect(entitiesExpandedReturned).toBe(employees[0]);
    });
});