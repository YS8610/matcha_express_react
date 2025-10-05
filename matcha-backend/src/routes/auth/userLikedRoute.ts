import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileShort, Reslocal } from "../../model/profile.js";
import { ResMsg } from "../../model/Response.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { isUserExistsById } from "../../service/userSvc.js";
import { addLiked, getLikedById, removeLiked } from "../../service/likeSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { addViewed } from "../../service/viewedSvc.js";

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
      fameRating: profile.fameRating
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
  await serverErrorWrapper(() => addLiked(id, userid), "Error liking user");
  await serverErrorWrapper(() => addViewed(id, userid), "Error viewing user");
  // todo: if they also liked you, it's a match! notify both users
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
  res.status(200).json({ msg: "unliked" });
});

export default router;
