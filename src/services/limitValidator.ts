import { ServicesError, ValidationErrorCodes } from "./servicesError";

/**
 * Function to validate any given limit, checking if it is valid for a limit
 * @param limit The limit to validate
 */
export const validateLimit = (limit:any) => {
    // check if it is a number or is between boundaries
    if (isNaN(Number(limit)) || limit < 1 || limit > 1000) {
        throw new ServicesError(ValidationErrorCodes.LIMIT_ERROR, "Limit should be greater than 0 and less or equal to 1000");
    }
  }