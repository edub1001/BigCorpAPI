import * as departments from "../../config/departments.json";
import { injectable } from "inversify";
import { BaseProvider } from "./baseProvider";
import { IDepartmentProvider } from "./interfaces";

@injectable()
export class DepartmentProvider extends BaseProvider implements IDepartmentProvider {
    constructor() {
        super(departments);
    }
}
