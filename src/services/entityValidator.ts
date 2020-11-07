import { ServicesError, ValidationErrorCodes } from "./servicesError";

export const validateEntity = (entity: any) => {
    if (!entity) {
        throw new ServicesError(ValidationErrorCodes.NOT_EXISTING, "Resource with given id not found");
    }
}