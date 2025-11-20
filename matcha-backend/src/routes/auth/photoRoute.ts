import express, { Express, NextFunction, Request, Response } from "express";
import BadRequestError from "../../errors/BadRequestError.js";
import ConstMatcha from "../../ConstMatcha.js";

let router = express.Router();

router.get("/:name", async (req: Request<{ name: string }>, res: Response, next: NextFunction) => {
  const { name } = req.params;

  // Whitelist filename characters and reject any path separators or traversal tokens
  if (!name || !/^[a-zA-Z0-9._-]+$/.test(name) || name.includes("..") || name.includes("/") || name.includes("\\"))
    return next(new BadRequestError({
      message: "invalid filename",
      logging: false,
      code: 400,
      context: { msg: "Filename contains invalid characters or path traversal." },
    }));

  try {
    const pathMod = await import("path");
    const fs = await import("fs/promises");
    const { resolve, join, relative } = pathMod;

    // Resolve base directory and the requested file path
    const baseDir = resolve(ConstMatcha.PHOTO_DUMP_DIR);
    const filePath = resolve(join(baseDir, name));

    // Ensure resolved filePath is inside baseDir (prevents traversal)
    if (relative(baseDir, filePath).startsWith("..")) {
      return next(new BadRequestError({
        message: "invalid filename",
        logging: false,
        code: 400,
        context: { msg: "Path traversal detected." },
      }));
    }

    // Ensure file exists and is a regular file
    const stats = await fs.stat(filePath).catch(() => null);
    if (!stats || !stats.isFile())
      return next(new BadRequestError({
        message: "file not found",
        logging: false,
        code: 404,
        context: { msg: "The requested file does not exist." },
      }));

    // Send the absolute file path directly
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        next(new BadRequestError({
          message: "file not found",
          logging: false,
          code: 404,
          context: { msg: "The requested file does not exist." },
        }));
      }
    });
  } catch (err) {
    console.error("Unexpected error serving file:", err);
    next(new BadRequestError({
      message: "internal server error",
      logging: false,
      code: 500,
      context: { msg: "Unexpected error while serving file." },
    }));
  }
});

export default router;