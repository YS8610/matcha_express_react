import express, { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/BadRequestError";
import { ProfileRegJson } from "../model/profile";
import { activateUserByUsername, createUser, getHashedPwByUsername, isPwValid, isUserByEmailUsername, isUserByUsername, isValidDateStr, setPwByUsername } from "../service/userSvc";
import { hashPW, loginSvc } from "../service/authSvc";
import { createPWResetToken, createToken, verifyPWResetToken, verifyToken } from "../service/jwtSvc";

export let router = express.Router();

// testing purpose
router.get("/ping", async (req: Request, res: Response<{ msg: string }>) => {
  // const session = driver.session();
  // const result = await session.run<{u:{properties:{email:string, pw:string}}}>("CREATE (u:Profile {email:'t2@yahoo.com' ,pw:'123456' }) RETURN u");
  // console.log("this is result0 " + result.records[0].get("u")); // Should log the created user
  // console.log(result.records[0].get("u").properties); // Should log the created user
  // const result2 = await session.run(ConstMatcha.NEO4j_STMT_GET_ALL_USERS);
  // console.log("this is result2 " + result2.records[0].get("u")); // Should log the created user
  // session.close();
  // console.log(result2.records[0].get("u").properties);
  // try {
  //   const token = await createToken("t2@yahoo.com", "testuser");
  //   const decode = await verifyToken(token);
  //   console.log("this is decode " + JSON.stringify(decode));
  //   res.status(200).json({ msg: "pong " + token });

  // } catch (error) {
  //   res.status(500).json({ msg: "failed to create token" });
  // }
  res.status(200).json({ msg: "pong" });
});

// login using username and password, return jwt token if successful
router.post("/login", async (req: Request<{ token: string }, {}, { username: string, password: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new BadRequestError({
      code: 400,
      message: "username and/or password are required",
      logging: false,
      context: { username: !username ? "missing" : "present", password: !password ? "missing" : "present" }
    }));
  }
  try {
    const jwt = await loginSvc(username, password);
    if (jwt.length === 0) {
      return next(new BadRequestError({
        code: 400,
        message: "Invalid username and/or password",
        logging: true,
        context: { username: "invalid", password: "invalid" }
      }));
    }
    res.status(200).json({ msg: jwt });
  } catch (error) {
    return next(error);
  }
});

// user registration
router.post("/register", async (req: Request<{}, {}, ProfileRegJson>, res: Response<{ msg: string }, {}>, next: NextFunction) => {
  const { email, pw, pw2, firstName, lastName, username, birthDate } = req.body;
  if (!email || !pw || !pw2 || !firstName || !lastName || !username || !birthDate) {
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
  }
  if (pw !== pw2) {
    return next(new BadRequestError({
      code: 400,
      message: "Passwords do not match",
      logging: false,
      context: { pw: "mismatch" }
    }));
  }
  if (!isPwValid(pw)) {
    return next(new BadRequestError({
      code: 400,
      message: "Password does not meet complexity requirements",
      logging: false,
      context: { pw: "invalid" }
    }));
  }
  if (!isValidDateStr(birthDate)) {
    return next(new BadRequestError({
      code: 400,
      message: "Invalid birthDate format. Expected format: YYYY-MM-DD",
      logging: false,
      context: { birthDate: "invalid" }
    }));
  }
  const userExists = await isUserByUsername(username);
  if (userExists) {
    return next(new BadRequestError({
      code: 400,
      message: "Username is already taken",
      logging: false,
      context: { username: "already taken" }
    }));
  }
  const hashedpw = await hashPW(pw);
  try {
    await createUser(email, hashedpw, firstName, lastName, username, birthDate);
    const token = await createToken(email, username);
    // todo: send email verification link with jwt token
  } catch (error) {
    return next(error);
  }
  res.status(201).json({ msg: "registered and activation email sent to " + email });

});

