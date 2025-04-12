import express, { Express, Request, Response } from "express";

export let router = express.Router();

router.get("/ping", (req : Request, res: Response) => {
  res.status(200).json({msg : "pong"});
});

export default router;