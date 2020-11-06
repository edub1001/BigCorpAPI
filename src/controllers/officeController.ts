import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Office } from "../models/office";
import { Expanders } from "../services/expanders/expanders";
import { IExpanderFactory } from "../services/expanders/interfaces";
import { ExpanderTreeValidator } from "../services/expanders/treeExpanderValidator";
import { EXPANDERS_TYPES } from "../services/expanders/types";
import { IOfficeProvider } from "../services/providers/interfaces";
import { PROVIDERS_TYPES } from "../services/providers/types";
import { BaseController } from "./baseController";

@injectable()
export class OfficeController extends BaseController<Office> {
    constructor(
        @inject(PROVIDERS_TYPES.IOfficeProvider) officeProvider: IOfficeProvider,
        @inject(EXPANDERS_TYPES.IExpanderFactory) expanderFactory: IExpanderFactory,
        @inject(EXPANDERS_TYPES.ExpanderTreeValidator) expanderTreeValidator: ExpanderTreeValidator) {
        super(officeProvider, expanderFactory, expanderTreeValidator, Expanders.office);
    }
}