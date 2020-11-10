import { injectable, unmanaged } from "inversify";
import { BaseEntity } from "../../models/baseEntity";
import { IBaseProvider } from "./interfaces";

/**
 * Base abstract provider that will handle memory provision of base entity objects
 */
@injectable()
export abstract class BaseProvider<T extends BaseEntity> implements IBaseProvider<T> {
    constructor(@unmanaged() private entities: T[]) {}

    /**
     * Return a base entity object of type T by the given id looking into memory passed objects
     * @param id Id of the base entity to look for.
     * @returns The promised object or undefined if not found
     */
    getById(id:number) : Promise<T> {
        // match by id of the base entity
        const entity = this.entities.find(e => e.id === id);
        if (!entity) {
            return undefined;
        }
        // get shallow copy of the element to avoid modification of the original dataset
        return Promise.resolve({...entity});
    }

    /**
     * Return base entity object of type T considering the limit and offset passed for pagination into memory passed objects
     * @param limit The max number of entites to be returned
     * @param offset The offset used in pagination to start from
     * @returns The promised object array or empty otherwise
     */
    getAll(limit:number, offset:number) : Promise<T[]> {
        // match by id of the base entity
        const entities = this.entities.slice(offset, offset + limit);
        // get shallow copy of the element to avoid modification of the original dataset
        return Promise.resolve(entities.map(v => {return {...v}}));
    }
}