import { BaseEntity } from "../../models/baseEntity";
import { Department } from "../../models/department";
import { Employee } from "../../models/employee";
import { Office } from "../../models/office";

/**
 * Base provider defining basic functionality to retrieve base entity models
 */
export interface IBaseProvider<T extends BaseEntity> {
    /**
     * Return a base entity object of type T by the given id
     * @param id Id of the base entity to look for.
     * @returns The promised object or undefined if not found
     */
    getById(id:number) : Promise<T>;

    /**
     * Return base entity object of type T considering the limit and offset passed for pagination
     * @param limit The max number of entites to be returned
     * @param offset The offset used in pagination to start from
     * @returns The promised object array or empty otherwise
     */
    getAll(limit:number, offset:number) : Promise<T[]>;
}

/**
 * Provider that will return offices model
 */
export interface IOfficeProvider extends IBaseProvider<Office> {
}

/**
 * Provider that will return departments model
 */
export interface IDepartmentProvider extends IBaseProvider<Department> {
}

/**
 * Provider that will return employees model
 */
export interface IEmployeeProvider  extends IBaseProvider<Employee> {
    getByIds(ids: number[]) : Promise<Employee[]>;
}