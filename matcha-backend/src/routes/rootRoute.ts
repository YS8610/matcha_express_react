import express, { Express, NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/BadRequestError";
import { ProfileJson } from "../model/profile";
import { createUser, getUsers, isPwValid, isUser } from "../service/userSvc";
import { hashPW, loginSvc } from "../service/authSvc";
import { CustomError } from "../errors/CustomError";
import { createToken, verifyToken } from "../service/jwtSvc";

export let router = express.Router();

router.get("/ping", async (req: Request, res: Response<{msg:string}>) => {
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
});

router.post("/login", async (req: Request<{token:string}, {}, { email: string, password: string }>, res: Response<{msg:string}>, next: NextFunction) => {
  // todo: implement email login link logic here
  const { token } = req.params;
  
  // normal login with email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError({
      code: 400,
      message: "Email and/or password are required",
      logging: false,
      context: { email: !email ? "missing" : "present", password: !password ? "missing" : "present" }
    }));
  }
  try {
    const jwt = await loginSvc(email, password);
    if (jwt.length === 0) {
      return next(new BadRequestError({
      code: 400,
      message: "Invalid email and/or password",
      logging: true,
      context: { email: "invalid", password: "invalid" }
      }));
    }
    res.status(200).json({ msg: jwt });
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (req: Request<{}, {}, ProfileJson>, res: Response<{msg:string}, {}>, next: NextFunction) => {
  const { email, pw, pw2, firstName, lastName, username } = req.body;
  if (!email || !pw || !pw2 || !firstName || !lastName || !username) {
    return next(new BadRequestError({
      code: 400,
      message: "Email, passwords, first name, last name, and/or username are required",
      logging: false,
      context: { 
        email: !email ? "missing" : "present", 
        pw: !pw ? "missing" : "present", 
        pw2: !pw2 ? "missing" : "present", 
        firstName: !firstName ? "missing" : "present", 
        lastName: !lastName ? "missing" : "present", 
        username: !username ? "missing" : "present" 
      }
    }));
  }
  if (pw !== pw2) {
    return next(new BadRequestError({
      code: 400,
      message: "Passwords do not match",
      logging: true,
      context: { pw: "mismatch" }
    }));
  }
  if (!isPwValid(pw)) {
    return next(new BadRequestError({
      code: 400,
      message: "Password does not meet complexity requirements",
      logging: true,
      context: { pw: "invalid" }
    }));
  }
  const userExists = await isUser(email);
  if (userExists) {
    return next(new BadRequestError({
      code: 400,
      message: "Email is already registered",
      logging: false,
      context: { email: "already registered" }
    }));
  }
  const hashedpw = await hashPW(pw);
  try {
    await createUser( email, hashedpw, firstName, lastName, username );
    // todo: send email verification link with jwt token
    const token = await createToken(email, username);
  } catch (error) {
    return next(error);
  }
  res.status(200).json({ msg : "registered and activation email sent to " + email });

});

export default router;