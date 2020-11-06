import { ErrorCodes, ServicesError } from "./servicesError";

export const validateOffset = (offset:any) => {
    if (isNaN(Number(offset)) || offset < 0) {
        throw new ServicesError(ErrorCodes.OFFSET_ERROR, "Offset should be greater or equal than 0");
    }
  }