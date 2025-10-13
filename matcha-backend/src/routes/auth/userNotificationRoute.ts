import express, { Express, NextFunction, Request, Response } from "express";
import { Reslocal } from "../../model/profile.js";
import { deleteNotificationByUserID, getNotificationByUserID } from "../../service/notificationSvc.js";
import { Notification_Matcha } from "../../model/notification.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { ResMsg } from "../../model/Response.js";


let router = express.Router();

router.get("/", async (req: Request<{},{},{}, {limit:string, offset:string}>, res: Response<Notification_Matcha[]>, next: NextFunction) => {
  // Get notifications for the user
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { limit = "20", offset = "0" } = req.query;
  const lim = parseInt(limit as string, 10);
  const off = parseInt(offset as string, 10);
  const notifications = await serverErrorWrapper(() => getNotificationByUserID(id, lim, off), "failed to get notifications for user");
  res.status(200).json(notifications);
});


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
  // todo: mark notification as read
  res.status(200).json({ msg: "notification marked as read" });
});

export default router;