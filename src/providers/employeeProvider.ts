import { injectable } from "inversify";
import { Employee } from "../models/employee";
import { IEmployeeProvider } from "./interfaces";
import axios from 'axios';

@injectable()
export class EmployeeProvider implements IEmployeeProvider {
    getById(ids: number[]) : Employee[] {
        // try {
        //     const response = await axios.get('/user?ID=12345');
        //     return response.data;
        // } catch (error) {
        //     // TODO: log
        //     throw error;
        // }
        return [{first: "Eduardo", last: "Back"} as Employee] as Employee[];
    }

    getAll(limit:number, offset:number) : Employee[] {
        return [{first: "Eduardo", last: "Back"} as Employee] as Employee[];
    }
}