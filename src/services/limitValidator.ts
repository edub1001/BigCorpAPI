import { ErrorCodes, ServicesError } from "./servicesError";

export const validateLimit = (limit:any) => {
    if (isNaN(Number(limit)) || limit < 1 || limit > 1000) {
        throw new ServicesError(ErrorCodes.LIMIT_ERROR, "Limit should be greater than 0 and less or equal to 1000");
    }
  }