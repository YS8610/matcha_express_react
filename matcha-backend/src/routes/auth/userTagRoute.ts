import express, { Express, NextFunction, Request, Response } from "express";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { deleteTagbyUserId, getTagCountById, getTagsById, setTagbyUserId } from "../../service/tagSvc.js";
import { Reslocal } from "../../model/profile.js";
import BadRequestError from "../../errors/BadRequestError.js";
import ConstMatcha from "../../ConstMatcha.js";
import { ResMsg } from "../../model/Response.js";

let router = express.Router();

// Get all tags for the authenticated user
router.get("/", async (req: Request, res: Response<{ tags: string[] }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const tags = await serverErrorWrapper(() => getTagsById(id), "Error getting tags for user");
  res.status(200).json({ tags });
});

// Add a new tag for the authenticated user
router.post("/", async (req: Request<{}, {}, { tagName: string }>, res: Response<ResMsg>, next: NextFunction) => {
  if (!req.body)
    return next(new BadRequestError({
      code: 400,
      message: "Request body is missing",
      logging: false,
      context: { body: "missing" }
    }));
  const { tagName } = req.body;
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  if (!tagName || tagName.trim() === "") {
    return next(new BadRequestError({
      code: 400,
      message: "Tag name cannot be empty",
      logging: false,
      context: { tagName: "empty" }
    }));
  }
  const tagCount = await serverErrorWrapper(() => getTagCountById(id), "Error getting tag count for user");
  if (tagCount >= ConstMatcha.NEO4j_USER_MAX_TAGS) {
    return next(new BadRequestError({
      code: 400,
      message: "User has reached the maximum number of tags",
      logging: false,
      context: { tagCount: "exceeded" }
    }));
  }
  // create tag if not exists, and create relationship between user and tag
  await serverErrorWrapper(() => setTagbyUserId(id, tagName), "Error creating tag for user");
  res.status(201).json({ msg: "Tag linked successfully" });
});

// Remove a tag for the authenticated user
router.delete("/", async (req: Request<{}, {}, { tagName: string }>, res: Response<ResMsg>, next: NextFunction) => {
  if (!req.body)
    return next(new BadRequestError({
      code: 400,
      message: "Request body is missing",
      logging: false,
      context: { body: "missing" }
    }));
  const { tagName } = req.body;
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  if (!tagName || tagName.trim() === "") {
    return next(new BadRequestError({
      code: 400,
      message: "Tag name cannot be empty",
      logging: false,
      context: { tagName: "empty" }
    }));
  }
  // delete relationship between user and tag
  await serverErrorWrapper(() => deleteTagbyUserId(id, tagName), "Error deleting tag for user");
  res.status(200).json({ msg: "Tag unlinked successfully" });
});

export default router;