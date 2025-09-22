import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler";
import rootRoute from "./routes/rootRoute";
import userRoute from "./routes/auth/userRoute";
import { authMiddleware } from "./middleware/auth";

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

  // setup error handler
  app.use(errorHandler);

  return app;
}

export default appfunc;