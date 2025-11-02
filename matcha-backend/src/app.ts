import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import rootRoute from "./routes/rootRoute.js";
import userProfileRoute from "./routes/auth/userProfileRoute.js";
import { authMiddleware } from "./middleware/auth.js";
import BadRequestError from "./errors/BadRequestError.js";
import userTagRoute from "./routes/auth/userTagRoute.js";
import userPwRoute from "./routes/auth/userPwRoute.js";
import userPhotoRoute from "./routes/auth/userPhotoRoute.js";
import photoRoute from "./routes/auth/photoRoute.js";
import userViewedRoute from "./routes/auth/userViewedRoute.js";
import userLikedRoute from "./routes/auth/userLikedRoute.js";
import userBlockRoute from "./routes/auth/userBlockRoute.js";
import userNotificationRoute from "./routes/auth/userNotificationRoute.js";
import userReportRoute from "./routes/auth/userReportRoute.js";
import userLocationRoute from "./routes/auth/userLocationRoute.js";
import profileRoute from "./routes/auth/profileRoute.js";
import userChatRoute from "./routes/auth/userChatRoute.js";

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
  // auth protected api routes
  app.use("/api", authMiddleware);
  app.use("/api/photo", photoRoute);
  app.use("/api/profile", profileRoute);
  app.use("/api/user/profile", userProfileRoute);
  app.use("/api/user/tag", userTagRoute);
  app.use("/api/user/pw", userPwRoute);
  app.use("/api/user/photo", userPhotoRoute);
  app.use("/api/user/viewed", userViewedRoute);
  app.use("/api/user/liked", userLikedRoute);
  app.use("/api/user/block", userBlockRoute);
  app.use("/api/user/chat", userChatRoute);
  app.use("/api/user/notification", userNotificationRoute);
  app.use("/api/user/report", userReportRoute);
  app.use("/api/user/location", userLocationRoute);
  // default route for invalid endpoint
  app.use("/", (req:Request, res:Response, next:NextFunction) => {
    next(new BadRequestError({
      message: "invalid endpoint",
      logging: false,
      code: 404,
      context: { msg : "The requested endpoint does not exist." },
    }));
  });
  // setup error handler
  app.use(errorHandler);

  return app;
}

export default appfunc;