import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileUpdateJson, Reslocal } from "../../model/profile.js";
import { getHashedPwById, isPwValid, isValidDateStr, setPwById, setUserProfileById } from "../../service/userSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { hashPW, verifyPW } from "../../service/authSvc.js";
import { createTag, deleteTagbyUserId, getTagCountById, getTagsById, setTagbyUserId } from "../../service/tagSvc.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import ConstMatcha from "../../ConstMatcha.js";


let router = express.Router();

router.put("/profile", async (req: Request<{}, {}, ProfileUpdateJson>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { firstName, lastName, email, gender, sexualPreference, biography, birthDate } = req.body;
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  if (!isValidDateStr(birthDate)) {
    return next(new BadRequestError({
      code: 400,
      message: "Invalid birthDate format. Expected format: YYYY-MM-DD",
      logging: false,
      context: { birthDate: "invalid" }
    }));
  }
  try {
    await setUserProfileById(id, { firstName, lastName, email, gender, sexualPreference, biography, birthDate });
  } catch (error) {
    res.status(500).json({ msg: "Error updating profile" });
    return;
  }
  res.status(200).json({ msg: "profile updated" });
});

router.put("/password", async (req: Request<{}, {}, { oldPassword: string, pw: string, pw2: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { oldPassword, pw, pw2 } = req.body;
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  if (pw !== pw2) {
    return next(new BadRequestError({
      code: 400,
      message: "New password and confirmation password do not match",
      logging: false,
      context: { pw: "mismatch", confirmationPassword: "mismatch" }
    }));
  }
  if (oldPassword === pw) {
    return next(new BadRequestError({
      code: 400,
      message: "New password must be different from old password",
      logging: false,
      context: { oldPassword: "same", pw: "same" }
    }));
  }
  if (!isPwValid(pw)) {
    return next(new BadRequestError({
      code: 400,
      message: "Invalid/insecure password format",
      logging: false,
      context: { pw: "invalid/insecure" }
    }));
  }
  const hashedpw = await getHashedPwById(id);
  const isMatch = await verifyPW(hashedpw, oldPassword);
  if (!isMatch) {
    return next(new BadRequestError({
      code: 400,
      message: "Old password is incorrect",
      logging: false,
      context: { oldPassword: "incorrect" }
    }));
  }
  try {
    const newHashedPw = await hashPW(pw);
    // Call a service to change the password
    await setPwById(id, newHashedPw);
  } catch (error) {
    res.status(500).json({ msg: "Error updating password" });
    return;
  }
  res.status(200).json({ msg: "Password updated successfully" });
});

router.get("/tags", async (req: Request, res: Response<{ tags: string[] }>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const tags = await serverErrorWrapper(()=>getTagsById(id), "Error getting tags for user");
  res.status(200).json({ tags });
});

router.post("/tag", async (req: Request<{}, {}, { tagName: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
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
  if (tagCount > ConstMatcha.NEO4j_USER_MAX_TAGS) {
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

router.delete("/tag", async (req: Request<{}, {}, { tagName: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
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