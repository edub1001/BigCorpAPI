import { inject, injectable } from "inversify";
import { Department } from "../../models/department";
import { IDepartmentProvider } from "../providers/interfaces";
import { PROVIDERS_TYPES } from "../providers/types";
import { BaseExpander } from "./baseExpander";
import { Expanders } from "./expanders";
import { IExpander, ISuperdepartmentExpander } from "./interfaces";

/**
 * Class to expand superdepartments in an array of departments. It might receive any as per IExpander firm providing property name is mantained
 */
@injectable()
export class SuperdepartmentExpander extends BaseExpander<Department> implements ISuperdepartmentExpander, IExpander {
    /**
     * Inject an IDepartmentProvider
     * @param departmentProvider Department provider that will return department by id
     */
    constructor(@inject(PROVIDERS_TYPES.IDepartmentProvider) private departmentProvider: IDepartmentProvider) {
        super(departmentProvider);
    }

    /**
     * If expand type matches superdepartment
     * @param expander Check Expander compatibility
     */
    applyTo(expander: Expanders): boolean {
        return expander === Expanders.superdepartment;
    }

    /**
     * Return which expander we can expand from
     * @returns An array of expanders that we can expand from
     */
    expandFrom(): Expanders[] {
        // use for validation but it can help in the future to expand different field names into departments
        return [Expanders.department, Expanders.superdepartment];
    }

    /**
     * Expand department in objects departments passed by param
     * @param departments An array of departments to expand department by superdepartment
     * @returns An array of unique department objects expanded in the departments passed
     */
    async expand(departments: Department[]): Promise<Department[]> {
        // safe check property superdepartment at compilation, it is the property we want to expand
        const propertyOf = <T>(name: keyof T) => name;
        return await super.expand(departments, propertyOf<Department>("superdepartment"));
    }
}