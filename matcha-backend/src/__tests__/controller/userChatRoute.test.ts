import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import { getDb } from "../../repo/mongoRepo.js";


let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/chat", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/user/chat/", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/user/chat/");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if request body is missing", async () => {
      const response = await request(app)
        .get("/api/user/chat/")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { body: "missing" },
        message: "Request body is required"
      });
    });

    it("should return 400 if otherid is missing in body", async () => {
      const response = await request(app)
        .get("/api/user/chat/")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { otherid: "missing" },
        message: "otherid is required in request body"
      });
    });

    it("should return 200 and chat history if valid request without query string", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Hello!",
          timestamp: Date.now()
        },
      ]);
      const response = await request(app)
        .get("/api/user/chat/")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Hello!",
          timestamp: expect.any(Number)
        }
      ]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 0, 50);
    });

    it("should return 200 and chat history if valid request with query string", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Hello again!",
          timestamp: Date.now()
        },
      ]);
      const response = await request(app)
        .get("/api/user/chat/?limit=10&skipno=5")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Hello again!",
          timestamp: expect.any(Number)
        }
      ]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 5, 10);
    });

    it("should return 200 and chat history if valid request with invalid query string", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Hello once more!",
          timestamp: Date.now()
        },
      ]);
      const response = await request(app)
        .get("/api/user/chat/?limit=abc&skipno=xyz")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Hello once more!",
          timestamp: expect.any(Number)
        }
      ]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 0, 50);
    });

    it("should return 500 if there is a server error", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockImplementationOnce(() => {
        throw new Error("Database error");
      });
      const response = await request(app)
        .get("/api/user/chat/")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "failed to get chat history between users"
      });
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 0, 50);
    });

    it("should return 200 and empty array if no chat history exists", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([]);
      const response = await request(app)
        .get("/api/user/chat/")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 0, 50);
    });

    it("should return 200 and chat history with special characters", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Hello! How's it going? 😊🚀",
          timestamp: Date.now()
        },
      ]);
      const response = await request(app)
        .get("/api/user/chat/")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Hello! How's it going? 😊🚀",
          timestamp: expect.any(Number)
        }
      ]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 0, 50);
    });

    it("should return 200 when skip query params is missing", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Partial query params!",
          timestamp: Date.now()
        },
      ]);
      const response = await request(app)
        .get("/api/user/chat/?limit=20")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Partial query params!",
          timestamp: expect.any(Number)
        }
      ]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb,"1", "2", 0, 20);
    });

    it("should return 200 when limit query params is missing", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Partial query params again!",
          timestamp: Date.now()
        },
      ]);
      const response = await request(app)
        .get("/api/user/chat/?skipno=15")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Partial query params again!",
          timestamp: expect.any(Number)
        }
      ]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 15, 50);
    });

    it("should return 200 and chat history when skip is not a number", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Partial query params again!",
          timestamp: Date.now()
        }
      ]);
      const response = await request(app)
        .get("/api/user/chat/?skipno=abc")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Partial query params again!",
          timestamp: expect.any(Number)
        }
      ]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 0, 50);
    });

    it("should return 200 and chat history when limit is not a number", async () => {
      const mockedgetChatHistoryBetweenUsers = vi.spyOn(await import("../../service/chatSvc.js"), "getChatHistoryBetweenUsers").mockResolvedValue([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Partial query params again!",
          timestamp: Date.now()
        }
      ]);
      const response = await request(app)
        .get("/api/user/chat/?limit=xyz")
        .set("Authorization", `Bearer ${token}`)
        .send({ otherid: "2" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          fromUserId: "1",
          toUserId: "2",
          content: "Partial query params again!",
          timestamp: expect.any(Number)
        }
      ]);
      expect(mockedgetChatHistoryBetweenUsers).toHaveBeenCalledWith(getDb, "1", "2", 0, 50);
    });

  });
});