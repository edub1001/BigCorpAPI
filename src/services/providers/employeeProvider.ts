import axios from 'axios';
import { injectable } from "inversify";
import { config } from 'node-config-ts';
import qs from 'qs';
import { Employee } from "../../models/employee";
import { IEmployeeProvider } from "./interfaces";
import { ProvidersError, ErrorCodes } from './providersError';

@injectable()
export class EmployeeProvider implements IEmployeeProvider {
    async getById(id: number): Promise<Employee> {
        const employees = await this.getByIds([id]);
        if (employees.length === 0) {
            throw new ProvidersError(ErrorCodes.EMPLOYEE_PROVIDER_NOT_FOUND, `Employee with id ${id} not found`);
        }
        return employees[0];
    }

    async getByIds(ids: number[]): Promise<Employee[]> {
        this.validateConfig();
        try {
            const response = await axios.get(config.employeesUrl, {
                params: {
                    id: ids
                },
                paramsSerializer: (params) => {
                    return qs.stringify(params, {arrayFormat: 'repeat'})
                 }
            });
            return response.data;
        } catch (error) {
            throw new ProvidersError(ErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE, error);
        }
    }

    async getAll(limit: number, offset: number): Promise<Employee[]> {
        this.validateConfig();
        try {
            const response = await axios.get(config.employeesUrl, {
                params: {
                    limit,
                    offset
                }
            });
            return response.data;
        } catch (error) {
            throw new ProvidersError(ErrorCodes.EMPLOYEE_PROVIDER_ERROR_RESPONSE, error);
        }
    }

    private validateConfig() {
        // validate if configuration is good
        if (config.employeesUrl === undefined) {
            throw new ProvidersError(ErrorCodes.EMPLOYEE_PROVIDER_MISSING_CONFIG, "Please provide a valid employee URL in the config");
        }
    }
}