import { injectable, inject } from "inversify";
import { Department } from "../../models/department";
import { Employee } from "../../models/employee";
import { IDepartmentProvider, IEmployeeProvider } from "../../providers/interfaces";
import { PROVIDERS_TYPES } from "../../providers/types";
import { Expanders } from "./expanders";
import { IDepartmentExpander, IExpander } from "./interfaces";

@injectable()
export class DepartmentExpander implements IDepartmentExpander, IExpander {
    constructor(@inject(PROVIDERS_TYPES.IDepartmentProvider) private departmentProvider:IDepartmentProvider) {}

    applyTo(expander: Expanders): boolean {
        return expander === Expanders.department;
    }

    expand(employees: Employee[]): Department[] {
        throw new Error("Method not implemented.");
    }
}