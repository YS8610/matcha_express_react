import { sign, verify } from "jsonwebtoken";
import ConstMatcha from "../ConstMatcha";

export const createToken = (email: string, username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token = sign(
      { email, username },
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

