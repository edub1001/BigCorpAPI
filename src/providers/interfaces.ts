import { BaseEntity } from "../models/baseEntity";
import { Department } from "../models/department";
import { Employee } from "../models/employee";
import { Office } from "../models/office";

export interface IBaseProvider<T extends BaseEntity> {
    getById(id:number) : T;
}

export interface IOfficeProvider extends IBaseProvider<Office> {
}

export interface IDepartmentProvider extends IBaseProvider<Department> {
}

export interface IEmployeeProvider {
    getById(ids:number[]) : Promise<Employee[]>;
    getAll(limit:number, offset:number) : Promise<Employee[]>;
}