import { injectable } from "inversify";
import { Employee } from "../models/employee";
import { IEmployeeProvider } from "./interfaces";
import axios from 'axios';

@injectable()
export class EmployeeProvider implements IEmployeeProvider {
    async getById(ids: number[]): Promise<Employee[]> {
        try {
            const response = await axios.get('/user?ID=12345');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAll(limit: number, offset: number): Promise<Employee[]> {
        try {
            const response = await axios.get('/user?ID=12345');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}