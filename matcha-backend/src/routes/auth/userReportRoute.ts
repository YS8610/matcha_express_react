import express, { Express, NextFunction, Request, Response } from "express";
import { Reslocal } from "../../model/profile.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { ResMsg } from "../../model/Response.js";
import { isUserReported, reportUser } from "../../service/reportSvc.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { isUserExistsById } from "../../service/userSvc.js";

let router = express.Router();

router.post("/:otherid", async (req: Request<{ otherid: string }, {}, { reason: string }>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { otherid } = req.params;
  const { reason } = req.body;
  if (reason === undefined || reason.trim().length < 10)
    return next(new BadRequestError({
      message: "Reason for report is required",
      logging: false,
      code: 400,
      context: { error: "Reason must be at least 10 characters long" },
    }));
  if (otherid === id)
    return next(new BadRequestError({
      message: "You cannot report yourself",
      logging: false,
      code: 400,
      context: { error: "Self-reporting attempt" },
    }));
  const isUserExists = await serverErrorWrapper(() => isUserExistsById(otherid), "failed to check if user exists");
  if (!isUserExists)
    return next(new BadRequestError({
      message: "The user you are trying to report does not exist",
      logging: false,
      code: 400,
      context: { error: "Reported user does not exist" },
    }));
  const isReported = await serverErrorWrapper(() => isUserReported(id, otherid), "failed to check if user is already reported");
  if (isReported)
    return next(new BadRequestError({
      message: "You have already reported this user",
      logging: false,
      code: 400,
      context: { error: "Duplicate report attempt" },
    }));
  await serverErrorWrapper(() => reportUser(id, otherid, reason), "failed to report user");
  res.status(200).json({ msg: "Report submitted successfully" });
});

export default router;