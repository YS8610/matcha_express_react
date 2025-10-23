import { Document, MongoClient } from "mongodb";
import ServerRequestError from "../errors/ServerRequestError.js";
import ConstMatcha from "../ConstMatcha.js";
import { clogger } from "../service/loggerSvc.js";
import { chatmessagesValidator, notificationsValidator, reportsValidator } from "../model/mongoDBValidator.js";

const connectionString = process.env.MONGODB || ConstMatcha.MONGO_DEFAULT_URI;
const client = new MongoClient(connectionString, {
  maxPoolSize: ConstMatcha.MONGO_DEFAULT_POOL,
  serverSelectionTimeoutMS: ConstMatcha.MONGO_DEFAULT_TIMEOUT,
});

let conn;
try {
  conn = await client.connect();
} catch (e) {
  throw new ServerRequestError({
    message: 'mongoDB connection failed',
    code: 500,
    context: { err: e },
  });
}
if (!conn) {
  throw new ServerRequestError({
    message: 'Database connection failed',
    code: 500,
    context: { err: 'MongoDB connection' },
  });
}
let db = conn.db("matcha");

// Ensure collections exist with proper validation
let collections: Set<string> = new Set();
db.listCollections().toArray()
  .then((cols) => {
    cols.forEach((col) => collections.add(col.name));
  })
  .then(() => {
    if (!collections.has(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS)) {
      db.createCollection(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS, { validator: notificationsValidator })
      .catch((e: Error) => {
        clogger.info('Notification collection creation skipped: ' + e.message);
      });
    }
    if (!collections.has(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES)) {
      db.createCollection(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES, { validator: chatmessagesValidator })
      .catch((e: Error) => {
        // collection probably exists
        clogger.info('Chatmessage collection creation skipped: ' + e.message);
      });
    }
    if (!collections.has(ConstMatcha.MONGO_COLLECTION_REPORTS)) {
      db.createCollection(ConstMatcha.MONGO_COLLECTION_REPORTS, { validator: reportsValidator })
      .catch((e: Error) => {
        clogger.info('Report collection creation skipped: ' + e.message);
      });
    }
  })
  .catch((e: Error) => {
    clogger.error('Error listing collections: ' + e.message);
  });

export default db;