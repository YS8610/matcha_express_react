import express, { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/BadRequestError.js";
import { ProfileRegJson } from "../model/profile.js";
import { activateUserByUsername, createUser, getHashedPwById, getHashedPwByUsername, getUserIdByUsername, isPwValid, isUserByEmail, isUserByEmailUsername, isUserByUsername, isValidDateStr, setPwById } from "../service/userSvc.js";
import { hashPW, loginSvc } from "../service/authSvc.js";
import { createPWResetToken, createToken, verifyPWResetToken, verifyToken } from "../service/jwtSvc.js";
import { AuthToken, token } from "../model/token.js";
import ConstMatcha from "../ConstMatcha.js";
import { serverErrorWrapper } from "../util/wrapper.js";
import { v4 as uuidv4 } from "uuid";
import upload from "../middleware/uploadMulter.js";
import { ResMsg } from "../model/Response.js";
import { getAproximateUserLocation, updateUserLocation } from "../service/locationSvc.js";
import { sendMail } from "../service/emailSvc.js";

let router = express.Router();

// testing fileupload. will be removed later
// router.post("/ping", upload.single("photo"), async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
//   console.log("In rootRoute POST /ping");
//   console.log("File received:", req.file);
//   const photoUrl = req.file?.path;
//   // Logic to add a new photo URL for the user
//   if (!req.file) {
//     return next(new BadRequestError({
//       code: 400,
//       message: "No file uploaded",
//       logging: false,
//       context: { file: "missing" }
//     }));
//   }
//   res.status(201).json({ message: "Photo URL added successfully", photoUrl });
// });

// testing retrieve photo by name. will be removed later
// router.get("/photo/:name", async (req: Request<{ name: string }>, res: Response, next: NextFunction) => {
//   const { name } = req.params;
//   // Logic to get photo URLs by name
//   res.sendFile(`/${ConstMatcha.PHOTO_DUMP_DIR}/` + name, { root: '.' }, (err) => {
//     if (err) {
//       console.error("Error sending file:", err);
//       next(new BadRequestError({
//         message: "file not found",
//         logging: false,
//         code: 404,
//         context: { msg: "The requested file does not exist." },
//       }));
//     }
//   });
// });

// testing purpose
router.get("/ping", async (req: Request, res: Response<ResMsg>) => {
  res.status(200).json({ msg: "pong" });
});

// login using username and password, return jwt token if successful
router.post("/login", async (req: Request<{}, {}, { username: string, password: string }>, res: Response<ResMsg>, next: NextFunction) => {
  if (!req.body)
    return next(new BadRequestError({
      code: 400,
      message: "Request body is required",
      logging: false,
      context: { body: "missing" }
    }));
  const { username, password } = req.body;
  if (!username || !password)
    return next(new BadRequestError({
      code: 400,
      message: "username and/or password are required",
      logging: false,
      context: { username: !username ? "missing" : "present", password: !password ? "missing" : "present" }
    }));
  const jwt = await loginSvc(username, password);
  if (jwt.length === 0)
    return next(new BadRequestError({
      code: 401,
      message: "Invalid username and/or password",
      logging: true,
      context: { username: "invalid", password: "invalid" }
    }));
  res.status(200).json({ msg: jwt });
});

// user registration
router.post("/register", async (req: Request<{}, {}, ProfileRegJson>, res: Response<ResMsg>, next: NextFunction) => {
  if (!req.body)
    return next(new BadRequestError({
      code: 400,
      message: "Request body is required",
      logging: false,
      context: { body: "missing" }
    }));
  const { email, pw, pw2, firstName, lastName, username, birthDate } = req.body;
  if (!email || !pw || !pw2 || !firstName || !lastName || !username || !birthDate)
    return next(new BadRequestError({
      code: 400,
      message: "Email, passwords, first name, last name, birthDate, and/or username are required",
      logging: false,
      context: {
        email: !email ? "missing" : "present",
        pw: !pw ? "missing" : "present",
        pw2: !pw2 ? "missing" : "present",
        firstName: !firstName ? "missing" : "present",
        lastName: !lastName ? "missing" : "present",
        birthDate: !birthDate ? "missing" : "present",
        username: !username ? "missing" : "present"
      }
    }));
  if (pw !== pw2)
    return next(new BadRequestError({
      code: 400,
      message: "Passwords do not match",
      logging: false,
      context: { pw: "mismatch" }
    }));
  const bitPWValid = isPwValid(pw);
  if (bitPWValid != 0)
    return next(new BadRequestError({
      code: 400,
      message: "Password does not meet complexity requirements",
      logging: false,
      context: {
        "min 8 char": (bitPWValid & 1) > 0 ? "missing" : "present",
        "upper case": (bitPWValid & 2) > 0 ? "missing" : "present",
        "lower case": (bitPWValid & 4) > 0 ? "missing" : "present",
        "number": (bitPWValid & 8) > 0 ? "missing" : "present",
        "special char": (bitPWValid & 16) > 0 ? "missing" : "present"
      }
    }));
  if (!isValidDateStr(birthDate))
    return next(new BadRequestError({
      code: 400,
      message: "Invalid birthDate format. Expected format: YYYY-MM-DD",
      logging: false,
      context: { birthDate: "invalid" }
    }));
  if ((new Date(birthDate)).getFullYear() > (new Date()).getFullYear() - 18)
    return next(new BadRequestError({
      code: 400,
      message: "User must be at least 18 years old.",
      logging: false,
      context: { birthDate: "too young" }
    }));
  const emailExists = await serverErrorWrapper(() => isUserByEmail(email), "Failed to check if email exists");
  let mask = emailExists ? 1 : 0;
  const userExists = await serverErrorWrapper(() => isUserByUsername(username), "Failed to check if user exists");
  mask |= userExists ? 2 : 0;
  if (mask != 0)
    return next(new BadRequestError({
      code: 409,
      message: "Email/username is already registered",
      logging: false,
      context: { email: mask & 1 ? "registered by someone" : "available", username: mask & 2 ? "registered by someone" : "available" }
    }));
  const hashedpw = await serverErrorWrapper(() => hashPW(pw), "Failed to hash password");
  const id = uuidv4();
  await serverErrorWrapper(() => createUser(id, email, hashedpw, firstName, lastName, username, birthDate, Date.now()), "Failed to create user");
  const token = await createToken(id, email, username, false);
  console.log("this is activation link " + `http://localhost:${process.env.PORT || ConstMatcha.DEFAULT_PORT}/pubapi/activate/${token}`);
  await serverErrorWrapper(() => {
    sendMail(
      ConstMatcha.MAIL_FROM,
      email,
      ConstMatcha.EMAIL_VERIFICATION_SUBJECT,
      // jegoh, i want to remove pubapi
      `Please click the following link to activate your account: ${ConstMatcha.DOMAIN_NAME}:${ConstMatcha.DOMAIN_FE_PORT}/activate/${token}`
    );
  }, "Failed to send activation email");
  res.status(201).json({ msg: "registered and activation email sent to " + email });
});

// activating user account from email link
router.get("/activate/:token", async (req: Request<{ token: string }, {}, {}, {}>, res: Response<ResMsg>, next: NextFunction) => {
  const { token } = req.params;
  if (!token) {
    res.status(400).json({ msg: "Token is required" });
    return;
  }
  const decodedToken = await verifyToken(token);
  console.log("this is decoded token " + JSON.stringify(decodedToken));
  if (!decodedToken || typeof decodedToken === "string") {
    res.status(400).json({ msg: "Invalid token" });
    return;
  }
  const { id, email, username, activated } = decodedToken as AuthToken;
  if (!id || !email || !username || activated === undefined) {
    res.status(400).json({ msg: "Invalid token" });
    return;
  }
  if (activated) {
    res.status(200).json({ msg: token });
    return;
  }
  const isActivated = await serverErrorWrapper(() => activateUserByUsername(username), "Failed to activate user");
  if (!isActivated) {
    res.status(400).json({ msg: "Failed to activate account. Please contact support." });
    return;
  }
  const activatedtoken = await createToken(id, email, username, true);
  const loc = await getAproximateUserLocation(req.ip || "");
  await serverErrorWrapper(() => updateUserLocation(id, username, loc?.latitude || 0, loc?.longitude || 0), "Failed to update user location");
  res.status(200).json({ msg: activatedtoken });
});

// password reset request
router.post("/reset-password", async (req: Request<{}, {}, { email: string, username: string }>, res: Response<ResMsg>, next: NextFunction) => {
  if (!req.body)
    return next(new BadRequestError({
      code: 400,
      message: "Request body is required",
      logging: false,
      context: { body: "missing" }
    }));
  const { email, username } = req.body;
  if (!email || !username)
    return next(new BadRequestError({
      code: 400,
      message: "Email and username are required",
      logging: false,
      context: { username: !username ? "missing" : "present", email: !email ? "missing" : "present" }
    }));
  const userExists = await serverErrorWrapper(() => isUserByEmailUsername(email, username), "Failed to check if user exists");
  if (!userExists)
    return next(new BadRequestError({
      code: 400,
      message: "No user found with the provided email/username",
      logging: false,
      context: { email_or_Username: "not found" }
    }));
  const userId = await serverErrorWrapper(() => getUserIdByUsername(username), "Failed to get user ID");
  const hashedpw = await serverErrorWrapper(() => getHashedPwByUsername(username), "Failed to get hashed password");
  const pwResetToken = await createPWResetToken(userId, email, username, hashedpw);
  console.log("this is email reset link " + `http://localhost:${process.env.PORT || ConstMatcha.DEFAULT_PORT}/pubapi/reset-password/${userId}/${pwResetToken}`);
  await serverErrorWrapper(() =>
    sendMail(
      ConstMatcha.MAIL_FROM,
      email,
      ConstMatcha.EMAIL_PASSWORD_RESET_SUBJECT,
      // jegoh, i want to remove pubapi
      `Please click the following link to reset your password: ${ConstMatcha.DOMAIN_NAME}:${ConstMatcha.DOMAIN_FE_PORT}/reset-password/${userId}/${pwResetToken}`
    ), "Failed to send password reset email"
  );
  res.status(200).json({ msg: "Password reset email sent" });
});

// password reset using token from email link
router.post("/reset-password/:userId/:token", async (req: Request<{ userId: string, token: string }, {}, { newPassword: string, newPassword2: string }>, res: Response<ResMsg>, next: NextFunction) => {
  if (!req.body)
    return next(new BadRequestError({
      code: 400,
      message: "Request body is required",
      logging: false,
      context: { body: "missing" }
    }));
  const { userId, token } = req.params;
  const { newPassword, newPassword2 } = req.body;
  if (!token || !userId)
    return next(new BadRequestError({
      code: 400,
      message: "Token and/or id are required",
      logging: false,
      context: { token: token ? "present" : "missing", id: userId ? "present" : "missing" }
    }));
  if (!newPassword || !newPassword2)
    return next(new BadRequestError({
      code: 400,
      message: "New passwords are required",
      logging: false,
      context: { newPassword: !newPassword ? "missing" : "present", newPassword2: !newPassword2 ? "missing" : "present" }
    }));
  if (newPassword !== newPassword2)
    return next(new BadRequestError({
      code: 400,
      message: "New passwords do not match",
      logging: false,
      context: { newPassword: "mismatch" }
    }));
  const bitPWValid = isPwValid(newPassword);
  if (bitPWValid != 0)
    return next(new BadRequestError({
      code: 400,
      message: "New password does not meet complexity requirements",
      logging: false,
      context: {
        "min 8 char": (bitPWValid & 1) > 0 ? "missing" : "present",
        "upper case": (bitPWValid & 2) > 0 ? "missing" : "present",
        "lower case": (bitPWValid & 4) > 0 ? "missing" : "present",
        "number": (bitPWValid & 8) > 0 ? "missing" : "present",
        "special char": (bitPWValid & 16) > 0 ? "missing" : "present"
      }
    }));
  const hashedpw = await serverErrorWrapper(() => getHashedPwById(userId), "Failed to get hashed password");
  if (hashedpw.length === 0) {
    return next(new BadRequestError({
      code: 401,
      message: "Invalid id",
      logging: false,
      context: { id: "invalid" }
    }));
  }
  const decodedToken = await verifyPWResetToken(token, hashedpw);
  if (!decodedToken || typeof decodedToken === "string")
    return next(new BadRequestError({
      code: 400,
      message: "Invalid token",
      logging: false,
      context: { token: "invalid" }
    }));
  const { id, email, username } = decodedToken as token;
  if (!id || !email || !username || userId !== id)
    return next(new BadRequestError({
      code: 400,
      message: "Invalid token",
      logging: false,
      context: { token: "invalid" }
    }));
  const hashedNewPw = await serverErrorWrapper(() => hashPW(newPassword), "Failed to hash new password");
  await serverErrorWrapper(() => setPwById(userId, hashedNewPw), "Failed to set new password");
  res.status(200).json({ msg: "Password has been reset successfully. Pls login again with new pw" });
});

export default router;
