import { injectable, unmanaged } from "inversify";
import { BaseEntity } from "../models/baseEntity";
import { Tree, TreeNode } from "../models/tree";
import { validateEntity } from "../services/entityValidator";
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

/**
 * Abstract base controller class that will handle base entity for 2 endpoints
 */
@injectable()
export abstract class BaseController<T extends BaseEntity> {
    /**
     * Base class constructor
     * @param provider A base provider for the entity
     * @param expanderFactory The factory to look for expanders
     * @param expanderTreeValidator Expader validation
     * @param expanderBase Base entity name from which we are expanding
     */
    constructor(
        @unmanaged() private provider: IBaseProvider<T>,
        @unmanaged() private expanderFactory: IExpanderFactory,
        @unmanaged() private expanderTreeValidator: ExpanderTreeValidator,
        @unmanaged() private expanderBase:Expanders) {
    }

    /**
     * Wrap function with try catch looking for validation errors
     * @param fun The function to execute in safe context for Service errors
     * @param statusCode Status code to wrap the exception with. This code will be set to the response
     * @throws Error in case it occurs
     */
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

    /**
     * Get base entities specified by the child controller as a promise
     * @param limit Limit used to determine the max number of entitied to return
     * @param offset Offset for pagination where to start
     * @param expand String array of dot separated values that should be used for expansion
     */
    async getEntities(limit: any = 100, offset: any = 0, expand?: string[]): Promise<T[]> {
        // validate limit & offset and return with BAD REQUEST if error
        this.wrapStatusCode(() =>validateLimit(limit), HttpStatusCode.BAD_REQUEST);
        this.wrapStatusCode(() => validateOffset(offset), HttpStatusCode.BAD_REQUEST);
        // validate and get tree of expanders
        let expandTree: Tree<Expanders>;
        this.wrapStatusCode(() => expandTree = this.expanderTreeValidator.tryToParseToExpanderTree(expand, this.expanderBase), HttpStatusCode.BAD_REQUEST);
        // get all entities for provider
        const entities = await this.provider.getAll(Number(limit), Number(offset));
        // expand entities, if children is empty, expansion will return right away
        await this.expandEntity(entities, expandTree.getChildren());
        return entities;
    }

    /**
     * Get base entity specified by the child controller as a promise using id
     * @param id The id to look for
     * @param expand String array of dot separated values that should be used for expansion
     */
    async getEntity(id: any, expand?: string[]): Promise<T> {
        // validate id and return with BAD REQUEST if error
        this.wrapStatusCode(() => validateId(id), HttpStatusCode.BAD_REQUEST);
        // validate and get tree of expanders
        let expandTree: Tree<Expanders>;
        this.wrapStatusCode(() => expandTree =  this.expanderTreeValidator.tryToParseToExpanderTree(expand, this.expanderBase), HttpStatusCode.BAD_REQUEST);
        // get entity for provider by id
        const entity = await this.provider.getById(Number(id));
        // return with NOT FOUND if entity does not exists
        this.wrapStatusCode(() => validateEntity(entity) , HttpStatusCode.NOT_FOUND);
        // expand entity, if children is empty, expansion will return right away
        await this.expandEntity([entity], expandTree.getChildren());
        return entity;
    }

    /**
     * Recursive method that will traverse the expansion tree expanding base entities
     * @param entitiesToExpand The array of entities to expand
     * @param expandCategories The categories we would like to expand at this level
     */
    private async expandEntity(entitiesToExpand: any, expandCategories: ReadonlyArray<TreeNode<Expanders>>) {
        for (const expandCategory of expandCategories) {
            // use factory that will handle the expansion
            const expander = this.expanderFactory.getExpander(expandCategory.getValue());
            // expand using proper expander
            const expandedEntities = await expander.expand(entitiesToExpand);
            // go and expand all the children in the branch
            await this.expandEntity(expandedEntities, expandCategory.getChildren());
        }
    }
}