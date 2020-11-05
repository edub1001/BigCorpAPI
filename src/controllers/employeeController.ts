import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Employee } from "../models/employee";
import { Tree, TreeNode } from "../models/tree";
import { Expanders } from "../services/expanders/expanders";
import { IExpanderFactory } from "../services/expanders/interfaces";
import { EXPANDERS_TYPES } from "../services/expanders/types";
import { validateLimit } from "../services/limitValidator";
import { validateOffset } from "../services/offsetValidator";
import { IEmployeeProvider } from "../services/providers/interfaces";
import { PROVIDERS_TYPES } from "../services/providers/types";
import { BaseController, HttpStatusCode } from "./baseController";
import { ExpanderTreeValidator } from "../services/expanders/treeExpanderValidator";

@injectable()
export class EmployeeController extends BaseController {
    constructor(
        @inject(PROVIDERS_TYPES.IEmployeeProvider) private employeeProvider: IEmployeeProvider,
        @inject(EXPANDERS_TYPES.IExpanderFactory) private expanderFactory: IExpanderFactory,
        @inject(EXPANDERS_TYPES.ExpanderTreeValidator) private expanderTreeValidator: ExpanderTreeValidator) {
        super();
    }

    async getEmployees(limit: any = 100, offset: any = 0, expand: string[]): Promise<Employee[]> {
        this.wrapStatusCode(() =>validateLimit(limit), HttpStatusCode.BAD_REQUEST);
        this.wrapStatusCode(() => validateOffset(offset), HttpStatusCode.BAD_REQUEST);
        let expandTree: Tree<Expanders>;
        this.wrapStatusCode(() => expandTree = this.expanderTreeValidator.tryToParseToExpanderTree(expand), HttpStatusCode.BAD_REQUEST);
        const employees = await this.employeeProvider.getAll(limit, offset);
        // expand employees, if children is empty, expansion will return right away
        await this.expandEntity(employees, expandTree.getChildren());
        return employees;
    }

    async getEmployee(id: any, expand: string[]): Promise<Employee> {
        let expandTree: Tree<Expanders>;
        this.wrapStatusCode(() => expandTree =  this.expanderTreeValidator.tryToParseToExpanderTree(expand), HttpStatusCode.BAD_REQUEST);
        let employee: Employee;
        this.wrapStatusCode(async () => employee = await this.employeeProvider.getById(id), HttpStatusCode.NOT_FOUND);
        // expand employees, if children is empty, expansion will return right away
        await this.expandEntity(employee, expandTree.getChildren());
        return employee;
    }

    async expandEntity(entitiesToExpand: any, expandCategories: ReadonlyArray<TreeNode<Expanders>>) {
        for (const expandCategory of expandCategories) {
            // use factory that will handle the expansion
            const expander = this.expanderFactory.getExpander(expandCategory.getValue());
            const expandedEntities = await expander.expand(entitiesToExpand);
            this.expandEntity(expandedEntities, expandCategory.getChildren());
        }
    }
}