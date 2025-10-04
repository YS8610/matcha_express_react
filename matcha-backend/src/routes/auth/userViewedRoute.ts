import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileViewed, Reslocal } from "../../model/profile.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { isUserExistsById } from "../../service/userSvc.js";
import { addViewed, getViewedById, getVisitedById } from "../../service/viewedSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";


let router = express.Router();

// get list of users viewed by the authenticated user
router.get("/", async (req: Request, res: Response<{ data: ProfileViewed[] }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const viewedUsers = await serverErrorWrapper(() => getVisitedById(id), "Failed to get viewed users");
  const viewedUsernames: ProfileViewed[] = []
  for (const user of viewedUsers)
    viewedUsernames.push({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photo0: user.photo0
    });
  res.status(200).json({ data: viewedUsernames });
});

// get list of users who viewed the authenticated user
router.get("/by", async (req: Request, res: Response<{ data: ProfileViewed[] }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const viewedByUser = await serverErrorWrapper(() => getViewedById(id), "Failed to get users who viewed you");
  const viewedByUsernames: ProfileViewed[] = []
  for (const user of viewedByUser)
    viewedByUsernames.push({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photo0: user.photo0
    });
  res.status(200).json({ data: viewedByUsernames });
});

// record that the authenticated user has viewed another user
router.post("/", async (req: Request<{}, {}, { viewedUserID: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { viewedUserID } = req.body;
  if (!viewedUserID)
    return next(new BadRequestError({
      code: 400,
      message: "viewedUserID is required",
      logging: false,
      context: { viewedUserID: "missing" }
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
  await serverErrorWrapper(() => addViewed(id, viewedUserID), "Failed to record viewed user");
  res.status(201).json({ msg: `view recorded` });
});

export default router;


