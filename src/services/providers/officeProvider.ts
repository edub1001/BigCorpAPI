import * as offices from "../../../config/offices.json";
import { injectable } from "inversify";
import { BaseProvider } from "./baseProvider";
import { IOfficeProvider } from "./interfaces";

@injectable()
export class OfficeProvider extends BaseProvider implements IOfficeProvider {
    constructor() {
        super(offices);
    }
}