// activating user account from email link
router.get("/activate/:token", async (req: Request<{ token: string }, {}, {}, {}>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { token } = req.params;
  if (!token) {
    res.status(400).json({ msg: "Token is required" });
    return;
  }
  const decodedToken = await verifyToken(token);
  if (!decodedToken || typeof decodedToken === "string") {
    res.status(400).json({ msg: "Invalid token" });
    return;
  }
  const { email, username, activated } = decodedToken as { email: string, username: string, activated?: boolean };
  if (!email || !username || activated === undefined) {
    res.status(400).json({ msg: "Invalid token" });
    return;
  }
  if (activated) {
    res.status(200).json({ msg: token });
    return;
  }
  try {
    const activated = await activateUserByUsername(username);
    if (!activated) {
      res.status(400).json({ msg: "Failed to activate account. Please contact support." });
      return;
    }
    const activatedtoken = await createToken(email, username, true);
    res.status(200).json({ msg: activatedtoken });
  } catch (error) {
    return next(error);
  }
});

// password reset request
router.post("/reset-password", async (req: Request<{}, {}, { email: string, username: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { email, username } = req.body;
  if (!email || !username) {
    return next(new BadRequestError({
      code: 400,
      message: "Email and username are required",
      logging: false,
      context: { username: !username ? "missing" : "present", email: !email ? "missing" : "present" }
    }));
  }
  const userExists = await isUserByEmailUsername(email, username);
  if (!userExists) {
    return next(new BadRequestError({
      code: 400,
      message: "No user found with the provided email/username",
      logging: false,
      context: { email_or_Pw: "not found" }
    }));
  }
  try {
    const hashedpw = await getHashedPwByUsername(username);
    const pwResetToken = await createPWResetToken(email, username, hashedpw);
    console.log("this is pwResetToken " + pwResetToken);
    // todo: send email with reset link and user id
    res.status(200).json({ msg: "Password reset email sent" });
  } catch (error) {
    return next(error);
  }
});

// password reset using token from email link
router.post("/reset-password/:id/:token", async (req: Request<{ id: string, token: string }, {}, { newPassword: string, newPassword2: string }>, res: Response<{ msg: string }>, next: NextFunction) => {
  const { id, token } = req.params;
  const { newPassword, newPassword2 } = req.body;
  if (!token || !id) {
    return next(new BadRequestError({
      code: 400,
      message: "Token and/or id are required",
      logging: false,
      context: { token: token ? "present" : "missing", id: id ? "present" : "missing" }
    }));
  }
  if (!newPassword || !newPassword2) {
    return next(new BadRequestError({
      code: 400,
      message: "New passwords are required",
      logging: false,
      context: { newPassword: !newPassword ? "missing" : "present", newPassword2: !newPassword2 ? "missing" : "present" }
    }));
  }
  if (newPassword !== newPassword2) {
    return next(new BadRequestError({
      code: 400,
      message: "New passwords do not match",
      logging: false,
      context: { newPassword: "mismatch" }
    }));
  }
  if (!isPwValid(newPassword)) {
    return next(new BadRequestError({
      code: 400,
      message: "New password does not meet complexity requirements",
      logging: false,
      context: { newPassword: "invalid" }
    }));
  }
  let decodedToken;
  try {
    const hashedpw = await getHashedPwByUsername(id);
    if (!hashedpw) {
      return next(new BadRequestError({
        code: 400,
        message: "Invalid id",
        logging: false,
        context: { id: "invalid" }
      }));
    }
    decodedToken = await verifyPWResetToken(token, hashedpw);
  } catch (error) {
    return next(new BadRequestError({
      code: 400,
      message: "Invalid or expired token",
      logging: false,
      context: { token: "invalid or expired" }
    }));
  }
  if (!decodedToken || typeof decodedToken === "string") {
    return next(new BadRequestError({
      code: 400,
      message: "Invalid token",
      logging: false,
      context: { token: "invalid" }
    }));
  }
  const { email, username } = decodedToken as { email: string, username: string };
  if (!email || !username) {
    return next(new BadRequestError({
      code: 400,
      message: "Invalid token",
      logging: false,
      context: { token: "invalid" }
    }));
  }
  try {
    const hashedNewPw = await hashPW(newPassword);
    await setPwByUsername(username, hashedNewPw);
    res.status(200).json({ msg: "Password has been reset successfully. Pls login again with new pw" });
  } catch (error) {
    return next(error);
  }
});

export default router;