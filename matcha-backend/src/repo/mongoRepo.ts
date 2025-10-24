import { Db, MongoClient } from "mongodb";
import ServerRequestError from "../errors/ServerRequestError.js";
import ConstMatcha from "../ConstMatcha.js";
import { clogger } from "../service/loggerSvc.js";
import {
  chatmessagesValidator,
  locationValidator,
  notificationsValidator,
  reportsValidator,
} from "../model/mongoDBValidator.js";

const connectionString = process.env.MONGODB || ConstMatcha.MONGO_DEFAULT_URI;
const client = new MongoClient(connectionString, {
  maxPoolSize: ConstMatcha.MONGO_DEFAULT_POOL,
  serverSelectionTimeoutMS: ConstMatcha.MONGO_DEFAULT_TIMEOUT,
});

let cachedDb: Db | null = null;

// Single promise that performs connection + collection/index setup.
// Consumers should await dbPromise or call getDb().
export const dbPromise: Promise<Db> = (async (): Promise<Db> => {
  try {
    const conn = await client.connect();
    clogger.info("Connected successfully to mongoDB");
    const dbName = ConstMatcha.MONGO_DEFAULT_DB ?? "matcha";
    const db = conn.db(dbName);

    // list existing collections
    const cols = await db.listCollections().toArray();
    const collections = new Set(cols.map((c) => c.name));

    // notifications
    if (!collections.has(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS)) {
      const coll = await db.createCollection(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS, {
        validator: notificationsValidator,
      });
      await coll.createIndex({ userId: 1, id: 1 }, { unique: true });
    }

    // chat messages
    if (!collections.has(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES)) {
      const coll = await db.createCollection(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES, {
        validator: chatmessagesValidator,
      });
      // create any required indexes here (awaited)
      await coll.createIndex({ userId: 1, id: 1 });
    }

    // reports
    if (!collections.has(ConstMatcha.MONGO_COLLECTION_REPORTS)) {
      const coll = await db.createCollection(ConstMatcha.MONGO_COLLECTION_REPORTS, {
        validator: reportsValidator,
      });
      await coll.createIndex({ reporterId: 1, reportedId: 1 }, { unique: true });
    }

    // location
    if (!collections.has(ConstMatcha.MONGO_COLLECTION_LOCATION)) {
      const coll = await db.createCollection(ConstMatcha.MONGO_COLLECTION_LOCATION, {
        validator: locationValidator,
      });
      await coll.createIndex({ location: "2dsphere" });
    }

    cachedDb = db;
    return db;
  } catch (err) {
    clogger.error("MongoDB initialization error: " + (err as Error).message);
    // rethrow so application startup (or tests) can handle/fail fast
    throw new ServerRequestError({
      message: "mongoDB initialization failed",
      code: 500,
      context: { err },
    });
  }
})();

export const getDb = async (): Promise<Db> => {
  if (cachedDb) return cachedDb;
  cachedDb = await dbPromise;
  return cachedDb;
};

export const closeClient = async (): Promise<void> => {
  try {
    await client.close();
    clogger.info("MongoDB client closed");
  } catch (e) {
    clogger.error("Error closing MongoDB client: " + (e as Error).message);
  }
};