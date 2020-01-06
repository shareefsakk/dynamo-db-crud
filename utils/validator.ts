import * as Ajv from "ajv";
import * as normalize from "ajv-error-messages";
import { ValidationException } from "./ValidationException";

const ajv = new Ajv({ allErrors: true });

export const validate = (schema: object, data: object) => {
  const test = ajv.compile(schema);
  if (!test(data)) {
    throw new ValidationException("Validation Error", formatErrors(test.errors));
  }
  return true;
};

const formatErrors = (errors: any[]) => {
  const errorsList = normalize(errors);
  if (Object.keys(errorsList.fields).length) {
    return Object.keys(errorsList.fields).reduce((acc, key) => {
      acc[key] = errorsList.fields[key][0];
      return acc;
    }, {});
  }
  return {};
};
