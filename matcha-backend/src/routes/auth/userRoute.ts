import express, { Express, NextFunction, Request, Response } from "express";


let router = express.Router();

router.put("/profile", (req: Request, res: Response<{msg:string}>, next: NextFunction) => {
  

  res.status(200).json({ msg: "profile updated" });
});

export default router;