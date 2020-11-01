import { injectable } from "inversify";
import { Office } from "../models/office";
import { BaseProvider } from "./baseProvider";
import { IOfficeProvider } from "./interfaces";
import * as offices from "./offices.json";

@injectable()
export class OfficeProvider extends BaseProvider implements IOfficeProvider {
    constructor() {
        super(offices);
    }
}