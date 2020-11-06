import { injectable, unmanaged } from "inversify";
import { BaseEntity } from "../models/baseEntity";
import { Tree, TreeNode } from "../models/tree";
import { Expanders } from "../services/expanders/expanders";
import { IExpanderFactory } from "../services/expanders/interfaces";
import { ExpanderTreeValidator } from "../services/expanders/treeExpanderValidator";
import { validateId } from "../services/idValidator";
import { validateLimit } from "../services/limitValidator";
import { validateOffset } from "../services/offsetValidator";
import { IBaseProvider } from "../services/providers/interfaces";
import { ServicesError } from "../services/servicesError";

export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

@injectable()
export abstract class BaseController<T extends BaseEntity> {
    constructor(
        @unmanaged() private provider: IBaseProvider<T>,
        @unmanaged() private expanderFactory: IExpanderFactory,
        @unmanaged() private expanderTreeValidator: ExpanderTreeValidator,
        @unmanaged() private expanderBase:Expanders) {
    }

    wrapStatusCode = (fun: () => void, statusCode: HttpStatusCode) => {
        try {
            fun();
        } catch (error) {
            if (error instanceof ServicesError) {
                // tslint:disable-next-line: no-string-literal
                error["statusCode"] = statusCode;
            }
            throw error;
        }
    };

    async getEntities(limit: any = 100, offset: any = 0, expand?: string[]): Promise<T[]> {
        this.wrapStatusCode(() =>validateLimit(limit), HttpStatusCode.BAD_REQUEST);
        this.wrapStatusCode(() => validateOffset(offset), HttpStatusCode.BAD_REQUEST);
        let expandTree: Tree<Expanders>;
        this.wrapStatusCode(() => expandTree = this.expanderTreeValidator.tryToParseToExpanderTree(expand, this.expanderBase), HttpStatusCode.BAD_REQUEST);
        const entities = await this.provider.getAll(limit, offset);
        // expand entities, if children is empty, expansion will return right away
        await this.expandEntity(entities, expandTree.getChildren());
        return entities;
    }

    async getEntity(id: any, expand?: string[]): Promise<T> {
        this.wrapStatusCode(() => validateId(id), HttpStatusCode.BAD_REQUEST);
        let expandTree: Tree<Expanders>;
        this.wrapStatusCode(() => expandTree =  this.expanderTreeValidator.tryToParseToExpanderTree(expand, this.expanderBase), HttpStatusCode.BAD_REQUEST);
        let entity: T;
        this.wrapStatusCode(async () => entity = await this.provider.getById(id), HttpStatusCode.NOT_FOUND);
        // expand entity, if children is empty, expansion will return right away
        await this.expandEntity(entity, expandTree.getChildren());
        return entity;
    }

    private async expandEntity(entitiesToExpand: any, expandCategories: ReadonlyArray<TreeNode<Expanders>>) {
        for (const expandCategory of expandCategories) {
            // use factory that will handle the expansion
            const expander = this.expanderFactory.getExpander(expandCategory.getValue());
            const expandedEntities = await expander.expand(entitiesToExpand);
            this.expandEntity(expandedEntities, expandCategory.getChildren());
        }
    }
}