import { inject, injectable } from "inversify";
import { Tree, TreeBase } from "../../models/tree";
import { ErrorCodes, ServicesError } from "../servicesError";
import { Expanders } from "./expanders";
import { IExpanderFactory } from "./interfaces";
import { EXPANDERS_TYPES } from "./types";

@injectable()
export class ExpanderTreeValidator {
    constructor(@inject(EXPANDERS_TYPES.IExpanderFactory) private expanderFactory: IExpanderFactory) {
    }

    tryToParseToExpanderTree(expand: string[]): Tree<Expanders> {
        const errors = [];
        const expanderTree = new Tree<Expanders>(Expanders.employee);
        if (expand !== undefined) {
            expand.forEach(expandString => {
                let node = expanderTree as TreeBase<Expanders>;
                for (const expandStringTerm of expandString.split(".")) {
                    // check if string is a valid expander
                    const typedExpanderString = expandStringTerm as keyof typeof Expanders;
                    const typedExpander = Expanders[typedExpanderString];
                    if (typedExpander === undefined) {
                        errors.push(`${typedExpanderString} is not allowed to be expanded`);
                        break;
                    }
                    const insertedNode = node.addChild(typedExpander);
                    // check if it can be expanded from parent
                    const expanderService = this.expanderFactory.getExpander(typedExpander);
                    const parentExpandedType = insertedNode.getParent().getValue();
                    if(!expanderService.expandFrom().includes(parentExpandedType)) {
                        const parentExpandedTypeString = Expanders[parentExpandedType];
                        errors.push(`${typedExpanderString} cannot be expand from ${parentExpandedTypeString}`);
                        break;
                    }
                    node = insertedNode;
                }
            });
        }
        if (errors.length > 0) {
            throw new ServicesError(ErrorCodes.EXPAND_ERROR, ...errors);
        }
        return expanderTree;
    }
}