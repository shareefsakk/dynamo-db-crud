export const bookSchema = {
  additionalProperties: false,
  properties: {
      name: {
          minLength: 1,
          type: "string",
      },
      author: {
          minLength: 1,
          type: "string",
      },
      etag: {
        minLength: 1,
        type: "string",
      },
      category: {
        minLength: 1,
        type: "string",
      },
      price: {
        type: "number",
      },
      description: {
        type: "string",
      }
  },
  required: ["name", "author" , "etag", "category", "price"],
  type: "object",
};
