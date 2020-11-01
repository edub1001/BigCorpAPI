import { Tree, TreeBase } from "../../models/tree"
import { Expanders } from "./expanders"

function tryToParseToExpanderTree(expand: string[], errors: string[]): Tree<Expanders> {
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
    return expanderTree;
}

export { tryToParseToExpanderTree }