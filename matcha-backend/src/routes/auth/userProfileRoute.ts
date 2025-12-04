import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileGetJson, ProfilePutJson, Reslocal } from "../../model/profile.js";
import { getUserProfileById, isValidDateStr, isValidEmail, setUserProfileById } from "../../service/userSvc.js";
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

  const profileResponse: any = {
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
  if (!isValidDateStr(birthDate)) {
    return next(new BadRequestError({
      code: 400,
      message: "Invalid birthDate format. Expected format: YYYY-MM-DD",
      logging: false,
      context: { birthDate: "invalid" }
    }));
  }
  if (!firstName || firstName.trim() === "" ||
  !lastName || lastName.trim() === "" ||
  !email || !isValidEmail(email.trim()) ||
  !gender || typeof gender !== "number" ||
  !sexualPreference || typeof sexualPreference !== "number" ||
  !biography || biography.trim().length <= 5 ||
  !birthDate)
    return next(new BadRequestError({
      code: 400,
      message: "All profile fields are required and must be valid",
      logging: false,
      context: {
        firstName: !firstName || firstName.trim() === "" ? "missing or invalid" : "provided",
        lastName: !lastName || lastName.trim() === "" ? "missing or invalid" : "provided",
        email: !email || !isValidEmail(email) ? "missing or invalid" : "provided",
        gender: (!gender || typeof gender !== "number") ? "missing or invalid" : "provided",
        sexualPreference: !sexualPreference || typeof sexualPreference !== "number" ? "missing or invalid" : "provided",
        biography: !biography || biography.trim().length <= 5 ? "missing or must be longer than 5 characters" : "provided",
        birthDate: !birthDate ? "missing or invalid" : "provided"
      }
    }));



  await serverErrorWrapper(() => setUserProfileById(id, { firstName, lastName, email, gender, sexualPreference, biography, birthDate }), "Error updating profile");
  res.status(200).json({ msg: "profile updated" });
});

export default router;