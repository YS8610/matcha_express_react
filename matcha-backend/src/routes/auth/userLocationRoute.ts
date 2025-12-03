import express, { Express, NextFunction, Request, Response } from "express";
import { Reslocal } from "../../model/profile.js";
import { ResMsg } from "../../model/Response.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { updateUserLocation } from "../../service/locationSvc.js";
import { serverErrorWrapper } from "../../util/wrapper.js";

let router = express.Router();

router.put("/", async (req: Request<{},{},{latitude: number, longitude: number}>, res: Response<ResMsg>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  if (!req.body)
    return next(new BadRequestError({
      message: "Request body is required",
      logging: false,
      code: 400,
      context: { body: 'missing' },
    }));
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude)
    return next(new BadRequestError({
      message: "latitude and longitude are required",
      logging: false,
      code: 400,
      context: { latitude : !latitude? 'missing' : 'provided', longitude: !longitude ? 'missing' : 'provided' },
    }));
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
    return next(new BadRequestError({
      message: "latitude or/and longitude out of range",
      logging: false,
      code: 400,
      context: {
        latitude : latitude < -90 || latitude > 90? 'out of range' : 'in range',
        longitude : longitude < -180 || longitude > 180 ? 'out of range' : 'in range'
      }
    }));
  await serverErrorWrapper(() => updateUserLocation(id, username, latitude, longitude), "error updating user location");
  res.status(200).json({ msg: "User location updated successfully" });
});

export default router;