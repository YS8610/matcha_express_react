import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import * as blockSvc from "../../service/blockSvc.js";
import { createToken } from "../../service/jwtSvc.js";
import * as fameSvc from "../../service/fameSvc.js";
import ConstMatcha from "../../ConstMatcha.js";

let app: Express;

describe("Route /api/user/block", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/user/block", () => {
    it("unathenticated user cannot access", async () => {
      const response = await request(app).get("/api/user/block");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("authenticated but unactivated user cannot access", async () => {
      const token = await createToken("1", "email", "username", false);
      const response = await request(app).get("/api/user/block").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ msg: "forbidden. You need to activate your account to access this resource" });
    });

    it("bad token cannot access", async () => {
      const response = await request(app).get("/api/user/block").set("Authorization", `Bearer badtoken`);
      expect(response.status).toBe(401);
      expect(response.body.errors[0]).toEqual({
        context: { token: "Invalid token. Please log in again." },
        message: "invalid token"
      });
    });

    it("get empty list of blocked users for authenticated user", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockGetBlockedById = vi.spyOn(blockSvc, "getBlockedById").mockResolvedValue([]);
      const response = await request(app).get("/api/user/block").set("Authorization", `Bearer ${token}`);
      expect(mockGetBlockedById).toHaveBeenCalled();
      expect(mockGetBlockedById).toHaveBeenCalledWith("1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: [] });
    });

    it("getBlockedbyId throws error", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockGetBlockedById = vi.spyOn(blockSvc, "getBlockedById").mockRejectedValue(new Error("Database error"));
      const response = await request(app).get("/api/user/block").set("Authorization", `Bearer ${token}`);
      expect(mockGetBlockedById).toHaveBeenCalled();
      expect(mockGetBlockedById).toHaveBeenCalledWith("1");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "Error getting blocked users for user"
      });
    });

    it("get a list of blocked users for authenticated user", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockGetBlockedById = vi.spyOn(blockSvc, "getBlockedById").mockResolvedValue([{
        id: "blockedUserId1",
        username: "blockedUser1",
        firstName: "Blocked",
        lastName: "User1",
        fameRating: 50,
        lastOnline: Date.now(),
        birthDate: { year: { low: 1990, high: 0 }, month: { low: 1, high: 0 }, day: { low: 1, high: 0 } },
        email: "blockedUser1@example.com",
        biography: "",
        gender: 1,
        sexualPreference: { low: 1, high: 0 },
        photo0: "photoUrl1",
        photo1: "",
        photo2: "",
        photo3: "",
        photo4: ""
      }]);
      const response = await request(app).get("/api/user/block").set("Authorization", `Bearer ${token}`);
      expect(mockGetBlockedById).toHaveBeenCalled();
      expect(mockGetBlockedById).toHaveBeenCalledWith("1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          {
            id: "blockedUserId1",
            username: "blockedUser1",
            firstName: "Blocked",
            lastName: "User1",
            fameRating: 50,
            photo0: "photoUrl1",
            lastOnline: expect.any(Number),
            birthDate: { year: { low: 1990, high: 0 }, month: { low: 1, high: 0 }, day: { low: 1, high: 0 } },
          }
        ]
      });
    });
  });

  describe("POST /api/user/block", () => {
    it("unathenticated user cannot access", async () => {
      const response = await request(app).post("/api/user/block").send({ userId: "2" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("authenticated but unactivated user cannot access", async () => {
      const token = await createToken("1", "email", "username", false);
      const response = await request(app).post("/api/user/block").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ msg: "forbidden. You need to activate your account to access this resource" });
    });

    it("bad token cannot access", async () => {
      const response = await request(app).post("/api/user/block").set("Authorization", `Bearer badtoken`);
      expect(response.status).toBe(401);
      expect(response.body.errors[0]).toEqual({
        context: { token: "Invalid token. Please log in again." },
        message: "invalid token"
      });
    });

    it("block user without userId in body returns 400", async () => {
      const token = await createToken("1", "email", "username", true);
      const response = await request(app).post("/api/user/block").set("Authorization", `Bearer ${token}`).send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: {},
        message: "userId is required in body"
      });
    });

    it("block user success", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockSetBlockedById = vi.spyOn(blockSvc, "setBlockedById").mockResolvedValue();
      const mockUpdateFameRating = vi.spyOn(fameSvc, "updateFameRating").mockResolvedValue(80);
      const response = await request(app).post("/api/user/block").set("Authorization", `Bearer ${token}`).send({ userId: "2" });
      expect(mockSetBlockedById).toHaveBeenCalled();
      expect(mockSetBlockedById).toHaveBeenCalledWith("1", "2");
      expect(mockUpdateFameRating).toHaveBeenCalled();
      expect(mockUpdateFameRating).toHaveBeenCalledWith("2", ConstMatcha.NEO4j_FAME_DECREMENT_BLOCK, fameSvc.getFame, fameSvc.setFame);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ msg: "User blocked successfully" });
    });

    it("setBlockedById throws error", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockSetBlockedById = vi.spyOn(blockSvc, "setBlockedById").mockRejectedValue(new Error("Database error"));
      const response = await request(app).post("/api/user/block").set("Authorization", `Bearer ${token}`).send({ userId: "2" });
      expect(mockSetBlockedById).toHaveBeenCalled();
      expect(mockSetBlockedById).toHaveBeenCalledWith("1", "2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "Error blocking user"
      });
    });

    it("updateFameRating throws error", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockSetBlockedById = vi.spyOn(blockSvc, "setBlockedById").mockResolvedValue();
      const mockUpdateFameRating = vi.spyOn(fameSvc, "updateFameRating").mockRejectedValue(new Error("Database error"));
      const response = await request(app).post("/api/user/block").set("Authorization", `Bearer ${token}`).send({ userId: "2" });
      expect(mockSetBlockedById).toHaveBeenCalled();
      expect(mockSetBlockedById).toHaveBeenCalledWith("1", "2");
      expect(mockUpdateFameRating).toHaveBeenCalled();
      expect(mockUpdateFameRating).toHaveBeenCalledWith("2", ConstMatcha.NEO4j_FAME_DECREMENT_BLOCK, fameSvc.getFame, fameSvc.setFame);
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "Error updating fame rating for blocked user"
      });
    });

  });

  describe("DELETE /api/user/block", () => {
    it("unathenticated user cannot access", async () => {
      const response = await request(app).delete("/api/user/block").send({ userId: "2" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("authenticated but unactivated user cannot access", async () => {
      const token = await createToken("1", "email", "username", false);
      const response = await request(app).delete("/api/user/block").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ msg: "forbidden. You need to activate your account to access this resource" });
    });

    it("bad token cannot access", async () => {
      const response = await request(app).delete("/api/user/block").set("Authorization", `Bearer badtoken`);
      expect(response.status).toBe(401);
      expect(response.body.errors[0]).toEqual({
        context: { token: "Invalid token. Please log in again." },
        message: "invalid token"
      });
    });

    it("unblock user without userId in body returns 400", async () => {
      const token = await createToken("1", "email", "username", true);
      const response = await request(app).delete("/api/user/block").set("Authorization", `Bearer ${token}`).send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: {},
        message: "userId is required in body"
      });
    });

    it("unblock user success", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockDeleteBlockedById = vi.spyOn(blockSvc, "deleteBlockedById").mockResolvedValue();
      const mockUpdateFameRating = vi.spyOn(fameSvc, "updateFameRating").mockResolvedValue(80);
      const response = await request(app).delete("/api/user/block").set("Authorization", `Bearer ${token}`).send({ userId: "2" });
      expect(mockDeleteBlockedById).toHaveBeenCalled();
      expect(mockDeleteBlockedById).toHaveBeenCalledWith("1", "2");
      expect(mockUpdateFameRating).toHaveBeenCalled();
      expect(mockUpdateFameRating).toHaveBeenCalledWith("2", ConstMatcha.NEO4j_FAME_DECREMENT_UNBLOCK, fameSvc.getFame, fameSvc.setFame);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ msg: "User unblocked successfully" });
    });

    it("deleteBlockedById throws error", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockDeleteBlockedById = vi.spyOn(blockSvc, "deleteBlockedById").mockRejectedValue(new Error("Database error"));
      const response = await request(app).delete("/api/user/block").set("Authorization", `Bearer ${token}`).send({ userId: "2" });
      expect(mockDeleteBlockedById).toHaveBeenCalled();
      expect(mockDeleteBlockedById).toHaveBeenCalledWith("1", "2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "Error unblocking user"
      });
    });

    it("updateFameRating throws error", async () => {
      const token = await createToken("1", "email", "username", true);
      const mockDeleteBlockedById = vi.spyOn(blockSvc, "deleteBlockedById").mockResolvedValue();
      const mockUpdateFameRating = vi.spyOn(fameSvc, "updateFameRating").mockRejectedValue(new Error("Database error"));
      const response = await request(app).delete("/api/user/block").set("Authorization", `Bearer ${token}`).send({ userId: "2" });
      expect(mockDeleteBlockedById).toHaveBeenCalled();
      expect(mockDeleteBlockedById).toHaveBeenCalledWith("1", "2");
      expect(mockUpdateFameRating).toHaveBeenCalled();
      expect(mockUpdateFameRating).toHaveBeenCalledWith("2", ConstMatcha.NEO4j_FAME_DECREMENT_UNBLOCK, fameSvc.getFame, fameSvc.setFame);
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "Error updating fame rating for unblocked user"
      });
    });
  });
});