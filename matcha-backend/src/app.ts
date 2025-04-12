import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler";
import rootRoute from "./routes/rootRoute";

// func to create app is created for automated testing using supertest
const appfunc = () => {
  const app: Express = express();
  // use of helmet to secure the server
  app.use(helmet());

  // set public folder for static content
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  // setup routes here
  app.use("/api", rootRoute);

  // setup error handler
  app.use(errorHandler);

  return app;
}

export default appfunc;