import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileGetJson, ProfileShort, Reslocal } from "../../model/profile.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { getBlockedRel } from "../../service/blockSvc.js";
import { getShortProfileById, getUserProfileById } from "../../service/userSvc.js";

let router = express.Router();

// get other user's short profile by id
router.get("/short/:userId", async (req: Request<{ userId: string }>, res: Response<ProfileShort>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const userId = req.params.userId;
  if (!userId) 
    return next(new BadRequestError({
      code: 400,
      message: "User ID is required",
      logging: false,
      context: { userId: "missing" }
    }));
  const isBlocked = await serverErrorWrapper(() => getBlockedRel(id, userId), "Error checking if user is blocked");
  if (isBlocked) 
    return next(new BadRequestError({
      code: 403,
      message: "User is blocked",
      logging: false,
      context: { userId: "blocked" }
    }));
  const profile = await serverErrorWrapper(() => getShortProfileById(userId), "Error getting user profile");
  if (!profile)
    return next(new BadRequestError({
      code: 400,
      message: "User profile not found",
      logging: false,
      context: { id: "not_found" }
    }));
  res.status(200).json(profile);
});

// get other user's full profile by id
router.get("/:userId", async (req: Request<{ userId: string }>, res: Response<ProfileGetJson>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const userId = req.params.userId;
  if (!userId) 
    return next(new BadRequestError({
      code: 400,
      message: "User ID is required",
      logging: false,
      context: { userId: "missing" }
    }));
  const isBlocked = await serverErrorWrapper(() => getBlockedRel(id, userId), "Error checking if user blocked or is blocked");
  if (isBlocked) 
    return next(new BadRequestError({
      code: 403,
      message: "User is blocked",
      logging: false,
      context: { userId: "blocked" }
    }));
  const profile = await serverErrorWrapper(() => getUserProfileById(userId), "Error getting user profile");
  if (!profile)
    return next(new BadRequestError({
      code: 400,
      message: "User profile not found",
      logging: false,
      context: { id: "not_found" }
    }));
  res.status(200).json(profile);
});

export default router;