import { injectable, multiInject } from "inversify";
import { Expanders } from "./expanders";
import { IExpanderFactory, IExpander } from "./interfaces";
import { EXPANDERS_TYPES } from "./types";

@injectable()
export class ExpanderFactory implements IExpanderFactory {
    constructor(@multiInject(EXPANDERS_TYPES.IExpander)private expanders : IExpander[]) {}

    getExpander(expand: Expanders) : IExpander {
        return this.expanders.find(e => e.applyTo(expand));
    }
}