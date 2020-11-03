import axios from 'axios';
import { injectable } from "inversify";
import { config } from 'node-config-ts';
import qs from 'qs';
import { Employee } from "../models/employee";
import { IEmployeeProvider } from "./interfaces";

@injectable()
export class EmployeeProvider implements IEmployeeProvider {
    async getById(ids: number[]): Promise<Employee[]> {
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
            throw error;
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
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}