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
}