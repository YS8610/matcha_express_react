import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileUpdateJson, Reslocal } from "../../model/profile";
import { getHashedPwById, isPwValid, isValidDateStr, setPwById, setUserProfileById } from "../../service/userSvc";
import BadRequestError from "../../errors/BadRequestError";
import { hashPW, verifyPW } from "../../service/authSvc";


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

router.put("/password", async (req: Request<{}, {}, { oldPassword: string, pw: string, pw2: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { oldPassword, pw, pw2 } = req.body;
  const { authenticated, username, id = "24767122-cd81-43c2-ab57-908a19e36cb5", activated } = res.locals as Reslocal;
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

export default router;