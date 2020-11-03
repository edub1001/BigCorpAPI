import { inject, injectable } from "inversify";
import { Department } from "../../models/department";
import { Employee } from "../../models/employee";
import { IDepartmentProvider } from "../../providers/interfaces";
import { PROVIDERS_TYPES } from "../../providers/types";
import { BaseExpander } from "./baseExpander";
import { Expanders } from "./expanders";
import { IDepartmentExpander, IExpander } from "./interfaces";

/**
 * Class to expand departments in an array of employees
 */
@injectable()
export class DepartmentExpander extends BaseExpander<Department> implements IDepartmentExpander, IExpander {
    /**
     * Inject an IDepartmentProvider
     * @param departmentProvider Department provider that will return department by id
     */
    constructor(@inject(PROVIDERS_TYPES.IDepartmentProvider) private departmentProvider: IDepartmentProvider) {
        super(departmentProvider);
    }

    /**
     * If expand type matches department
     * @param expander Check Expander compatibility
     */
    applyTo(expander: Expanders): boolean {
        return expander === Expanders.department;
    }

    /**
     * Expand departments in objects employee passed by param
     * @param employees An array of employees to expand departments
     * @returns An array of unique department objects expanded in the employees passed
     */
    expand(employees: Employee[]): Department[] {
        // safe check property department at compilation
        const propertyOf = <T>(name: keyof T) => name;
        return super.expand(employees, propertyOf<Employee>("department"));
    }
}