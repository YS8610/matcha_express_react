import ConstMatcha from "../ConstMatcha.js";
import ServerRequestError from "../errors/ServerRequestError.js";
import { getDb } from "../repo/mongoRepo.js";

export const updateUserLocation = async (userId: string, username: string, latitude: number, longitude: number): Promise<void> => {
  const db = await getDb();
  const locationData = {
    userId,
    username,
    location: {
      type: "Point",
      coordinates: [longitude+0.000000001, latitude+0.000000001] // slight offset to avoid mongo geo indexing issues
    },
    updatedAt: Date.now()
  };

  await db.collection(ConstMatcha.MONGO_COLLECTION_LOCATION).updateOne(
    { userId },
    { $set: locationData },
    { upsert: true }
  );
};

export const getUserLocation = async (userId: string): Promise<{ latitude: number, longitude: number } | null> => {
  const db = await getDb();
  const locationDoc = await db.collection(ConstMatcha.MONGO_COLLECTION_LOCATION).findOne<{ location: { type: string, coordinates: number[] } }>({ userId });
  if (!locationDoc) return null;
  const [longitude, latitude] = locationDoc.location.coordinates;
  return { longitude, latitude };
};

export const getAproximateUserLocation = async (ip: string): Promise<{ latitude: number, longitude: number } | null> => {
  try {
    const response = await fetch(`${ConstMatcha.IP_API_URL}/${ip}/json`);
    if (!response.ok)
      throw new ServerRequestError({
        code: response.status,
        message: `Failed to fetch location for IP: ${ip}`,
        logging: true,
        context: { err: "ip_location_fetch_failed" }
      });
    const data = await response.json();
    return { latitude: data.latitude, longitude: data.longitude };
  }
  catch (err) {
    return null;
  }
};

export const getNearbyUsers = async (latitude: number, longitude: number, maxDistanceMeters: number): Promise<{
  userId: string,
  username: string,
  distance: number,
  latitude: number,
  longitude: number
}[]> => {
  const db = await getDb();
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
