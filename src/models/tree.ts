/* tslint:disable:max-classes-per-file */

/**
 * Tree base class structure
 * Handles a basic tree with multiple child nodes
 * Do not allow duplicated generic values T
 */
abstract class TreeBase<T> {
    private _children: TreeNode<T>[] = [];
    /** Initialize constructor with value to hold
     *  @param value The value we would like to store
     */
    constructor(private value: T) {
        this.value = value;
    }

    /**
     * Returns the value T hold in the node
     * @returns Value saved in the node
     */
    getValue(): T {
        return this.value;
    }

    /**
     * Add a child to the tree node or root checking for duplicity
     * @param value The value we would like to store
     * @returns The newly tree node added to the structure
     */
    addChild(value: T): TreeNode<T> {
        // check if child already exists for object T, return it if found
        let node = this.getChild(value);
        if (node !== undefined) {
            return node;
        }
        // create new and add to existing collection
        node = new TreeNode<T>(value, this);
        this._children.push(node);
        return node;
    }

    /**
     * Create bulk childrens for the node
     * @param values All the values we would like to save as children in the node
     */
    addChildren(values: T[]) {
        values.map(() => this.addChild);
    }

    /**
     * Get specific child checking inside node children for the value passed
     * @param value Value to find the children node
     * @returns The found node or undefined otherwise
     */
    getChild(value: T): TreeNode<T> {
        return this._children.find(c => c.value === value);
    }

    /**
     * Get all children nodes for current one
     * @returns All the children nodes or empty array
     */
    getChildren(): ReadonlyArray<TreeNode<T>> {
        return this._children;
    }
}

/**
 * Tree structure which is the root node
 */
class Tree<T> extends TreeBase<T> {
    /**
     * Get the size (in levels) of the whole tree structure going into every node
     * @returns The number of levels for the tree, 1 if it is having just the root node
     */
    size(): number {
        let rootMax = 0;
        // function to iterate through all nodes checking its levels
        const getChildSize = (max: number, childrens: ReadonlyArray<TreeNode<T>>) => {
            // for each child node received, grab and fetch its children size
            childrens.forEach(node => {
                // get one level down the tree, looking into node childrens
                const newMax = getChildSize(max + 1, node.getChildren());
                // if we find that this branch is the longest, update the global max level
                if (rootMax < newMax) {
                    rootMax = newMax;
                }
            });
            return max;
        };
        // trigger the recursive function from root node with 0 max level
        getChildSize(rootMax, this.getChildren());
        // add root level at the end
        return 1 + rootMax;
    }
}

/**
 * Basic tree node structure
 */
class TreeNode<T> extends TreeBase<T> {
    /**
     * Basic constructor for a tree node
     * @param value The value to hold in the tree node
     * @param parent Parent tree node to associate with
     */
    constructor(value: T, private parent: TreeBase<T>) {
        super(value);
        this.parent = parent;
    }

    /**
     * Retrieves the parent node of the tree object
     * @returns Parent node
     */
    getParent(): TreeBase<T> {
        return this.parent;
    }
}

export { Tree, TreeNode, TreeBase }