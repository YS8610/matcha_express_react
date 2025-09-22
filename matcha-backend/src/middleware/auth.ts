import { NextFunction } from "express";
import { Request, Response } from "express-serve-static-core";
import { verifyToken } from "../service/jwtSvc";
import { Reslocal } from "../model/profile";
import { AuthToken } from "../model/token";


declare module 'express-serve-static-core' {
  interface Locals extends Reslocal {}
}

export const authMiddleware = async (req: Request<{}, {}, {}, { authorization?: string }>, res: Response<{msg:string}>, next: NextFunction) => {
  // console.log("authMiddleware called " + req.path);
  if (!req.headers.authorization || req.headers.authorization.startsWith("Bearer ") === false) {
    res.status(401).json({
      msg: "unauthorised. You need to be authenticated to access this resource",
    });
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = await verifyToken(token?? "");
  if (!decodedToken || typeof decodedToken === "string") {
    res.status(401).json({
      msg: "unauthorised. You need to be authenticated to access this resource",
    });
    return;
  }
  const { id, email, username, activated } = decodedToken as AuthToken;
  if (!activated){
    res.status(403).json({
      msg: "forbidden. You need to activate your account to access this resource",
    });
    return;
  }
  if (!email || !username) {
    res.status(401).json({
      msg: "unauthorised. You need to be authenticated to access this resource",
    });
    return;
  }
  res.locals.activated = activated;
  res.locals.authenticated = true;
  res.locals.id = id;
  res.locals.username = username;
  next();
}