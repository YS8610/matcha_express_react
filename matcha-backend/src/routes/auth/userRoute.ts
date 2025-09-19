import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileUpdateJson, Reslocal } from "../../model/profile";
import { isValidDateStr, setUserProfileById } from "../../service/userSvc";
import BadRequestError from "../../errors/BadRequestError";


let router = express.Router();

router.put("/profile", async (req: Request<{}, {}, ProfileUpdateJson>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { firstName, lastName, email, gender, sexualPreference, biography, birthDate } = req.body;
  const { authenticated, username, id = "24767122-cd81-43c2-ab57-908a19e36cb5", activated } = res.locals as Reslocal;
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