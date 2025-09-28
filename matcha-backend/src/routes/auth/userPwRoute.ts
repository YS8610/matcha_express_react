import express, { Express, NextFunction, Request, Response } from "express";
import { Reslocal } from "../../model/profile.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { getHashedPwById, isPwValid, setPwById } from "../../service/userSvc.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { hashPW, verifyPW } from "../../service/authSvc.js";

let router = express.Router();

// Change password for the authenticated user
router.put("/", async (req: Request<{}, {}, { oldPassword: string, pw: string, pw2: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
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
  const isMatch = await serverErrorWrapper(() => verifyPW(hashedpw, oldPassword), "Failed to verify password");
  if (!isMatch) {
    return next(new BadRequestError({
      code: 400,
      message: "Old password is incorrect",
      logging: false,
      context: { oldPassword: "incorrect" }
    }));
  }
  try {
    const newHashedPw = await serverErrorWrapper(() => hashPW(pw), "Failed to hash password");
    // Call a service to change the password
    await setPwById(id, newHashedPw);
  } catch (error) {
    res.status(500).json({ msg: "Error updating password" });
    return;
  }
  res.status(200).json({ msg: "Password updated successfully" });
});

export default router;