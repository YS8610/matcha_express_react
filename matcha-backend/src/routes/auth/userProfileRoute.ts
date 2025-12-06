import express, { Express, NextFunction, Request, Response } from "express";
import { ProfilePutJson, Reslocal, UserProfileResponse } from "../../model/profile.js";
import { getUserProfileById, isValidProfile, setUserProfileById } from "../../service/userSvc.js";
import { getUserLocation } from "../../service/locationSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { ResMsg } from "../../model/Response.js";

let router = express.Router();

// Get user profile
router.get("/", async (req: Request, res: Response<any>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const profile = await serverErrorWrapper(() => getUserProfileById(id), "Error getting user profile");
  if (!profile)
    return next(new BadRequestError({
      code: 400,
      message: "User profile not found",
      logging: false,
      context: { id: "not_found" }
    }));

  const location = await serverErrorWrapper(() => getUserLocation(id), "Error getting user location");
  const profileResponse: UserProfileResponse = {
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
    lastOnline: profile.lastOnline ?? Date.now(),
  };

  if (location) {
    profileResponse.latitude = location.latitude;
    profileResponse.longitude = location.longitude;
  }

  res.status(200).json(profileResponse);
});

// Update user profile
router.put("/", async (req: Request<{}, {}, ProfilePutJson>, res: Response<ResMsg>, next: NextFunction) => {
  const { firstName, lastName, email, gender, sexualPreference, biography, birthDate } = req.body;
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const errorMask = isValidProfile({ firstName, lastName, email, gender, sexualPreference, biography, birthDate });
  if (errorMask !== 0)
    return next(new BadRequestError({
      code: 400,
      message: "Profile validation failed",
      logging: false,
      context: {
        firstName : (errorMask & 1) ? "invalid. should be string of length between 2 and 50" : "valid",
        lastName : (errorMask & 2) ? "invalid. should be string of length between 2 and 50" : "valid",
        email : (errorMask & (1<<2)) ? "invalid" : "valid",
        biography : (errorMask & (1<<3)) ? "invalid. should be string of length between 5 and 500" : "valid",
        birthDate : (errorMask & (1<<4)) ? "Invalid birthDate format. Expected format: YYYY-MM-DD" : "valid",
        gender : (errorMask & (1<<5)) ? "invalid. should be number between 1 and 3" : "valid",
        sexualPreference : (errorMask & (1<<6)) ? "invalid. should be number between 1 and 3" : "valid"
      }
    }));
  await serverErrorWrapper(() => setUserProfileById(id, { firstName, lastName, email, gender, sexualPreference, biography, birthDate }), "Error updating profile");
  res.status(200).json({ msg: "profile updated" });
});

export default router;