import express, { Express, NextFunction, Request, Response } from "express";
import BadRequestError from "../../errors/BadRequestError.js";
import ConstMatcha from "../../ConstMatcha.js";

let router = express.Router();

router.get("/:name", async (req: Request<{ name: string }>, res: Response, next: NextFunction) => {
  const { name } = req.params;
  // Logic to get photo URLs by name
  res.sendFile(`/${ConstMatcha.PHOTO_DUMP_DIR}/` + name, { root: '.' }, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      next( new BadRequestError({
        message: "file not found",
        logging: false,
        code: 404,
        context: { msg : "The requested file does not exist." },
      }));
    }
  });
});

export default router;