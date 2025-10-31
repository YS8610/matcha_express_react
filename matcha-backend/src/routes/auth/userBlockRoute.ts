import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileShort, Reslocal } from "../../model/profile.js";
import { deleteBlockedById, getBlockedById, setBlockedById } from "../../service/blockSvc.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { ResMsg } from "../../model/Response.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { getFame, setFame, updateFameRating } from "../../service/fameSvc.js";
import ConstMatcha from "../../ConstMatcha.js";

let router = express.Router();

// get all profile blocked by the authenticated user
router.get("/", async (req: Request, res: Response<{data : ProfileShort[]}>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const blockedUsers = await serverErrorWrapper(() => getBlockedById(id), "Error getting blocked users for user");
  const data: ProfileShort[] = [];
  blockedUsers.forEach(user => {
    data.push({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fameRating: user.fameRating,
      photo0: user.photo0,
      lastOnline: user.lastOnline,
      birthDate: user.birthDate
    });
  });
  res.status(200).json({ data });
});

// block another user
router.post("/", async (req: Request<{}, {}, { userId: string }>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { userId } = req.body;
  if (!userId)
    return next(new BadRequestError({
      message: "userId is required in body",
      logging : false,
      code : 400,
      context : undefined
    }));
  await serverErrorWrapper(() => setBlockedById(id, userId), "Error blocking user");
  await serverErrorWrapper(() => updateFameRating(userId, ConstMatcha.NEO4j_FAME_DECREMENT_BLOCK, getFame, setFame), "Error updating fame rating for blocked user");
  res.status(200).json({ msg: "User blocked successfully" });
});

// unblock another user
router.delete("/", async (req: Request<{}, {}, { userId: string }>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { userId } = req.body;
  if (!userId)
    return next(new BadRequestError({
      message: "userId is required in body",
      logging : false,
      code : 400,
      context : undefined
    }));
  await serverErrorWrapper(() => deleteBlockedById(id, userId), "Error unblocking user");
  await serverErrorWrapper(() => updateFameRating(userId, ConstMatcha.NEO4j_FAME_DECREMENT_UNBLOCK, getFame, setFame), "Error updating fame rating for unblocked user");
  res.status(200).json({ msg: "User unblocked successfully" });
});

export default router;