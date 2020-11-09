import { ServicesError, ValidationErrorCodes } from "./servicesError";

export const validateId = (id:any) => {
    if (isNaN(Number(id)) || id <= 0) {
        throw new ServicesError(ValidationErrorCodes.ID_ERROR, "Id should be greater than 0");
    }
  }