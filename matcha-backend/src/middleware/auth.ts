import { NextFunction } from "express";
import { Request, Response } from "express-serve-static-core";
import { verifyToken } from "../service/jwtSvc.js";
import { Reslocal } from "../model/profile.js";
import { AuthToken } from "../model/token.js";
import { ResMsg } from "../model/Response.js";
import { ExtendedError, Socket } from "socket.io";


declare module 'express-serve-static-core' {
  interface Locals extends Reslocal {}
}

export const authMiddleware = async (req: Request<{}, {}, {}, { authorization?: string }>, res: Response<ResMsg>, next: NextFunction) => {
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

export const authWSmiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  if (!token) 
    return next(new Error("Authentication error"));
  verifyToken(token)
    .then((decoded) => {
      socket.user = decoded as AuthToken;
      next();
    })
    .catch((err: unknown) => {
      next(new Error("Authentication failed"));
    });
};