import express, { Express, NextFunction, Request, Response } from "express";
import upload from "../../middleware/uploadMulter.js";
import { Reslocal } from "../../model/profile.js";
import { deletePhotoByName, getAllPhotoNameByUserId, isValidOrder, reorderPhotosByID, setPhotobyUserId } from "../../service/photoSvc.js";
import { catchErrorWrapper, serverErrorWrapper } from "../../util/wrapper.js";
import BadRequestError from "../../errors/BadRequestError.js";

let router = express.Router();

// get all photo names of the user
router.get("/", async (req: Request, res: Response<{photoNames: string[]}>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const photoNames = await serverErrorWrapper(() => {return getAllPhotoNameByUserId(id)}, "Failed to get photo names");
  res.status(200).json({ photoNames });
});

// upload user photo by photo number
router.put("/:no", upload.single("photo"), async (req: Request<{ no: string }>, res: Response<{msg:string}>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  if (!req.file)
    return (next(new BadRequestError({
      message: "No file uploaded",
      logging: false,
      code: 400,
      context: { err : "No file uploaded"}
    })));
  const { no } = req.params;
  const photoNumber = parseInt(no, 10);
  if (isNaN(photoNumber))
    return (next(new BadRequestError({
      message: "Photo number is not a number",
      logging: false,
      code: 400,
      context: { err : "pls provide a number from 0 to 4"}
    })));
  if (photoNumber < 0 || photoNumber > 5){
    return (next(new BadRequestError({
      message: "Invalid photo number",
      logging: false,
      code: 400,
      context: { err : "pls provide a number from 0 to 4"}
    })));
  }
  if (!req.file.filename){
    return (next(new BadRequestError({
      message: "No photo uploaded",
      logging: false,
      code: 400,
      context: { err : "No photo uploaded"}
    })));
  }
  await serverErrorWrapper(() => {setPhotobyUserId(id, req.file?.filename || "", photoNumber)}, "Failed to add photo");
  res.status(201).json({ msg: "Photo added successfully" });
});

// delete user photo by photo number
router.delete("/:no", async (req: Request<{ no: string }>, res: Response<{msg :string}>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { no } = req.params;
  const photoNumber = parseInt(no, 10);
  if (isNaN(photoNumber))
    return (next(new BadRequestError({
      message: "Photo number is not a number",
      logging: false,
      code: 400,
      context: { err : "pls provide a number from 0 to 4"}
    })));
  if (photoNumber < 0 || photoNumber > 4) {
    return (next(new BadRequestError({
      message: "Invalid photo number",
      logging: false,
      code: 400,
      context: { err : "pls provide a number from 0 to 4"}
    })));
  }
  const photoNames = await serverErrorWrapper(() => {return getAllPhotoNameByUserId(id)}, "Failed to get photo names");
  if (photoNames[photoNumber] === "")
    return (next(new BadRequestError({
      message: "No photo to delete",
      logging: false,
      code: 400,
      context: { err : "No photo to delete"}
    })));
  await deletePhotoByName(photoNames[photoNumber]);
  const [error] = await catchErrorWrapper(setPhotobyUserId(id, "", photoNumber));
  if (error)
    return next(error);
  res.status(200).json({ msg: "Photo deleted successfully" });
});

// reorder photos by new order array
router.put("/order", async (req: Request<{}, {}, {newOrder: number[]}>, res: Response<{msg:string}>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { newOrder } = req.body;
  if (!newOrder)
    return next(new BadRequestError({
      message: "No new order provided",
      logging: false,
      code: 400,
      context: { err : "pls provide a valid photo order"}
    }));
  if (!Array.isArray(newOrder) || 
      newOrder.length !== 5 || 
      !newOrder.every(n => typeof n === 'number' && n >= 0 && n <= 4) ||
      !isValidOrder(newOrder)
  ) 
    return next(new BadRequestError({
      message: "Invalid photo order",
      logging: false,
      code: 400,
      context: { err : "pls provide a valid photo order"}
    }));
  const oldOrder = await serverErrorWrapper(() => {return getAllPhotoNameByUserId(id)}, "Failed to get photo names");
  await serverErrorWrapper(() => {return reorderPhotosByID(id, newOrder, oldOrder)}, "Failed to reorder photos");
  res.status(200).json({ msg: "Photo order updated successfully" });
});

export default router;