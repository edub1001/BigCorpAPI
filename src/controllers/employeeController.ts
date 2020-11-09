import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Employee } from "../models/employee";
import { Expanders } from "../services/expanders/expanders";
import { IExpanderFactory } from "../services/expanders/interfaces";
import { ExpanderTreeValidator } from "../services/expanders/treeExpanderValidator";
import { EXPANDERS_TYPES } from "../services/expanders/types";
import { IEmployeeProvider } from "../services/providers/interfaces";
import { PROVIDERS_TYPES } from "../services/providers/types";
import { BaseController } from "./baseController";

@injectable()
export class EmployeeController extends BaseController<Employee> {
    constructor(
        @inject(PROVIDERS_TYPES.IEmployeeProvider) employeeProvider: IEmployeeProvider,
        @inject(EXPANDERS_TYPES.IExpanderFactory) expanderFactory: IExpanderFactory,
        @inject(ExpanderTreeValidator) expanderTreeValidator: ExpanderTreeValidator) {
        super(employeeProvider, expanderFactory, expanderTreeValidator, Expanders.employee);
    }
}