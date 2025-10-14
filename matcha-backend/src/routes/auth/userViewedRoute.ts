import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileShort, Reslocal } from "../../model/profile.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { getShortProfileById, getUserProfileById, isUserExistsById } from "../../service/userSvc.js";
import { addViewed, getViewedById, getVisitedById, isViewed } from "../../service/viewedSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { ResMsg } from "../../model/Response.js";
import { notifyUser } from "../../service/notificationSvc.js";
import { v4 as uuidv4 } from "uuid";
import ConstMatcha from "../../ConstMatcha.js";
import { getBlockedRel } from "../../service/blockSvc.js";

let router = express.Router();

// get list of users viewed by the authenticated user
router.get("/", async (req: Request, res: Response<{ data: ProfileShort[] }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const viewedUsers = await serverErrorWrapper(() => getVisitedById(id), "Failed to get viewed users");
  res.status(200).json({ data: viewedUsers });
});

// get list of users who viewed the authenticated user
router.get("/by", async (req: Request, res: Response<{ data: ProfileShort[] }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const viewedByUser = await serverErrorWrapper(() => getViewedById(id), "Failed to get users who viewed you");
  res.status(200).json({ data: viewedByUser });
});

// record that the authenticated user has viewed another user
router.post("/", async (req: Request<{}, {}, { viewedUserID: string }>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { viewedUserID } = req.body;
  if (!viewedUserID)
    return next(new BadRequestError({
      code: 400,
      message: "viewedUserID is required",
      logging: false,
      context: {
        viewedUserID: !viewedUserID ? "missing" : "present"
      }
    }));
  if (viewedUserID === id)
    return next(new BadRequestError({
      code: 400,
      message: "Cannot view yourself",
      logging: false,
      context: { viewedUserID: "self_view" }
    }));
  const isUser = await serverErrorWrapper(() => isUserExistsById(viewedUserID), "Failed to check if user exists");
  if (!isUser)
    return next(new BadRequestError({
      code: 404,
      message: "Viewed user does not exist",
      logging: false,
      context: { viewedUserID: "not_found" }
    }));
  const isBlocked = await serverErrorWrapper(() => getBlockedRel(id, viewedUserID), "Error checking if user is blocked");
  if (isBlocked)
    return next(new BadRequestError({
      code: 403,
      message: "User is blocked or being blocked",
      logging: false,
      context: { userId: "blocked or being blocked" }
    }));
  const alreadyViewed = await serverErrorWrapper(() => isViewed(id, viewedUserID), "Failed to check if already viewed");
  if (alreadyViewed)
    return next(new BadRequestError({
      code: 400,
      message: "User has already been viewed",
      logging: false,
      context: { viewedUserID: "already_viewed" }
    }));
  await serverErrorWrapper(() => addViewed(id, viewedUserID), "Failed to record viewed user");
  await serverErrorWrapper(() => notifyUser({
    userId: viewedUserID,
    type: ConstMatcha.NOTIFICATION_TYPE_PROFILE_VIEW,
    message: `${username} has viewed your profile`,
    createdAt: Date.now(),
    id: uuidv4(),
    read: false
  }), "Failed to send profile view notification");
  res.status(201).json({ msg: `view recorded` });
});

export default router;


