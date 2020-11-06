import { ErrorCodes, ServicesError } from "./servicesError";

export const validateOffset = (offset:any) => {
    if (offset === isNaN && offset < 0) {
        throw new ServicesError(ErrorCodes.OFFSET_ERROR, "Offset should be greater than 0");
    }
  }