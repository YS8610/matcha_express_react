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

export const locationValidator: Document = {
  $jsonSchema: {
    bsonType: "object",
    required: ["userId", "username", "location", "updatedAt"],
    properties: {
      userId: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      username: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      location: {
        bsonType: "object",
        required: ["type", "coordinates"],
        properties: {
          type: {
            bsonType: "string",
            enum: ["Point"],
            description: "must be 'Point' and is required"
          },
          coordinates: {
            description: "GeoJSON coordinates for the given type",
            bsonType: "array",
            minItems: 2,
            maxItems: 2,
            items: [
              {
                bsonType: "double",
                description: "must be a double representing longitude",
                minimum: -180,
                maximum: 180
              },
              {
                bsonType: "double",
                description: "must be a double representing latitude",
                minimum: -90,
                maximum: 90
              }
            ]
          }
        },
      },
      updatedAt: {
        bsonType: ["double", "int", "long"],
        description: "must be a numeric timestamp and is required"
      }
    }
  }
}