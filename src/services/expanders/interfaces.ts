import { Department } from "../../models/department";
import { Employee } from "../../models/employee";
import { Office } from "../../models/office";
import { Expanders } from "./expanders";

/**
 * Basic expander interface. Expand object properties into other objects using its value as id
 */
export interface IExpander {
    /**
     * Expand an array of entities using a property depending on the expander
     * @param itemsToExpand The item/s to expand using a property
     * @returns All the expanded entities fetched appended to the property
     */
    expand(itemsToExpand : any) : any;

    /**
     * If expand type matches the current expander
     * @param expander Check Expander compatibility
     * @returns True if the expander supports the entity to be expanded
     */
    applyTo(expander:Expanders) : boolean;

    /**
     * Get which expansions can precede this expander
     * @returns Expanders that can be piped to this one
     */
    expandFrom() : Expanders[];
}

/**
 * Return an expander that matches current expansion
 */
export interface IExpanderFactory {
    getExpander(expand: Expanders) : IExpander
}

/**
 * Expander for managers converting property manager into an expanded employee acting as manager
 */
export interface IManagerExpander extends IExpander {
    expand(employees: Employee[]) : Promise<Employee[]>;
}

/**
 * Expander for department converting property department into an expanded department object
 */
export interface IDepartmentExpander extends IExpander {
    expand(employees: Employee[]) : Promise<Department[]>;
}

/**
 * Expander for office converting property office into an expanded office object
 */
export interface IOfficeExpander extends IExpander {
    expand(employees: Employee[]) : Promise<Office[]>;
}

/**
 * Expander for superdepartment converting property superdepartment into an expanded department object
 */
export interface ISuperdepartmentExpander extends IExpander {
    expand(employees: Department[]) : Promise<Department[]>;
}