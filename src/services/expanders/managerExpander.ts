import { inject, injectable } from "inversify";
import { Employee } from "../../models/employee";
import { IEmployeeProvider } from "../providers/interfaces";
import { PROVIDERS_TYPES } from "../providers/types";
import { IExpander, IManagerExpander } from "./interfaces";
import { Expanders } from "./expanders";

/**
 * Class to expand managers in an array of employees. It might receive any as per IExpander firm providing property name is mantained
 */
@injectable()
export class ManagerExpander implements IManagerExpander, IExpander {
    /**
     * Inject an IEmployeeProvider
     * @param employeeProvider Employee provider that will return employee by ids
     */
    constructor(@inject(PROVIDERS_TYPES.IEmployeeProvider) private employeeProvider: IEmployeeProvider) { }

    /**
     * If expand type matches manager
     * @param expander Check Expander compatibility
     */
    applyTo(expander: Expanders): boolean {
        return expander === Expanders.manager;
    }

    /**
     * Return which expander we can expand from
     * @returns An array of expanders that we can expand from
     */
    expandFrom(): Expanders[] {
        return [Expanders.employee, Expanders.manager];
    }

    /**
     * Expand managers in objects employee passed by param
     * @param employees An array of employees to expand office
     * @returns An array of unique office objects expanded in the employees passed
     */
    async expand(employees: Employee[]): Promise<Employee[]> {
        const managers = new Map<number, Employee>();
        // get all the manager ids at once, avoid nulls or undefined, just numbers
        const managerIds = employees.map(e => e.manager as number).filter(mId => mId);
        const uniqueManagerIds: number[] = [...new Set(managerIds)] as number[];
        // get all this level managers in one call to server
        const managersRetrieved = await this.employeeProvider.getByIds(uniqueManagerIds) || [];
        // set each manager by looking into memory saved managers
        employees.forEach(employee => {
            let manager: Employee;
            // if it is not null/undefined and not a number, entity was already expanded
            if (employee.manager && typeof employee.manager !== "number") {
                manager = employee.manager;
            } else {
                // look up manager linked to employee, and expand employee with manager data
                manager = managersRetrieved.find(m => m.id === employee.manager);
            }
            // if null or undefined, keep as it is
            if (manager) {
                // assign existing or found
                employee.manager = manager;
                if (!managers.has(manager.id)) {
                    managers.set(manager.id, manager);
                }
            }
        });
        // return managers that were expanded to expand further if needed
        return  Array.from(managers.values());
    }
}