import { APIGatewayProxyResult } from "aws-lambda";

export const httpSuccess = (payload: object) => {
  return httpStatus(200, payload);
}

export const httpNotFound = () => {
  return httpStatus(404);
}

export const httpInternalServerError = () => {
  return httpStatus(500);
}

export const httpValidationError = (payload: object) => {
  return httpStatus(422, payload);
}

export const httpStatus = (code: number, payload?: object): APIGatewayProxyResult => {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Credentials': true, 
    },
    body: (() => JSON.stringify(payload) || null)(),
  };
}