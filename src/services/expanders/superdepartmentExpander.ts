import { injectable, inject } from "inversify";
import { Department } from "../../models/department";
import { IDepartmentProvider } from "../../providers/interfaces";
import { PROVIDERS_TYPES } from "../../providers/types";
import { Expanders } from "./expanders";
import { IExpander, ISuperdepartmentExpander } from "./interfaces";

@injectable()
export class SuperdepartmentExpander implements ISuperdepartmentExpander, IExpander {
    constructor(@inject(PROVIDERS_TYPES.IDepartmentProvider) private departmentProvider:IDepartmentProvider) {}

    applyTo(expander: Expanders): boolean {
        return expander === Expanders.superdepartment;
    }

    expand(employees: Department[]): Department[] {
        throw new Error("Method not implemented.");
    }
}