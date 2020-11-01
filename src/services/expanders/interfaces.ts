import { Department } from "../../models/department";
import { Employee } from "../../models/employee";
import { Office } from "../../models/office";
import { Expanders } from "./expanders";

export interface IExpander {
    expand(itemsToExpand : any) : any;
    applyTo(expander:Expanders) : boolean;
}

export interface IExpanderFactory {
    getExpander(expand: Expanders) : IExpander
}


export interface IManagerExpander {
    expand(employees: Employee[]) : Employee[];
}

export interface IDepartmentExpander {
    expand(employees: Employee[]) : Department[];
}

export interface IOfficeExpander {
    expand(employees: Employee[]) : Office[];
}

export interface ISuperdepartmentExpander {
    expand(employees: Department[]) : Department[];
}