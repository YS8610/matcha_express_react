import { sign, verify } from "jsonwebtoken";
import ConstMatcha from "../ConstMatcha";
import BadRequestError from "../errors/BadRequestError";
import ServerRequestError from "../errors/ServerRequestError";

export const createToken = (id: string, email: string, username: string, activated: boolean = false): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token = sign(
      { id, email, username, activated },
      ConstMatcha.JWT_SECRET,
      { algorithm: "HS512", expiresIn: ConstMatcha.JWT_EXPIRY },
      (err, token) => {
        if (err || !token)
          return reject(new ServerRequestError({
            message: "failed to create token",
            code: 500,
            logging: true,
            context: { message: "Failed to create JWT token" },
          }));
        resolve(token);
      });
  });
};

export const verifyToken = (token: string): Promise<string | object> => {
  return new Promise((resolve, reject) => {
    verify(token, ConstMatcha.JWT_SECRET, { algorithms: ["HS512"] }, (err, decoded) => {
      if (err || !decoded)
        return reject(new BadRequestError({
          message: "invalid token",
          logging: false,
          code: 401,
          context: { message: "Invalid token. Please log in again." },
        }));
      resolve(decoded);
    });
  });
}

export const createPWResetToken = (id:string, email: string, username: string, hashedpw:string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token = sign(
      { id, email, username },
      hashedpw, 
      { algorithm: "HS512", expiresIn: "1h" },
      (err, token) => {
        if (err || !token)
          return reject(new ServerRequestError({
            message: "failed to create password reset token",
            code: 500,
            logging: true,
            context: { message: "Failed to create JWT password reset token" },
          }));
        resolve(token);
      });
  });
};

export const verifyPWResetToken = (token: string, hashedpw:string): Promise<string | object> => {
  return new Promise((resolve, reject) => {
    verify(token, hashedpw, { algorithms: ["HS512"] }, (err, decoded) => {
      if (err || !decoded)
        return reject(new BadRequestError({
          message: "invalid password reset token",
          logging: false,
          code: 401,
          context: { message: "Invalid password reset token. Please request a new password reset." },
        }));
      resolve(decoded);
    });
  });
}