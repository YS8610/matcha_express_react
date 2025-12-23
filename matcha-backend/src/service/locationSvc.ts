import { Db } from "mongodb";
import ConstMatcha from "../ConstMatcha.js";
import { getDb } from "../repo/mongoRepo.js";
import { IpLocation } from "../model/Response.js";

export const updateUserLocation = async (userId: string, username: string, latitude: number, longitude: number, getDataBase: () => Promise<Db> = getDb): Promise<void> => {
  const db = await getDataBase();
  const locationData = {
    userId,
    username,
    location: {
      type: "Point",
      coordinates: [longitude + 0.000000001, latitude + 0.000000001] // slight offset to avoid mongo geo indexing issues
    },
    updatedAt: Date.now()
  };

  await db.collection(ConstMatcha.MONGO_COLLECTION_LOCATION).updateOne(
    { userId },
    { $set: locationData },
    { upsert: true }
  );
};

export const getUserLocation = async (userId: string, getDataBase: () => Promise<Db> = getDb): Promise<{ latitude: number, longitude: number } | null> => {
  const db = await getDataBase();
  const locationDoc = await db.collection(ConstMatcha.MONGO_COLLECTION_LOCATION).findOne<{ location: { type: string, coordinates: number[] } }>({ userId });
  if (!locationDoc) return null;
  const [longitude, latitude] = locationDoc.location.coordinates;
  return { longitude, latitude };
};

export const getAproximateUserLocation = async (ip: string, _fetch: typeof global.fetch = fetch): Promise<{ latitude: number, longitude: number } | null> => {
  try {
    const response = await _fetch(`${ConstMatcha.IP_API_URL}/json/${ip === '::ffff:127.0.0.1' ? "" : ip}`);
    if (!response.ok)
      return { latitude: 0.1, longitude: 0.1 };
    const data: IpLocation = await response.json();
    return { latitude: data.lat, longitude: data.lon };
  }
  catch (err) {
    return { latitude: 0.1, longitude: 0.1 };
  }
};

export const getNearbyUsers = async (latitude: number, longitude: number, maxDistanceMeters: number, getDataBase: () => Promise<Db> = getDb): Promise<{
  userId: string,
  username: string,
  distance: number,
  latitude: number,
  longitude: number
}[]> => {
  const db = await getDataBase();
  const users = await db.collection(ConstMatcha.MONGO_COLLECTION_LOCATION).aggregate<{
    userId: string;
    username: string;
    distance: number;
    latitude: number;
    longitude: number;
  }>([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        distanceField: "distance",
        maxDistance: maxDistanceMeters,
        spherical: true
      }
    },
    {
      $project: {
        userId: 1,
        username: 1,
        distance: { $round: ["$distance", 2] },
        longitude: { $round: [{ $arrayElemAt: ["$location.coordinates", 0] }, 6] },
        latitude: { $round: [{ $arrayElemAt: ["$location.coordinates", 1] }, 6] }
      }
    }
  ]).toArray();

  return users;
};
