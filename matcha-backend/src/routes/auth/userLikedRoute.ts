import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileShort, Reslocal } from "../../model/profile.js";
import { ResMsg } from "../../model/Response.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { isUserExistsById } from "../../service/userSvc.js";
import { addLiked, getLikedById, getMatchedUsersShortProfile, isLiked, isMatch, removeLiked } from "../../service/likeSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { addViewed } from "../../service/viewedSvc.js";
import { notifyUser } from "../../service/notificationSvc.js";
import ConstMatcha, { NOTIFICATION_TYPE } from "../../ConstMatcha.js";
import { v4 as uuidv4 } from "uuid";
import { updateFameRating } from "../../service/fameSvc.js";

let router = express.Router();

// get a list of user who liked the authenticated user
router.get("/by", async (req: Request, res: Response<{ data: ProfileShort[] }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const profiles = await serverErrorWrapper(() => getLikedById(id), "Error getting users who liked you");
  const profileforSending : ProfileShort[] = [];
  for (const profile of profiles)
    profileforSending.push({
      id: profile.id,
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      photo0: profile.photo0,
      fameRating: profile.fameRating,
      lastOnline: profile.lastOnline,
    });
  res.status(200).json({ data : profileforSending });
});

// like another user
router.post("/", async (req: Request<{},{},{userid:string}>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { userid } = req.body;
  if (!userid)
    return next( new BadRequestError({
      code: 400,
      message: "userid is required",
      logging: false,
      context: { userid: "missing" }
    }));
  if (userid === id)
    return next( new BadRequestError({
      code: 400,
      message: "you cannot like yourself",
      logging: false,
      context: { userid: "self_like" }
    }));
  const isUser = await serverErrorWrapper(() => isUserExistsById(userid), "Error checking if user exists");
  if (!isUser)
    return next( new BadRequestError({
      code: 404,
      message: "user not found",
      logging: false,
      context: { userid: "not_found" }
    }));
  const isAlreadyLiked = await serverErrorWrapper(() => isLiked(id, userid), "Error checking if user already liked");
  if (isAlreadyLiked)
    return next( new BadRequestError({
      code: 400,
      message: "you have already liked this user",
      logging: false,
      context: { userid: "already_liked" }
    }));
  await serverErrorWrapper(() => addLiked(id, userid), "Error liking user");
  await serverErrorWrapper(() => addViewed(id, userid), "Error viewing user");
  await updateFameRating(userid, ConstMatcha.NEO4j_FAME_INCREMENT_LIKE);
  await serverErrorWrapper(() => notifyUser({
    userId: userid,
    type: NOTIFICATION_TYPE.LIKE,
    message: `${username} has liked you`,
    createdAt: Date.now(),
    id: uuidv4(),
    read: false
  }), "Failed to send profile like notification");
  const matched = await serverErrorWrapper(() => isMatch(userid, id), "Error checking for match");
  if (matched) {
    // notify the other users of the match
    await serverErrorWrapper(() => notifyUser({
      userId: userid,
      type: NOTIFICATION_TYPE.MATCH,
      message: `${username} and you have liked each other`,
      createdAt: Date.now(),
      id: uuidv4(),
      read: false
    }), "Failed to send profile match notification");
    // notify the authenticated user of the match
    await serverErrorWrapper(() => notifyUser({
      userId: id,
      type: NOTIFICATION_TYPE.MATCH,
      message: `You have just matched!`,
      createdAt: Date.now(),
      id: uuidv4(),
      read: false
    }), "Failed to send profile match notification");
  }
  res.status(201).json({ msg: "liked" });
});

// unlike another user
router.delete("/", async (req: Request<{},{},{userid:string}>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { userid } = req.body;
  if (!userid)
    return next(new BadRequestError({
      code: 400,
      message: "userid is required",
      logging: false,
      context: { userid: "missing" }
    }));
  if (userid === id)
    return next(new BadRequestError({
      code: 400,
      message: "you cannot unlike yourself",
      logging: false,
      context: { userid: "self_unlike" }
    }));
  const isUser = await serverErrorWrapper(() => isUserExistsById(userid), "Error checking if user exists");
  if (!isUser)
    return next(new BadRequestError({
      code: 404,
      message: "user not found",
      logging: false,
      context: { userid: "not_found" }
    }));
  await serverErrorWrapper(() => removeLiked(id, userid), "Error unliking user");
  await updateFameRating(userid, ConstMatcha.NEO4j_FAME_DECREMENT_UNLIKE);
  await serverErrorWrapper(() => notifyUser({
    userId: userid,
    type: NOTIFICATION_TYPE.UNLIKE,
    message: `${username} has unliked you`,
    createdAt: Date.now(),
    id: uuidv4(),
    read: false
  }), "Failed to send profile unlike notification");
  res.status(200).json({ msg: "unliked" });
});

router.get("/matched", async (req: Request, res: Response<{ data: ProfileShort[] }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const profiles = await serverErrorWrapper(() => getMatchedUsersShortProfile(id), "Error getting matched users");
  res.status(200).json({ data: profiles });
});

export default router;
