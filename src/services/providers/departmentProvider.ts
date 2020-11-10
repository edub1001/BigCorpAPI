import departments from "../../../config/departments.json";
import { injectable } from "inversify";
import { BaseProvider } from "./baseProvider";
import { IDepartmentProvider } from "./interfaces";
import { Department } from "../../models/department";

/**
 * Provider that will return department model from memory after reading json file
 */
@injectable()
export class DepartmentProvider extends BaseProvider<Department> implements IDepartmentProvider {
    constructor() {
        super(departments);
    }
}
