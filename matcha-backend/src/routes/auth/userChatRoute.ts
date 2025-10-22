import express, { Express, NextFunction, Request, Response } from "express";
import { Reslocal } from "../../model/profile.js";
import { getChatHistoryBetweenUsers } from "../../service/chatSvc.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { ChatMessage } from "../../model/Response.js";

let router = express.Router();

router.get("/", async (req: Request<{}, {}, {otherid:string}, {limit:string, skipno:string}>, res: Response<ChatMessage[]>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { otherid } = req.body;
  if (!otherid)
    return next(new BadRequestError({
      message: "otherid is required in request body",
      code : 400,
      context : {otherid :"missing"}
    }));
  const { limit, skipno } = req.query;
  const lim = parseInt(limit as string, 10) || 50;
  const skip = parseInt(skipno as string, 10) || 0;
  const chatHistory = await getChatHistoryBetweenUsers(id, otherid, skip, lim);
  res.send(chatHistory);
});

export default router;