import { Document, MongoClient } from "mongodb";
import ServerRequestError from "../errors/ServerRequestError.js";
import ConstMatcha from "../ConstMatcha.js";
import { clogger } from "../service/loggerSvc.js";

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
  })

export default db;

const notificationsValidator: Document = {
  $jsonSchema: {
    bsonType: "object",
    required: ["id", "userId", "type", "message", "createdAt", "read"],
    properties: {
      id: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      userId: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      type: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      message: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      createdAt: {
        bsonType: "number",
        description: "must be a number and is required"
      },
      read: {
        bsonType: "bool",
        description: "must be a boolean and is required"
      }
    }
  }
}

const chatmessagesValidator: Document = {
  $jsonSchema: {
    bsonType: "object",
    required: ["fromUserId", "toUserId", "content", "timestamp"],
    properties: {
      fromUserId: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      toUserId: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      content: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      timestamp: {
        bsonType: "number",
        description: "must be a number and is required"
      }
    }
  }
}