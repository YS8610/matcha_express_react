import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileGetJson, ProfilePutJson, Reslocal } from "../../model/profile.js";
import { getUserProfileById, isValidDateStr, setUserProfileById } from "../../service/userSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { ResMsg } from "../../model/Response.js";

let router = express.Router();

// Get user profile
router.get("/", async (req: Request, res: Response<ProfileGetJson>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const profile = await serverErrorWrapper(() => getUserProfileById(id), "Error getting user profile");
  if (!profile)
    return next(new BadRequestError({
      code: 400,
      message: "User profile not found",
      logging: false,
      context: { id: "not_found" }
    }));
  const profileResponse: ProfileGetJson = {
    id: profile.id,
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    gender: profile.gender ?? -1,
    sexualPreference: profile.sexualPreference ?? -1,
    biography: profile.biography ?? "",
    birthDate: profile.birthDate,
    fameRating: profile.fameRating ?? 0,
    photo0: profile.photo0 ?? "",
    photo1: profile.photo1 ?? "",
    photo2: profile.photo2 ?? "",
    photo3: profile.photo3 ?? "",
    photo4: profile.photo4 ?? "",
  };
  res.status(200).json(profileResponse);
});

// Update user profile
router.put("/", async (req: Request<{}, {}, ProfilePutJson>, res: Response<ResMsg>, next: NextFunction) => {
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

export default router;