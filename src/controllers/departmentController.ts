import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Department } from "../models/department";
import { IExpanderFactory } from "../services/expanders/interfaces";
import { ExpanderTreeValidator } from "../services/expanders/treeExpanderValidator";
import { EXPANDERS_TYPES } from "../services/expanders/types";
import { IDepartmentProvider } from "../services/providers/interfaces";
import { PROVIDERS_TYPES } from "../services/providers/types";
import { BaseController } from "./baseController";

@injectable()
export class DepartmentController extends BaseController<Department> {
    constructor(
        @inject(PROVIDERS_TYPES.IDepartmentProvider) departmentProvider: IDepartmentProvider,
        @inject(EXPANDERS_TYPES.IExpanderFactory) expanderFactory: IExpanderFactory,
        @inject(EXPANDERS_TYPES.ExpanderTreeValidator) expanderTreeValidator: ExpanderTreeValidator) {
        super(departmentProvider, expanderFactory, expanderTreeValidator);
    }
}