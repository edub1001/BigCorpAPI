import { inject, injectable } from "inversify";
import { Tree, TreeBase } from "../../models/tree";
import { ErrorCodes, ServicesError } from "../servicesError";
import { Expanders } from "./expanders";
import { ExpandersErrorCodes } from "./expandersError";
import { IExpanderFactory } from "./interfaces";
import { EXPANDERS_TYPES } from "./types";

@injectable()
export class ExpanderTreeValidator {
    constructor(@inject(EXPANDERS_TYPES.IExpanderFactory) private expanderFactory: IExpanderFactory) {
    }

    tryToParseToExpanderTree(expand: string[], rootNode:Expanders): Tree<Expanders> {
        const errors = [];
        const expanderTree = new Tree<Expanders>(rootNode);
        if (expand !== undefined) {
            expand.forEach(expandString => {
                let node = expanderTree as TreeBase<Expanders>;
                for (const expandStringTerm of expandString.split(".")) {
                    // check if string is a valid expander
                    const typedExpanderString = expandStringTerm as keyof typeof Expanders;
                    const typedExpander = Expanders[typedExpanderString];
                    const expanderService = this.expanderFactory.getExpander(typedExpander);
                    if (typedExpander === undefined || !expanderService) {
                        errors.push(`${typedExpanderString} is not allowed to be expanded`);
                        break;
                    }
                    // check if it can be expanded from parent
                    const parentExpandedType = node.getValue();
                    if(expanderService.expandFrom().indexOf(parentExpandedType) < 0) {
                        const parentExpandedTypeString = Expanders[parentExpandedType];
                        errors.push(`${typedExpanderString} cannot be expanded from ${parentExpandedTypeString}`);
                        break;
                    }
                    node = node.addChild(typedExpander);
                }
            });
        }
        if (errors.length > 0) {
            throw new ServicesError(ExpandersErrorCodes.EXPAND_ERROR, ...errors);
        }
        return expanderTree;
    }
}