import { inject, injectable } from "inversify";
import { Employee } from "../../models/employee";
import { Office } from "../../models/office";
import { IOfficeProvider } from "../providers/interfaces";
import { PROVIDERS_TYPES } from "../providers/types";
import { BaseExpander } from "./baseExpander";
import { Expanders } from "./expanders";
import { IExpander, IOfficeExpander } from "./interfaces";

/**
 * Class to expand offices in an array of employees. It might receive any as per IExpander firm providing property name is mantained
 */
@injectable()
export class OfficeExpander extends BaseExpander<Office> implements IOfficeExpander, IExpander {
    /**
     * Inject an IOfficeProvider
     * @param officeProvider Office provider that will return office by id
     */
    constructor(@inject(PROVIDERS_TYPES.IOfficeProvider) private officeProvider: IOfficeProvider) {
        super(officeProvider);
    }

    /**
     * If expand type matches office
     * @param expander Check Expander compatibility
     */
    applyTo(expander: Expanders): boolean {
        return expander === Expanders.office;
    }

    /**
     * Return which expander we can expand from
     * @returns An array of expanders that we can expand from
     */
    expandFrom(): Expanders[] {
        return [Expanders.employee, Expanders.manager];
    }

    /**
     * Expand offices in objects employee passed by param
     * @param employees An array of employees to expand office
     * @returns An array of unique office objects expanded in the employees passed
     */
    async expand(employees: Employee[]): Promise<Office[]> {
        // safe check property office at compilation
        const propertyOf = <T>(name: keyof T) => name;
        return await super.expand(employees, propertyOf<Employee>("office"));
    }
}