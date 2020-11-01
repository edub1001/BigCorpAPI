import { TreeNode } from "../models/tree"
import { tryToParseToExpanderTree } from "../services/expanders/treeExpanderValidator";
import { Expanders } from "../services/expanders/expanders";
import { ParamError } from "./paramError";
import { inject, injectable } from "inversify";
import { PROVIDERS_TYPES } from "../providers/types";
import { EXPANDERS_TYPES } from "../services/expanders/types";
import { IEmployeeProvider } from "../providers/interfaces";
import { IExpanderFactory } from "../services/expanders/interfaces";
import "reflect-metadata";

@injectable()
export class EmployeeController {
    constructor(
        @inject(PROVIDERS_TYPES.IEmployeeProvider) private employeeProvider: IEmployeeProvider,
        @inject(EXPANDERS_TYPES.IExpanderFactory) private expanderFactory: IExpanderFactory) {
    }

    getEmployees(limit: any = 100, offset: any = 0, expand: string[]) {
        if (limit === isNaN || limit < 1 || limit > 1000) {
            throw new ParamError("Limit should be greater than 0 and less or equal to 1000");
        }
        if (offset === isNaN && offset < 0) {
            throw new ParamError("Offset should be greater than 0 and less or equal to 1000");
        }
        const errors: string[] = [];
        const expandTree = tryToParseToExpanderTree(expand, errors);
        if (errors.length > 0) {
            throw new ParamError(...errors);
        }
        const employees = this.employeeProvider.getAll(limit, offset);
        // if expansion needed, let's go with it
        if (expandTree.size() > 1) {
            this.expandEntity(employees, expandTree.getChildren());
        }
        return employees;
    }

    getEmployee(id: any, expand: string[]) {
        const errors = [];
        const expandTree = tryToParseToExpanderTree(expand, errors);
        if (errors.length > 0) {
            throw new ParamError(...errors);
        }
        const employees = this.employeeProvider.getById([id]);
        // if expansion needed, let's go with it
        if (expandTree.size() > 1) {
            this.expandEntity(employees, expandTree.getChildren());
        }
        return employees[0];
    }

    expandEntity(entitiesToExpand: any, expandCategories: TreeNode<Expanders>[]): void {
        for (const expandCategory of expandCategories) {
            // use factory that will handle the expansion
            const expander = this.expanderFactory.getExpander(expandCategory.getValue());
            const expandedEntities = expander.expand(entitiesToExpand);
            // expand returned entities further with other categories
            this.expandEntity(expandedEntities, expandCategory.getChildren());
        }
    }
}