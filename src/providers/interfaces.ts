import { Department } from "../models/department";
import { Employee } from "../models/employee";
import { Office } from "../models/office";

export interface IOfficeProvider {
    getById(id:number) : Office;
}

export interface IEmployeeProvider {
    getById(ids:number[]) : Employee[];
    getAll(limit:number, offset:number) : Employee[];
}

export interface IDepartmentProvider {
    getById(id:number) : Department;
}