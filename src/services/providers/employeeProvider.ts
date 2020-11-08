import axios from 'axios';
import { injectable } from "inversify";
import { config } from 'node-config-ts';
import qs from 'qs';
import { Employee } from "../../models/employee";
import { ServicesError } from '../servicesError';
import { IEmployeeProvider } from "./interfaces";
import { ProvidersErrorCodes } from './providersError';

@injectable()
export class EmployeeProvider implements IEmployeeProvider {
    constructor() {
        this.validateConfig();
    }

    async getById(id: number): Promise<Employee> {
        const employees = await this.getByIds([id]);
        if (!employees || employees.length === 0) {
            return undefined;
        }
        return employees[0];
    }

    async getByIds(ids: number[]): Promise<Employee[]> {
        if (!ids || ids.length === 0) {
            return [];
        }
        try {
            const response = await axios.get(config.employeesUrl, {
                params: {
                    id: ids
                },
                paramsSerializer: (params) => {
                    return qs.stringify(params, { arrayFormat: 'repeat' })
                }
            });
            return response.data || [];
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return [];
            }
            throw new ServicesError(ProvidersErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE, error);
        }
    }

    async getAll(limit: number, offset: number): Promise<Employee[]> {
        try {
            const response = await axios.get(config.employeesUrl, {
                params: {
                    limit,
                    offset
                }
            });
            return response.data || [];
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return [];
            }
            throw new ServicesError(ProvidersErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE, error);
        }
    }

    private validateConfig() {
        // validate if configuration is good
        if (!config.employeesUrl) {
            throw new ServicesError(ProvidersErrorCodes.EMPLOYEE_PROVIDER_MISSING_CONFIG, "Please provide a valid employee URL in the config");
        }
    }
}