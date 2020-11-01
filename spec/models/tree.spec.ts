import { Tree } from "../../src/models/tree"

describe("Tree", () => {
    let tree: Tree<string>;

    beforeEach(() => {
        tree = new Tree<string>("employee");
    });

    it("should have root value by default", () => {
        expect(tree.getValue()).toBe("employee");
    });

    it("should have size as 1 by default", () => {
        expect(tree.size()).toBe(1);
    });

    it("should have empty children by default", () => {
        expect(tree.getChildren().length).toBe(0);
    });

    it("should not be able to add same value twice in the level", () => {
        tree.addChild("manager");
        tree.addChild("manager");
        expect(tree.getChildren().length).toBe(1);
    });
});

describe("Tree when adding more levels", () => {
    let tree: Tree<string>;

    beforeAll(() => {
        /*
            employee --> manager    --> department      --> superdepartment
                                        office
                        office
                        department  --> superdepartment --> superdepartment --> superdepartment
        */
        tree = new Tree<string>("employee");
        const managerNode = tree.addChild("manager");
        managerNode.addChild("department").addChild("superdepartment");
        managerNode.addChild("office");
        tree.addChild("office");
        tree.addChild("department").addChild("superdepartment").addChild("superdepartment").addChild("superdepartment");
    });

    it("should have size as 5", () => {
        expect(tree.size()).toBe(5);
    });

    it("should have root employee", () => {
        expect(tree.getValue()).toBe("employee");
    });

    it("should have first level children as 3", () => {
        expect(tree.getChildren().length).toBe(3);
    });

    it("should have first level children as manager, office, department", () => {
        expect(tree.getChildren().map(c => c.getValue())).toEqual(["manager","office","department"]);
    });

    it("should have first level children whose parent is root", () => {
        tree.getChildren().forEach(c =>{
            expect(c.getParent()).toBeInstanceOf(Tree);
            expect(c.getParent().getValue()).toBe("employee");
        });
    });

    it("should get children by value", () => {
        expect(tree.getChild("manager")).toEqual(tree.getChildren()[0]);
        expect(tree.getChild("office")).toEqual(tree.getChildren()[1]);
        expect(tree.getChild("department")).toEqual(tree.getChildren()[2]);
    });

    it("should have first level children as manager, office, department", () => {
        expect(tree.getChildren().map(c => c.getValue())).toEqual(["manager","office","department"]);
    });

    it("should have first level children whose parent is root", () => {
        tree.getChildren().forEach(c =>{
            expect(c.getParent()).toBeInstanceOf(Tree);
            expect(c.getParent().getValue()).toBe("employee");
        });
    });

    it("should have second level children for manager as 2", () => {
        expect(tree.getChild("manager").getChildren().length).toBe(2);
    });

    it("should have second level children for manager as department, office", () => {
        expect(tree.getChild("manager").getChildren().map(c => c.getValue())).toEqual(["department","office"]);
    });

    it("should have second level children whose parent is manager", () => {
        tree.getChild("manager").getChildren().forEach(c =>{
            expect(c.getParent().getValue()).toBe("manager");
        });
    });

    it("should have third level children for manager and deparment as 1", () => {
        expect(tree.getChild("manager").getChild("department").getChildren().length).toBe(1);
    });

    it("should have third level children for for manager and deparment as superdepartment", () => {
        expect(tree.getChild("manager").getChild("department").getChildren().map(c => c.getValue())).toEqual(["superdepartment"]);
    });
});