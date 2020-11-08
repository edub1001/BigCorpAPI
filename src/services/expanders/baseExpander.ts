import { injectable } from "inversify";
import { BaseEntity } from "../../models/baseEntity";
import { IBaseProvider } from "../providers/interfaces";

/**
 * Base Class to expand objects
 */
@injectable()
export abstract class BaseExpander<T extends BaseEntity> {
    /**
     * Inject a type of provider
     * @param provider Provider that will return entity by id
     */
    constructor(private provider: IBaseProvider<T>) { }

    /**
     * Expand object type <T> from expandable objects array passed by param using the provider in constructor.
     * propertyToExpand should be the property in the entity to expand to look in the provider
     * @param entitiesToExpand An array of employees to expand office
     * @param propertyToExpand Property to expand should let to a number in the object, otherwise it won't expand
     * @returns An array of unique office objects expanded in the employees passed. If propertyToExpand is not a number, it will consider it as expanded
     */
    async expand(entitiesToExpand: BaseEntity[], propertyToExpand: string): Promise<T[]> {
        const objectsExpanded = new Map<number, T>();
        // go through all the entities to expand
        for (const entityToExpand of entitiesToExpand) {
            // check if it is a number
            if (typeof entityToExpand[propertyToExpand] === "number") {
                // look up first if the object was already expanded, avoid sending duplicated (same object twice)
                // and avoid going to provider
                if (objectsExpanded.has(entityToExpand[propertyToExpand])) {
                    entityToExpand[propertyToExpand] = objectsExpanded.get(entityToExpand[propertyToExpand]);
                }
                else {
                    // go to provider
                    const objectExpanded = await this.provider.getById(entityToExpand[propertyToExpand]);
                    if (objectExpanded !== undefined) {
                        entityToExpand[propertyToExpand] = objectExpanded;
                        objectsExpanded.set(objectExpanded.id, objectExpanded);
                    }
                    else {
                        // TODO: some logging, keep number
                    }
                }
            }
            // already an object different to int, consider it expanded already. Avoid null or undefined
            else if (entityToExpand[propertyToExpand]) {
                objectsExpanded.set(entityToExpand[propertyToExpand].id, entityToExpand[propertyToExpand]);
            }
        }
        // return all the expanded objects
        return Array.from(objectsExpanded.values());
    }
}