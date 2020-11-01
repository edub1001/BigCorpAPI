import { inject, injectable } from "inversify";
import { Employee } from "../../models/employee";
import { IEmployeeProvider } from "../../providers/interfaces";
import { PROVIDERS_TYPES } from "../../providers/types";
import { IExpander, IManagerExpander } from "./interfaces";
import { Expanders } from "./expanders";

@injectable()
export class ManagerExpander implements IManagerExpander, IExpander {
    constructor(@inject(PROVIDERS_TYPES.IEmployeeProvider) private employeeProvider:IEmployeeProvider) {}

    applyTo(expander: Expanders): boolean {
        return expander === Expanders.manager;
    }

    expand(employees: Employee[]) : Employee[] {
        const managers : Employee[] = [];
        // get all the manager ids at once
        const managerIds = employees.map(e => e.manager).filter(mId => mId !== undefined);
        const uniqueManagerIds : number[] = [...new Set(managerIds)] as number[];
        // get all this level managers in one call to server
        const managersRetrieved = this.employeeProvider.getById(uniqueManagerIds);
        // set each manager by looking into memory saved managers
        employees.forEach(employee =>
        {
            // look up manager linked to employee, and expand employee with manager data
            const manager = managersRetrieved.find(m => m.id === employee.manager);
            employee.manager = manager;
            if (manager !== undefined)
            {
                managers.push(manager);
            }
        });
        // return managers that were expanded to expand further if needed
        return managers;
    }
}