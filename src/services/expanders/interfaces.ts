import { Department } from "../../models/department";
import { Employee } from "../../models/employee";
import { Office } from "../../models/office";
import { Expanders } from "./expanders";

export interface IExpander {
    expand(itemsToExpand : any) : any;
    applyTo(expander:Expanders) : boolean;
    expandFrom() : Expanders[];
}

export interface IExpanderFactory {
    getExpander(expand: Expanders) : IExpander
}


export interface IManagerExpander extends IExpander {
    expand(employees: Employee[]) : Promise<Employee[]>;
}

export interface IDepartmentExpander extends IExpander {
    expand(employees: Employee[]) : Promise<Department[]>;
}

export interface IOfficeExpander extends IExpander {
    expand(employees: Employee[]) : Promise<Office[]>;
}

export interface ISuperdepartmentExpander extends IExpander {
    expand(employees: Department[]) : Promise<Department[]>;
}