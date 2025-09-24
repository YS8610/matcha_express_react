import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import rootRoute from "./routes/rootRoute.js";
import userRoute from "./routes/auth/userRoute.js";
import { authMiddleware } from "./middleware/auth.js";
import BadRequestError from "./errors/BadRequestError.js";

// func to create app is created for automated testing using supertest
const appfunc = () => {
  const app: Express = express();
  // use of helmet to secure the server
  app.use(helmet());

  // set public folder for static content
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  // setup public api routes here
  app.use("/pubapi", rootRoute);
  // auth api routes
  app.use("/api", authMiddleware);
  app.use("/api/user", userRoute);
  app.use("/*", (req, res, next) => {
    next(new BadRequestError({
      message: "invalid endpoint",
      logging: false,
      code: 404,
      context: { message: "The requested endpoint does not exist." },
    }));
  });
  // setup error handler
  app.use(errorHandler);

  return app;
}

export default appfunc;