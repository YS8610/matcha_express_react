import express, { Express, NextFunction, Request, Response } from "express";
import { Reslocal } from "../../model/profile.js";
import { deleteNotificationByUserID, getNotificationByUserID, isNotificationExists, markNotificationAsRead } from "../../service/notificationSvc.js";
import { Notification_Matcha } from "../../model/notification.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { ResMsg } from "../../model/Response.js";


let router = express.Router();

// Get notifications for the user
router.get("/", async (req: Request<{},{},{}, {limit:string, offset:string}>, res: Response<Notification_Matcha[]>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { limit = "20", offset = "0" } = req.query;
  const lim = parseInt(limit as string, 10);
  const off = parseInt(offset as string, 10);
  const notifications = await serverErrorWrapper(() => getNotificationByUserID(id, lim, off), "failed to get notifications for user");
  res.status(200).json(notifications);
});

// delete a notification for the user
router.delete("/", async (req: Request<{},{},{notificationId:string}>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { notificationId } = req.body;
  if (!notificationId) 
    return next(new BadRequestError({
      message: "bad request. Missing notificationId in request body",
      code: 400,
      logging: false,
      context: { err: "notificationId is required" }
    }));
  await serverErrorWrapper(() => deleteNotificationByUserID(id, notificationId), "failed to delete notifications for user");
  res.status(200).json({ msg: "notification deleted" });
});

// mark a notification as read
router.put("/", async (req: Request<{},{},{notificationId:string}>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { notificationId } = req.body;
  if (!notificationId) 
    return next(new BadRequestError({
      message: "bad request. Missing notificationId in request body",
      code: 400,
      logging: false,
      context: { err: "notificationId is required" }
    }));
  const isExist = await serverErrorWrapper(()=> isNotificationExists(id, notificationId), "failed to check if notification exists");
  if (!isExist)
    return next(new BadRequestError({
      message: "notification not found",
      code: 404,
      logging: false,
      context: { err: "notification not found" }
    }));
  await serverErrorWrapper(() => markNotificationAsRead(id, notificationId), "failed to mark notification as read");
  res.status(200).json({ msg: "notification marked as read" });
});

export default router;