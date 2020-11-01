import { Expanders } from "../../../src/services/expanders/expanders";
import {tryToParseToExpanderTree} from "../../../src/services/expanders/treeExpanderValidator"

describe("Tree Expander Validator", () => {
    it("should not allow values other than valid expanders", () => {
        const errors:string[] = [];
        tryToParseToExpanderTree(["invalidValue.manager", "department.anotherInvalid"], errors)

        expect(errors).toHaveSize(2);
        expect(errors[0]).toBe("invalidValue is not allowed to be expanded");
        expect(errors[1]).toBe("anotherInvalid is not allowed to be expanded");
    });

    it("should not allow unsupported expanders", () => {
        const errors:string[] = [];
        tryToParseToExpanderTree([Expanders.employee.toString()], errors)

        expect(errors).toHaveSize(1);
        expect(errors[0]).toBe(`${Expanders.employee.toString()} is not allowed to be expanded}`);
    });

    it("should create tree for valid expander inputs", () => {
        const errors:string[] = [];
        const tree = tryToParseToExpanderTree(["manager.office", "manager.department.superdepartment", "office"], errors)

        expect(errors).toHaveSize(0);
        expect(tree.getValue()).toBe(Expanders.employee);
        expect(tree.getChild(Expanders.office).getValue()).toBe(Expanders.office);
        const managerNode = tree.getChild(Expanders.manager);
        expect(managerNode.getValue()).toBe(Expanders.manager);
        expect(managerNode.getChild(Expanders.department).getValue()).toBe(Expanders.department);
        expect(managerNode.getChild(Expanders.office).getValue()).toBe(Expanders.office);
        expect(managerNode.getChild(Expanders.department).getChild(Expanders.superdepartment).getValue()).toBe(Expanders.superdepartment);
    });

    it("should allow to expand manager in employee root or manager", () => {
        const errors:string[] = [];
        const tree = tryToParseToExpanderTree(["manager", "manager.manager", "manager.manager.manager"], errors)

        expect(errors).toHaveSize(0);
    });

    it("should not allow to expand manager in other expander different from employee root or manager", () => {
        const errors:string[] = [];
        tryToParseToExpanderTree(["department.manager", "department.superdepartment.manager", "office.manager"], errors)

        expect(errors).toHaveSize(3);
        expect(errors[0]).toBe("Manager can only be expanded on managers or employees, not on department as in department.manager");
        expect(errors[1]).toBe("Manager can only be expanded on managers or employees, not on superdepartment as in department.superdepartment.manager");
        expect(errors[2]).toBe("Manager can only be expanded on managers or employees, not on office as in office.manager");
    });
});