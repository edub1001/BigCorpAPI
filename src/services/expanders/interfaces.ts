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
    expand(employees: Employee[]) : Promise<Employee[]>;
}

export interface IDepartmentExpander {
    expand(employees: Employee[]) : Promise<Department[]>;
}

export interface IOfficeExpander {
    expand(employees: Employee[]) : Promise<Office[]>;
}

export interface ISuperdepartmentExpander {
    expand(employees: Department[]) : Promise<Department[]>;
}