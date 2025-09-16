import { sign, verify } from "jsonwebtoken";
import ConstMatcha from "../ConstMatcha";

export const createToken = (id: string, email: string, username: string, activated: boolean = false): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token = sign(
      { id, email, username, activated },
      ConstMatcha.JWT_SECRET,
      { algorithm: "HS512", expiresIn: ConstMatcha.JWT_EXPIRY },
      (err, token) => {
        if (err || !token)
          return reject("failed to create token");
        resolve(token);
      });
  });
};

export const verifyToken = (token: string): Promise<string | object> => {
  return new Promise((resolve, reject) => {
    verify(token, ConstMatcha.JWT_SECRET, { algorithms: ["HS512"] }, (err, decoded) => {
      if (err || !decoded)
        return reject("invalid token");
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
          return reject("failed to create token");
        resolve(token);
      });
  });
};

export const verifyPWResetToken = (token: string, hashedpw:string): Promise<string | object> => {
  return new Promise((resolve, reject) => {
    verify(token, hashedpw, { algorithms: ["HS512"] }, (err, decoded) => {
      if (err || !decoded)
        return reject("invalid token");
      resolve(decoded);
    });
  });
}