import { injectable, unmanaged } from "inversify";
import { BaseEntity } from "../../models/baseEntity";
import { IBaseProvider } from "./interfaces";

@injectable()
export abstract class BaseProvider<T extends BaseEntity> implements IBaseProvider<T> {
    constructor(@unmanaged() private entities: T[]) {}

    getById(id:number) : Promise<T> {
        // match by id of the base entity
        const entity = this.entities.find(e => e.id === id);
        if (!entity) {
            return undefined;
        }
        // get shallow copy of the element
        return Promise.resolve({...entity});
    }

    getAll(limit:number, offset:number) : Promise<T[]> {
        // match by id of the base entity
        const entities = this.entities.slice(offset, offset + limit);
        // get shallow copy of the element
        return Promise.resolve(entities.map(v => {return {...v}}));
    }
}