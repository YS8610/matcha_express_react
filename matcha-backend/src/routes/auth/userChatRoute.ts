import express, { Express, NextFunction, Request, Response } from "express";
import { Reslocal } from "../../model/profile.js";
import { getChatHistoryBetweenUsers } from "../../service/chatSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { ChatMessage } from "../../model/Response.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { getDb } from "../../repo/mongoRepo.js";

let router = express.Router();

router.get("/:otherid", async (req: Request<{otherid:string}, {}, {}, {limit:string, skipno:string}>, res: Response<ChatMessage[]>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  // if otherid path variable is missing, it will be caught by express itself
  const { otherid } = req.params;
  const { limit, skipno } = req.query;
  const lim = parseInt(limit as string, 10) || 50;
  const skip = parseInt(skipno as string, 10) || 0;
  const chatHistory = await serverErrorWrapper(() => getChatHistoryBetweenUsers(getDb, id, otherid, skip, lim), "failed to get chat history between users");
  res.send(chatHistory);
});

export default router;