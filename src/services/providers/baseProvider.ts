import { injectable, unmanaged } from "inversify";

@injectable()
export abstract class BaseProvider {
    constructor(@unmanaged() private entities: any[]) {}

    getById(id:number) : any {
        // match by id of the base entity
        const entity = this.entities.filter(e => e.id === id);
        // get shallow copy of the element
        return {...entity};
    }

    getAll(limit:number, offset:number) : any {
        // match by id of the base entity
        const entities = this.entities.slice(offset, offset + limit);
        // get shallow copy of the element
        return entities.map(v => {return {...v}});
    }
}