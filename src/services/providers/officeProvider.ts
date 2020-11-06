import offices from "../../../config/offices.json";
import { injectable } from "inversify";
import { BaseProvider } from "./baseProvider";
import { IOfficeProvider } from "./interfaces";
import { Office } from "../../models/office";

@injectable()
export class OfficeProvider extends BaseProvider<Office> implements IOfficeProvider {
    constructor() {
        super(offices);
    }
}