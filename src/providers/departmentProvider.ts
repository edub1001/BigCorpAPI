import { injectable } from "inversify";
import { Department } from "../models/department";
import { BaseProvider } from "./baseProvider";
import * as departments from "./departments.json";
import { IDepartmentProvider } from "./interfaces";

@injectable()
export class DepartmentProvider extends BaseProvider implements IDepartmentProvider {
    constructor() {
        super(departments);
    }
}
