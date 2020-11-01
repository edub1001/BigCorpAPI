import { injectable, inject } from "inversify";
import { Employee } from "../../models/employee";
import { Office } from "../../models/office";
import { IOfficeProvider } from "../../providers/interfaces";
import { PROVIDERS_TYPES } from "../../providers/types";
import { Expanders } from "./expanders";
import { IExpander, IOfficeExpander } from "./interfaces";

/**
 * Class to expand offices in an array of employees
 */
@injectable()
export class OfficeExpander implements IOfficeExpander, IExpander {
    /**
     * Inject an IOfficeProvider
     * @param officeProvider Office provider that will return office by id
     */
    constructor(@inject(PROVIDERS_TYPES.IOfficeProvider) private officeProvider: IOfficeProvider) { }

    /**
     * If expand type matches office
     * @param expander Check Expander compatibility
     */
    applyTo(expander: Expanders): boolean {
        return expander === Expanders.office;
    }

    /**
     * Expand offices in objects employee passed by param
     * @param employees An array of employees to expand office
     * @returns An array of unique office objects expanded in the employees passed
     */
    expand(employees: Employee[]): Office[] {
        const offices = new Map<number, Office>();
        // set each department by looking into memory saved departments
        for (const employee of employees) {
            // check if it is a number
            if (typeof employee.office === "number") {
                // look up deparment linked to employee, and expand employee with department data
                if (offices.has(employee.office)) {
                    employee.office = offices.get(employee.office);
                }
                else {
                    // go to provider
                    const office = this.officeProvider.getById(employee.office);
                    if (office !== undefined) {
                        employee.office = office;
                        offices.set(office.id, office);
                    }
                    else {
                        // TODO: some logging, keep number
                    }
                }
            }
            // already an office object
            else {
                offices.set(employee.office.id, employee.office);
            }
        }
        // return all the offices
        return Array.from(offices.values());
    }
}