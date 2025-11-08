import express, { Express, NextFunction, Request, Response } from "express";
import { ProfileGetJson, ProfileShort, Reslocal } from "../../model/profile.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { serverErrorWrapper } from "../../util/wrapper.js";
import { getBlockedRel } from "../../service/blockSvc.js";
import { getShortProfileById, getShortProfilebyIdFiltered, getUserProfileById } from "../../service/userSvc.js";
import { getNearbyUsers, getUserLocation } from "../../service/locationSvc.js";
import { isLiked, isLikedBack, isMatch } from "../../service/likeSvc.js";

let router = express.Router();

// get profile of multiple users not blocked or blocking the requester
router.get("/", async (req: Request<{}, {}, {}, { minAge: string, maxAge: string, distancekm: string, minFameRating: string, maxFameRating: string, skip: string, limit :string }>, res: Response<ProfileShort[]>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const { minAge, maxAge, distancekm, minFameRating, maxFameRating, skip, limit } = req.query;
  const parsedMinAge = parseInt(minAge) || 18;
  const parsedMaxAge = parseInt(maxAge) || 150;
  const parsedDistanceKm = parseInt(distancekm) || 20100;
  const parsedMinFameRating = parseInt(minFameRating) || 0;
  const parsedMaxFameRating = parseInt(maxFameRating) || 999999;
  const parsedSkip = parseInt(skip) || 0;
  const parsedLimit = parseInt(limit) || 100;
  const profile = await serverErrorWrapper(() => getUserProfileById(id), "Error getting user profile");
  if (!profile)
    return next(new BadRequestError({
      code: 400,
      message: "User profile not found",
      logging: false,
      context: { id: "not_found" }
    }));
  const userLocation = await serverErrorWrapper(() => getUserLocation(id), "Error getting user location");
  const filteredProfiles = await serverErrorWrapper(
    () => getShortProfilebyIdFiltered(
      id,
      parsedMinAge,
      parsedMaxAge,
      parsedMinFameRating,
      parsedMaxFameRating,
      profile.sexualPreference.low,
      parsedSkip,
      parsedLimit
    ), "Error getting user profiles");
  for (const prof of filteredProfiles || []) {
    const profLocation = await serverErrorWrapper(() => getUserLocation(prof.id), "Error getting profile location");
    prof.latitude = profLocation?.latitude || 0;
    prof.longitude = profLocation?.longitude || 0;
  }
  if (parsedDistanceKm >= 20100){
    res.status(200).json(filteredProfiles || []);
    return;
  }
  // TODO: use userLocation and parsedDistanceKm to filter users by distance
  const nearbyProfiles = await getNearbyUsers(userLocation?.latitude || 0, userLocation?.longitude || 0, parsedDistanceKm);
  const nearbyProfileMap = new Map<string, { latitude: number, longitude: number }>();
  nearbyProfiles.forEach(prof => {
    nearbyProfileMap.set(prof.userId, { latitude: prof.latitude, longitude: prof.longitude });
  });
  const finalProfiles: ProfileShort[] = [];
  for (const prof of filteredProfiles || []) {
    if (nearbyProfileMap.has(prof.id)) {
      const { latitude, longitude } = nearbyProfileMap.get(prof.id)!;
      finalProfiles.push({ ...prof, latitude, longitude });
    }
  }
  res.status(200).json(finalProfiles);
});

// get other user's short profile by id
router.get("/short/:userId", async (req: Request<{ userId: string }>, res: Response<ProfileShort>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const userId = req.params.userId;
  if (!userId)
    return next(new BadRequestError({
      code: 400,
      message: "User ID is required",
      logging: false,
      context: { userId: "missing" }
    }));
  const isBlocked = await serverErrorWrapper(() => getBlockedRel(id, userId), "Error checking if user blocked or is blocked");
  if (isBlocked)
    return next(new BadRequestError({
      code: 403,
      message: "User is blocked or is blocking you",
      logging: false,
      context: { userId: "blocked or blocking" }
    }));
  const profile = await serverErrorWrapper(() => getShortProfileById(userId), "Error getting user profile");
  if (!profile)
    return next(new BadRequestError({
      code: 400,
      message: "User profile not found",
      logging: false,
      context: { id: "not_found" }
    }));
  const matched = await serverErrorWrapper(() => isMatch(id, userId), "Error checking match status");
  const liked = await serverErrorWrapper(() => isLiked(id, userId), "Error checking liked status");
  const likedBack = await serverErrorWrapper(() => isLikedBack(userId, id), "Error checking liked back status");
  profile.connectionStatus = {
    userid: userId,
    matched,
    liked,
    likedBack
  };
  res.status(200).json(profile);
});

// get other user's full profile by id
router.get("/:userId", async (req: Request<{ userId: string }>, res: Response<ProfileGetJson>, next: NextFunction) => {
  const { authenticated, username, id, activated } = res.locals as Reslocal;
  const userId = req.params.userId;
  if (!userId)
    return next(new BadRequestError({
      code: 400,
      message: "User ID is required",
      logging: false,
      context: { userId: "missing" }
    }));
  const isBlocked = await serverErrorWrapper(() => getBlockedRel(id, userId), "Error checking if user blocked or is blocked");
  if (isBlocked)
    return next(new BadRequestError({
      code: 403,
      message: "User is blocked or is blocking you",
      logging: false,
      context: { userId: "blocked or blocking" }
    }));
  const profile = await serverErrorWrapper(() => getUserProfileById(userId), "Error getting user profile");
  if (!profile)
    return next(new BadRequestError({
      code: 400,
      message: "User profile not found",
      logging: false,
      context: { id: "not_found" }
    }));
  const matched = await serverErrorWrapper(() => isMatch(id, userId), "Error checking match status");
  const liked = await serverErrorWrapper(() => isLiked(id, userId), "Error checking liked status");
  const likedBack = await serverErrorWrapper(() => isLikedBack(userId, id), "Error checking liked back status");
  profile.connectionStatus = {
    userid: userId,
    matched,
    liked,
    likedBack
  };
  res.status(200).json(profile);
});

export default router;