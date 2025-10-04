import express, { Express, NextFunction, Request, Response } from "express";
import { Reslocal } from "../../model/profile.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { getHashedPwById, isPwValid, setPwById } from "../../service/userSvc.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { hashPW, verifyPW } from "../../service/authSvc.js";
import { ResMsg } from "../../model/Response.js";

let router = express.Router();

// Change password for the authenticated user
router.put("/", async (req: Request<{}, {}, { oldPassword: string, pw: string, pw2: string }>, res: Response<ResMsg>, next: NextFunction) => {
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
  const bitPWValid = isPwValid(pw);
  if (bitPWValid != 0) {
    return next(new BadRequestError({
      code: 400,
      message: "Invalid/insecure password format",
      logging: false,
      context: {
        "min 8 char": (bitPWValid & 1) > 0? "missing" : "present",
        "upper case": (bitPWValid & 2) > 0? "missing" : "present",
        "lower case": (bitPWValid & 4) > 0? "missing" : "present",
        "number": (bitPWValid & 8) > 0? "missing" : "present",
        "special char": (bitPWValid & 16) > 0? "missing" : "present"
      }
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