import { ServicesError, ValidationErrorCodes } from "./servicesError";

/**
 * Function to validate any given id, checking if it is valid for an id
 * @param id The id to validate
 */
export const validateId = (id:any) => {
    // check a number and greater than 0
    if (isNaN(Number(id)) || id <= 0) {
        throw new ServicesError(ValidationErrorCodes.ID_ERROR, "Id should be greater than 0");
    }
  }