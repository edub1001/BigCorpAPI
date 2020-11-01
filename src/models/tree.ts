/* tslint:disable:max-classes-per-file */

import { id } from "inversify";

abstract class TreeBase<T> {
    _children: TreeNode<T>[];
    _value: T;
    constructor(value: T) {
        this._value = value;
    }

    getValue(): T {
        return this._value;
    }

    addChild(value: T): TreeNode<T> {
        let node = this.getChild(value);
        if (node !== undefined) {
            return node;
        }
        if(this._children === undefined) {
            this._children = [];
        }
        node = new TreeNode<T>(value, this);
        this._children.push(node);
        return node;
    }

    addChildren(values: T[]) {
        values.map(c => this.addChild);
    }

    getChild(value: T): TreeNode<T> {
        if (this._children !== undefined) {
            return this._children.find(c => c._value === value);
        }
        return undefined;
    }

    getChildren(): TreeNode<T>[] {
        return this._children;
    }
}

class Tree<T> extends TreeBase<T> {
    size(): number {
        let rootMax = 0;
        const getChildSize = (max: number, _children: TreeNode<T>[]) => {
            if (_children !== undefined) {
                _children.forEach(node => {
                    const newMax = getChildSize(max + 1, node._children);
                    if (rootMax < newMax) {
                        rootMax = newMax;
                    }
                });
            }
            return max;
        };
        getChildSize(rootMax, this._children);
        return 1 + rootMax;
    }
}

class TreeNode<T> extends TreeBase<T> {
    _parent: TreeBase<T>;
    constructor(value: T, parent: TreeBase<T>) {
        super(value);
        this._parent = parent;
    }

    getParent(): TreeBase<T> {
        return this._parent;
    }
}

export { Tree, TreeNode, TreeBase }