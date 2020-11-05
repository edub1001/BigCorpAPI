import { Tree, TreeBase } from "../../models/tree"
import { ErrorCodes, ServicesError } from "../servicesError";
import { Expanders } from "./expanders"

function tryToParseToExpanderTree(expand: string[]): Tree<Expanders> {
    const errors = [];
    const expanderTree = new Tree<Expanders>(Expanders.employee);
    if (expand !== undefined) {
        expand.forEach(expandString => {
            let node = expanderTree as TreeBase<Expanders>;
            for (const expandStringTerm of expandString.split(".")) {
                const typedExpanderString = expandStringTerm as keyof typeof Expanders;
                const typedExpander = Expanders[typedExpanderString];
                if (typedExpander === undefined) {
                    errors.push(`${typedExpanderString} is not allowed to be expanded`);
                    break;
                }
                node = node.addChild(typedExpander);
            }
        });
    }
    if (errors.length > 0) {
        throw new ServicesError(ErrorCodes.EXPAND_ERROR, ...errors);
    }
    return expanderTree;
}

export { tryToParseToExpanderTree }