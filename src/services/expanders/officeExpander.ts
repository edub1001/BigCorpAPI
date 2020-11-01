import { injectable, inject } from "inversify";
import { Employee } from "../../models/employee";
import { Office } from "../../models/office";
import { IOfficeProvider } from "../../providers/interfaces";
import { PROVIDERS_TYPES } from "../../providers/types";
import { Expanders } from "./expanders";
import { IExpander, IOfficeExpander } from "./interfaces";

@injectable()
export class OfficeExpander implements IOfficeExpander, IExpander {
    constructor(@inject(PROVIDERS_TYPES.IOfficeProvider) private officeProvider:IOfficeProvider) {}

    applyTo(expander: Expanders): boolean {
        return expander === Expanders.office;
    }

    expand(employees: Employee[]): Office[] {
        throw new Error("Method not implemented.");
    }
}