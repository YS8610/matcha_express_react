import { Document } from "mongodb";


export const notificationsValidator: Document = {
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

export const chatmessagesValidator: Document = {
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

export const reportsValidator: Document = {
  $jsonSchema: {
    bsonType: "object",
    required: ["reporterId", "reportedId", "reason", "timestamp"],
    properties: {
      reporterId: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      reportedId: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      reason: {
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