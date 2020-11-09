import departments from "../../../config/departments.json";
import { injectable } from "inversify";
import { BaseProvider } from "./baseProvider";
import { IDepartmentProvider } from "./interfaces";
import { Department } from "../../models/department";

@injectable()
export class DepartmentProvider extends BaseProvider<Department> implements IDepartmentProvider {
    constructor() {
        super(departments);
    }
}
