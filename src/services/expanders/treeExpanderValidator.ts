import { inject, injectable } from "inversify";
import { Tree, TreeBase } from "../../models/tree";
import { ErrorCodes, ServicesError } from "../servicesError";
import { Expanders } from "./expanders";
import { ExpandersErrorCodes } from "./expandersError";
import { IExpanderFactory } from "./interfaces";
import { EXPANDERS_TYPES } from "./types";

/**
 * Validate and create a tree while going through an array of strings
 */
@injectable()
export class ExpanderTreeValidator {
    constructor(@inject(EXPANDERS_TYPES.IExpanderFactory) private expanderFactory: IExpanderFactory) {
    }

    /**
     * Validate each of the expansion string terms divided by dots and form a tree with unique elements (avoid repeating same branch level values) of Expansion elements
     * @param expand An array of string to be converted into expansion terms
     * @param rootNode The root node expander type that all the expansion will start from
     * @returns An expansion tree that will avoid duplication in the same level/branch
     */
    tryToParseToExpanderTree(expand: string[], rootNode:Expanders): Tree<Expanders> {
        // initalize tree and errors
        const errors = [];
        const expanderTree = new Tree<Expanders>(rootNode);
        // in case expand terms is null or undefined, just return
        if (expand) {
            // make sure it is an array and not a single string
            if (!Array.isArray(expand)) {
                expand = [expand];
            }
            // go through each string term
            expand.forEach(expandString => {
                // reset node to tree root after each expansion term is processed
                let node = expanderTree as TreeBase<Expanders>;
                // divide using dot the string term
                for (const expandStringTerm of expandString.split(".")) {
                    // check if string is a valid expander included in Expander type enum
                    const typedExpanderString = expandStringTerm as keyof typeof Expanders;
                    const typedExpander = Expanders[typedExpanderString];
                    // get expander service from factory for expansion type
                    const expanderService = this.expanderFactory.getExpander(typedExpander);
                    // if string is not supported or a valid expander was not found, let's put an error and go to the next term
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
                    // add node to the chain and continue validation
                    node = node.addChild(typedExpander);
                }
            });
        }
        // if there are any errors, just send a service exception about validation
        if (errors.length > 0) {
            throw new ServicesError(ExpandersErrorCodes.EXPAND_ERROR, ...errors);
        }
        return expanderTree;
    }
}