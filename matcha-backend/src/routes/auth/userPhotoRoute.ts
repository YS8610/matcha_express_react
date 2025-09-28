import express, { Express, NextFunction, Request, Response } from "express";
import upload from "../../middleware/uploadMulter.js";
import { Reslocal } from "../../model/profile.js";

let router = express.Router();

router.get("/:name", async (req: Request<{ name: string }>, res: Response<{ photoUrls: string[] }>, next: NextFunction) => {
  const { name } = req.params;
  // Logic to get photo URLs by name
  
});

router.post("/", upload.single("photo"), async (req: Request<{},{},{ }>, res: Response, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const photoUrl = req.file?.path;
  // Logic to add a new photo URL for the user
  res.status(201).json({ message: "Photo added successfully" });
});

export default router;