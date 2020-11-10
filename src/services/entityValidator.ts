import { ServicesError, ValidationErrorCodes } from "./servicesError";

/**
 * Function to validate any given entity, to see if it is other than null or undefined
 * @param entity The entity object to validate
 */
export const validateEntity = (entity: any) => {
    // not null or undefined
    if (!entity) {
        throw new ServicesError(ValidationErrorCodes.NOT_EXISTING, "Resource with given id not found");
    }
}