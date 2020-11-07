import { It, Mock } from "moq.ts";
import { Expanders } from "../../../../src/services/expanders/expanders";
import { ExpandersErrorCodes } from "../../../../src/services/expanders/expandersError";
import { IExpander, IExpanderFactory } from "../../../../src/services/expanders/interfaces";
import { ExpanderTreeValidator } from "../../../../src/services/expanders/treeExpanderValidator";
import { ServicesError } from "../../../../src/services/servicesError";

describe("Tree Expander Validator", () => {
    let treeExpanderValidator: ExpanderTreeValidator;
    let expanderMock: Mock<IExpander>;
    let expanderFactory: Mock<IExpanderFactory>;
    beforeEach(() => {
        expanderMock = new Mock<IExpander>();
        expanderMock.setup(x => x.expandFrom()).returns([Expanders.manager, Expanders.employee]);
        expanderFactory = new Mock<IExpanderFactory>();
        expanderFactory.setup(x => x.getExpander(It.IsAny())).returns(expanderMock.object());
        treeExpanderValidator = new ExpanderTreeValidator(expanderFactory.object());
    });

    it("should not allow values other than valid expanders", () => {
        try {
            treeExpanderValidator.tryToParseToExpanderTree(["invalidValue.manager", "department.anotherInvalid"], Expanders.employee);
            fail();
        }
        catch (error) {
            expect(error).toBeInstanceOf(ServicesError);
            expect(error.errorCode).toBe(ExpandersErrorCodes.EXPAND_ERROR);
            expect(error.errors).toHaveSize(2);
            expect(error.errors[0]).toBe("invalidValue is not allowed to be expanded");
            expect(error.errors[1]).toBe("anotherInvalid is not allowed to be expanded");
        }
    });

    it("should not allow to expand with no expander associated", () => {
        const employee = "employee";
        try {
            expanderFactory.setup(x => x.getExpander(It.IsAny())).returns(undefined);
            treeExpanderValidator.tryToParseToExpanderTree([employee], Expanders.employee);
            fail();
        }
        catch (error) {
            expect(error).toBeInstanceOf(ServicesError);
            expect(error.errorCode).toBe(ExpandersErrorCodes.EXPAND_ERROR);
            expect(error.errors).toHaveSize(1);
            expect(error.errors[0]).toBe(`${employee} is not allowed to be expanded`);
        }
    });

    it("should create tree for valid expander inputs", () => {
        expanderMock.setup(x => x.expandFrom()).returns([Expanders.office, Expanders.manager, Expanders.employee, Expanders.department, Expanders.superdepartment]);
        const tree = treeExpanderValidator.tryToParseToExpanderTree(["manager.office", "manager.department.superdepartment", "office"], Expanders.employee);
        // check generated tree
        expect(tree.getValue()).toBe(Expanders.employee);
        expect(tree.getChild(Expanders.office).getValue()).toBe(Expanders.office);
        const managerNode = tree.getChild(Expanders.manager);
        expect(managerNode.getValue()).toBe(Expanders.manager);
        expect(managerNode.getChild(Expanders.department).getValue()).toBe(Expanders.department);
        expect(managerNode.getChild(Expanders.office).getValue()).toBe(Expanders.office);
        expect(managerNode.getChild(Expanders.department).getChild(Expanders.superdepartment).getValue()).toBe(Expanders.superdepartment);
    });

    it("should allow to expand manager in employee root or manager", () => {
        const tree = treeExpanderValidator.tryToParseToExpanderTree(["manager", "manager.manager", "manager.manager.manager"], Expanders.employee);

        expect(tree.size()).toBe(4);
        expect(tree.getValue()).toBe(Expanders.employee);
        expect(tree.getChild(Expanders.manager)).not.toBeUndefined();
        expect(tree.getChild(Expanders.manager).getChild(Expanders.manager)).not.toBeUndefined();
        expect(tree.getChild(Expanders.manager).getChild(Expanders.manager).getChild(Expanders.manager)).not.toBeUndefined();
    });

    it("should allow to expand office in employee root or manager", () => {
        const tree = treeExpanderValidator.tryToParseToExpanderTree(["office", "manager.office", "manager.manager.office"], Expanders.employee);

        expect(tree.size()).toBe(4);
        expect(tree.getValue()).toBe(Expanders.employee);
        expect(tree.getChild(Expanders.manager)).not.toBeUndefined();
        expect(tree.getChild(Expanders.office)).not.toBeUndefined();
        expect(tree.getChild(Expanders.manager).getChild(Expanders.office)).not.toBeUndefined();
        expect(tree.getChild(Expanders.manager).getChild(Expanders.manager).getChild(Expanders.office)).not.toBeUndefined();
    });

    it("should allow to expand department in employee root or manager", () => {
        const tree = treeExpanderValidator.tryToParseToExpanderTree(["department", "manager.department", "manager.manager.department"], Expanders.employee);

        expect(tree.size()).toBe(4);
        expect(tree.getValue()).toBe(Expanders.employee);
        expect(tree.getChild(Expanders.manager)).not.toBeUndefined();
        expect(tree.getChild(Expanders.department)).not.toBeUndefined();
        expect(tree.getChild(Expanders.manager).getChild(Expanders.department)).not.toBeUndefined();
        expect(tree.getChild(Expanders.manager).getChild(Expanders.manager).getChild(Expanders.department)).not.toBeUndefined();
    });

    it("should allow to expand superdepartment in department root or superdepartment", () => {
        expanderMock.setup(x => x.expandFrom()).returns([Expanders.department, Expanders.superdepartment]);
        expanderFactory.setup(x => x.getExpander(It.IsAny())).returns(expanderMock.object());
        const tree = treeExpanderValidator.tryToParseToExpanderTree(["superdepartment", "superdepartment.superdepartment", "superdepartment.superdepartment.superdepartment"], Expanders.department);

        expect(tree.size()).toBe(4);
        expect(tree.getValue()).toBe(Expanders.department);
        expect(tree.getChild(Expanders.superdepartment)).not.toBeUndefined();
        expect(tree.getChild(Expanders.superdepartment).getChild(Expanders.superdepartment)).not.toBeUndefined();
        expect(tree.getChild(Expanders.superdepartment).getChild(Expanders.superdepartment).getChild(Expanders.superdepartment)).not.toBeUndefined();
    });

    it("should not allow to expand manager in other expander different from employee root or manager", () => {
        const managerExpanderMock = new Mock<IExpander>();
        // set up specific expander for manager
        managerExpanderMock.setup(x => x.expandFrom()).returns([Expanders.manager, Expanders.employee]);
        // set up an expander from everything
        expanderMock.setup(x => x.expandFrom()).returns([Expanders.manager, Expanders.employee, Expanders.department, Expanders.office, Expanders.superdepartment]);
        expanderFactory.setup(x => x.getExpander(It.IsAny())).returns(expanderMock.object());
        expanderFactory.setup(x => x.getExpander(Expanders.manager)).returns(managerExpanderMock.object());
        try {
            treeExpanderValidator.tryToParseToExpanderTree(["department.manager", "department.superdepartment.manager", "office.manager"], Expanders.employee);
            fail();
        }
        catch (error) {
            expect(error).toBeInstanceOf(ServicesError);
            expect(error.errorCode).toBe(ExpandersErrorCodes.EXPAND_ERROR);
            expect(error.errors).toHaveSize(3);
            expect(error.errors[0]).toBe("manager cannot be expanded from department");
            expect(error.errors[1]).toBe("manager cannot be expanded from superdepartment");
            expect(error.errors[2]).toBe("manager cannot be expanded from office");
        }
    });
});