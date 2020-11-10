import { ServicesError, ValidationErrorCodes } from "./servicesError";

/**
 * Function to validate any given offset, checking if it is valid for an offset
 * @param offset The offset to validate
 */
export const validateOffset = (offset:any) => {
    // validate that offset can be converted to number as it is greater or equal to 0
    if (isNaN(Number(offset)) || offset < 0) {
        throw new ServicesError(ValidationErrorCodes.OFFSET_ERROR, "Offset should be greater or equal than 0");
    }
  }