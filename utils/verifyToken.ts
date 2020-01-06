import { verify } from "jsonwebtoken";

export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.SHA256_PASSWORD_SALT, (err: Error, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
