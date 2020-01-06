import { httpValidationError, httpInternalServerError } from "./response";

export const handleError = (e) => {
  if (e.name === "ValidationException") {
    return httpValidationError(e.errors);
  }
  return httpInternalServerError();
}