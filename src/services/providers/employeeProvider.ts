import axios from 'axios';
import { injectable } from "inversify";
import { config } from 'node-config-ts';
import qs from 'qs';
import { Employee } from "../../models/employee";
import { ServicesError } from '../servicesError';
import { IEmployeeProvider } from "./interfaces";
import { ProvidersErrorCodes } from './providersError';

/**
 * Provider that will return employees model from external API
 */
@injectable()
export class EmployeeProvider implements IEmployeeProvider {
    constructor() {
        this.validateConfig();
    }

    /**
     * Return an employee object that will be retrieved from external source
     * @param id Id of the employee to look for.
     * @returns The promised employee or undefined if not found
     */
    async getById(id: number): Promise<Employee> {
        const employees = await this.getByIds([id]);
        if (!employees || employees.length === 0) {
            return undefined;
        }
        return employees[0];
    }

    /**
     * Return an employee array that will be retrieved from external source considering the ids passed
     * @param ids Array of ids matching employees to be returned
     * @returns The promised employee array or empty otherwise
     */
    async getByIds(ids: number[]): Promise<Employee[]> {
        // short-circuit if ids are not valid and return empty
        if (!ids || ids.length === 0) {
            return [];
        }
        try {
            // go to external service
            const response = await axios.get(config.employeesUrl, {
                params: {
                    id: ids
                },
                // use qs library to concatenate ids in expanded way. id=1&id=2
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: 'repeat' })
                }
            });
            // return sort of employee (matching properties) array object or empty in case it is null or undefined
            return response.data || [];
        } catch (error) {
            // error happened, just in case it was called with single id, a 404 is expected and we can returned an empty array
            if (error.response && error.response.status === 404) {
                return [];
            }
            // unexpected error in response, wrap exception inside a service to be handled later
            throw new ServicesError(ProvidersErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE, error);
        }
    }

    /**
     * Return an employee array that will be retrieved from external source considering the limit and offset passed
     * @param limit The max number of employees to be returned
     * @param offset The offset used in pagination to start from
     * @returns The promised employee array or empty otherwise
     */
    async getAll(limit: number, offset: number): Promise<Employee[]> {
        try {
            // go to external service with same url
            const response = await axios.get(config.employeesUrl, {
                params: {
                    limit,
                    offset
                }
            });
            return response.data || [];
        } catch (error) {
            // error happened, just in case it was called with limit 1 and server returns 404, we can returned an empty array
            if (error.response && error.response.status === 404) {
                return [];
            }
            // unexpected error in response, wrap exception inside a service to be handled later
            throw new ServicesError(ProvidersErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE, error);
        }
    }
    /**
     * Check if the configuration is valid to call external service
     */
    private validateConfig() {
        // validate if configuration is good
        if (!config.employeesUrl) {
            throw new ServicesError(ProvidersErrorCodes.EMPLOYEE_PROVIDER_MISSING_CONFIG, "Please provide a valid employee URL in the config");
        }
    }
}