import { APIGatewayProxyHandler, CustomAuthorizerHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDB } from "aws-sdk";
import { httpSuccess, httpNotFound } from './utils/response';
import { validate } from './utils/validator';
import { bookSchema } from './bookSchema';
import { v4 as uuidGenV4 } from "uuid"
import { handleError } from './utils/handleError';
import { verifyToken } from './utils/verifyToken';
import { generatePolicy } from './utils/generatePolicy';

// Create dynamo db client connection
const dbClient = new DynamoDB.DocumentClient({
  apiVersion: "latest",
  region: "ap-south-1"
});

/**
 * Retrieves all the books available
 */
export const getList: APIGatewayProxyHandler = async () => {
  try {
    const books = await dbClient.scan({
      TableName: process.env.BOOKS_TABLE_NAME,
    }).promise();

    return httpSuccess(books);
  } catch (e) {
    return handleError(e);
  }
}

/**
 * Retrieve a single book information
 * @param event 
 * @param _context 
 */
export const getOne: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const book = await dbClient.get({
      TableName: process.env.BOOKS_TABLE_NAME,
      Key: { id: event.pathParameters.id }
    }).promise();

    if (!book.Item) {
      return httpNotFound();
    }

    return httpSuccess(book.Item);
  } catch (e) {
    return handleError(e);
  }
}

/**
 * Add a new book
 * @param event 
 * @param _context 
 */
export const addBook: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const requestBody = JSON.parse(event.body);

    validate(bookSchema, requestBody);

    const { author, name, etag, category, price } = requestBody;

    const params = {
      TableName: process.env.BOOKS_TABLE_NAME,
      Item: {
        id: uuidGenV4(),
        name,
        author,
        etag,
        price,
        category,
        description: requestBody.description || ""
      }
    };

    await dbClient.put(params).promise();

    return httpSuccess(params.Item);

  } catch (e) {
    return handleError(e);
  }
}

/**
 * Update a book by it's id
 * @param event 
 * @param _context 
 */
export const updateBook: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const requestBody = JSON.parse(event.body);

    validate(bookSchema, requestBody);

    const { author, name, etag, category, price, description } = requestBody;

    const params = {
      TableName: process.env.BOOKS_TABLE_NAME,
      Key: { id: event.pathParameters.id },
      UpdateExpression: "set author = :author, name = :name, etag = :etag, category = :category, price = :price, description = :description",
      ExpressionAttributeValues: {
        ":author": author,
        ":name": name,
        ":etag": etag,
        ":category": category,
        ":price": price,
        ":description": description || "",
      },
    };

    await dbClient.update(params).promise();

    return httpSuccess({ author, name, etag, category, price, description, id: event.pathParameters.id });

  } catch (e) {
    return handleError(e);
  }
}

/**
 * Delete a book by it's id
 * @param event 
 * @param _context 
 */
export const deleteBook: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const book = await dbClient.get({
      TableName: process.env.BOOKS_TABLE_NAME,
      Key: { id: event.pathParameters.id }
    }).promise();

    if (!book.Item) {
      return httpNotFound();
    }

    await dbClient.delete({
      TableName: process.env.BOOKS_TABLE_NAME,
      Key: { id: event.pathParameters.id }
    }).promise();

    return httpSuccess({ message: "The book has been deleted" });
  } catch (e) {
    return handleError(e);
  }
}

export const authorize: CustomAuthorizerHandler = async (event, _context) => {
  const token = event.authorizationToken;
  let info;
  try {
    info = await verifyToken(token.slice(7, token.length));
  } catch (e) {
    throw new Error("Unauthorized");
  }

  return generatePolicy(info.id, "Allow", "*", info);
}