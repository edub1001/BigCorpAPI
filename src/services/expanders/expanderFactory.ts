import { injectable, multiInject } from "inversify";
import { ServicesError } from "../servicesError";
import { Expanders } from "./expanders";
import { ExpandersErrorCodes } from "./expandersError";
import { IExpander, IExpanderFactory } from "./interfaces";
import { EXPANDERS_TYPES } from "./types";

/**
 * Factory will return constructed expander. Relying on container to inject expanders.
 */
@injectable()
export class ExpanderFactory implements IExpanderFactory {
    /**
     * Constructor used by continer
     * @param expanders Inject multiple instances of expander type, ideally 1 per expander supported
     */
    constructor(@multiInject(EXPANDERS_TYPES.IExpander) private expanders: IExpander[]) {
        if (!expanders || expanders.length === 0) {
            throw new ServicesError(ExpandersErrorCodes.FACTORY_MISSING_EXPANDERS, "You neeed to specify at least one expander");
        }
    }

    /**
     * Get the proper expander for the given expander type
     * @param expand The expand enum value we are interested in
     * @returns The first IExpander that will fit with criteria for the expader type
     */
    getExpander(expand: Expanders): IExpander {
        return this.expanders.find(e => e.applyTo(expand));
    }
}