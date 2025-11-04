import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as likeSvc from "../../service/likeSvc.js";
import * as userSvc from "../../service/userSvc.js";
import * as viewedSvc from "../../service/viewedSvc.js";
import * as fameSvc from "../../service/fameSvc.js";
import * as notificationSvc from "../../service/notificationSvc.js";
import { ProfileShort } from "../../model/profile.js";
import ConstMatcha, { NOTIFICATION_TYPE } from "../../ConstMatcha.js";
import { getDb } from "../../repo/mongoRepo.js";


let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/liked", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/user/liked/by", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/user/liked");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 403 if authenticated but account not activated", async () => {
      const unactivatedToken = await createToken("2", "unactivated@example.com", "unactivateduser", false);
      const response = await request(app)
        .get("/api/user/liked/by")
        .set("Authorization", `Bearer ${unactivatedToken}`);
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ msg: "forbidden. You need to activate your account to access this resource" });
    });

    it("should return 500 if there is an internal server error", async () => {
      const mockgetLikedById = vi.spyOn(likeSvc, "getLikedById").mockRejectedValueOnce(new Error("Database error"));
      const response = await request(app)
        .get("/api/user/liked/by")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(mockgetLikedById).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Error getting users who liked you",
        context: { error: {} }
      });
    });

    it("should return 200 and list of users who liked the authenticated user", async () => {
      const mockProfiles = [
        {
          id: "2",
          username: "user2",
          firstName: "User",
          lastName: "Two",
          photo0: "photo2.jpg",
          fameRating: 50,
          lastOnline: Date.now(),
          birthDate: {year: {low:1990, high:0}, month: {low:1, high:0}, day: {low:1, high:0}}
        },
      ];
      const mockgetLikedById = vi.spyOn(likeSvc, "getLikedById").mockResolvedValueOnce(mockProfiles as any);
      const response = await request(app)
        .get("/api/user/liked/by")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(mockgetLikedById).toHaveBeenCalledWith("1");
      expect(response.body).toEqual({ data: mockProfiles });
    });
  });

  describe("POST /api/user/liked", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).post("/api/user/liked").send({ userid: "2" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if there is no request body", async () => {
      const response = await request(app)
        .post("/api/user/liked")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: {body : "missing"},
        message: "Request body is missing"
      });
    });

    it("should return 400 if userid is missing", async () => {
      const response = await request(app)
        .post("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "userid is required",
        context: { userid: "missing" }
      });
    });

    it("should return 400 if user tries to like themselves", async () => {
      const response = await request(app)
        .post("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "1" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "you cannot like yourself",
        context: { userid: "self_like" }
      });
    });

    it("should return 400 if the user to be liked does not exist", async () => {
      const mockisUserExistsById = vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(false);
      const response = await request(app)
        .post("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "999" });
      expect(response.status).toBe(404);
      expect(mockisUserExistsById).toHaveBeenCalledWith("999");
      expect(response.body.errors[0]).toEqual({
        message: "user not found",
        context: { userid: "not_found" }
      });
    });

    it("should return 400 if the user has already liked the target user", async () => {
      const mockisUserExistsById = vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
      const mockisLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValueOnce(true);
      const response = await request(app)
        .post("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "2" });
      expect(response.status).toBe(400);
      expect(mockisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockisLiked).toHaveBeenCalledWith("1", "2");
      expect(response.body.errors[0]).toEqual({
        message: "you have already liked this user",
        context: { userid: "already_liked" }
      });
    });

    it("should return 200 if the like is successful but not matched", async () => {
      const mockisUserExistsById = vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
      const mockisLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValueOnce(false);
      const mockaddLike = vi.spyOn(likeSvc, "addLiked").mockResolvedValueOnce();
      const mockaddViewed = vi.spyOn(viewedSvc, "addViewed").mockResolvedValueOnce();
      const mockupdateFameRating = vi.spyOn(fameSvc, "updateFameRating").mockResolvedValueOnce(60);
      const mocknotifyUser = vi.spyOn(notificationSvc, "notifyUser").mockResolvedValueOnce();
      const mockMatched = vi.spyOn(likeSvc, "isMatch").mockResolvedValueOnce(false);
      const response = await request(app)
        .post("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "2" });
      expect(response.status).toBe(201);
      expect(mockisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockisLiked).toHaveBeenCalledWith("1", "2");
      expect(mockaddLike).toHaveBeenCalledWith("1", "2");
      expect(mockaddViewed).toHaveBeenCalledWith("1", "2");
      expect(mockupdateFameRating).toHaveBeenCalledWith("2", ConstMatcha.NEO4j_FAME_INCREMENT_LIKE, fameSvc.getFame, fameSvc.setFame);
      expect(mockMatched).toHaveBeenCalledWith("2", "1");
      expect(mocknotifyUser).toHaveBeenCalledWith(
        getDb,
        notificationSvc.createNotification,
        {
          userId : "2",
          type : NOTIFICATION_TYPE.LIKE,
          message : "testuser has liked you",
          createdAt : expect.any(Number),
          id : expect.any(String),
          read : false
        }
      );
      expect(response.body).toEqual({ msg: "liked" });
    });

    it("should return 200 if the like is successful and matched", async () => {
      const mockisUserExistsById = vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
      const mockisLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValueOnce(false);
      const mockaddLike = vi.spyOn(likeSvc, "addLiked").mockResolvedValueOnce();
      const mockaddViewed = vi.spyOn(viewedSvc, "addViewed").mockResolvedValueOnce();
      const mockupdateFameRating = vi.spyOn(fameSvc, "updateFameRating").mockResolvedValueOnce(60);
      const mocknotifyUser = vi.spyOn(notificationSvc, "notifyUser").mockResolvedValue();
      const mockMatched = vi.spyOn(likeSvc, "isMatch").mockResolvedValueOnce(true);
      const response = await request(app)
        .post("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "2" });
      expect(response.status).toBe(201);
      expect(mockisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockisLiked).toHaveBeenCalledWith("1", "2");
      expect(mockaddLike).toHaveBeenCalledWith("1", "2");
      expect(mockaddViewed).toHaveBeenCalledWith("1", "2");
      expect(mockupdateFameRating).toHaveBeenCalledWith("2", ConstMatcha.NEO4j_FAME_INCREMENT_LIKE, fameSvc.getFame, fameSvc.setFame);
      expect(mockMatched).toHaveBeenCalledWith("2", "1");
      expect(mocknotifyUser).toHaveBeenCalledTimes(3);
      expect(mocknotifyUser).toHaveBeenNthCalledWith(
        1,
        getDb,
        notificationSvc.createNotification,
        {
          userId : "2",
          type : NOTIFICATION_TYPE.LIKE,
          message : "testuser has liked you",
          createdAt : expect.any(Number),
          id : expect.any(String),
          read : false
        }
      );
      expect(mocknotifyUser).toHaveBeenNthCalledWith(
        2,
        getDb,
        notificationSvc.createNotification,
        {
          userId : "2",
          type : NOTIFICATION_TYPE.MATCH,
          message : "testuser and you have liked each other",
          createdAt : expect.any(Number),
          id : expect.any(String),
          read : false
        }
      );
      expect(mocknotifyUser).toHaveBeenNthCalledWith(
        3,
        getDb,
        notificationSvc.createNotification,
        {
          userId : "1",
          type : NOTIFICATION_TYPE.MATCH,
          message : "You have just matched!",
          createdAt : expect.any(Number),
          id : expect.any(String),
          read : false
        }
      );
      expect(response.body).toEqual({ msg: "liked" });
    });
  });

  describe("DELETE /api/user/liked", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).delete("/api/user/liked").send({ userid: "2" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if there is no request body", async () => {
      const response = await request(app)
        .delete("/api/user/liked")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: {body : "missing"},
        message: "Request body is missing"
      });
    });

    it("should return 400 if userid is missing", async () => {
      const response = await request(app)
        .delete("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "userid is required",
        context: { userid: "missing" }
      });
    });

    it("should return 400 if userid is empty", async () => {
      const response = await request(app)
        .delete("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "userid is required",
        context: { userid: "missing" }
      });
    });

    it("should return 400 if unlike yourself", async () => {
      const response = await request(app)
        .delete("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "1" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "you cannot unlike yourself",
        context: { userid: "self_unlike" }
      });
    });

    it("should return 400 if the user does not exist", async () => {
      const mockisUserExistsById = vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(false);
      const response = await request(app)
        .delete("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "999" });
      expect(response.status).toBe(404);
      expect(mockisUserExistsById).toHaveBeenCalledWith("999");
      expect(response.body.errors[0]).toEqual({
        message: "user not found",
        context: { userid: "not_found" }
      });
    });

    it("should return 200 if unlike is successful", async () => {
      const mockisUserExistsById = vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
      const mockremoveLike = vi.spyOn(likeSvc, "removeLiked").mockResolvedValueOnce();
      const mockupdateFameRating = vi.spyOn(fameSvc, "updateFameRating").mockResolvedValueOnce(40);
      const mocknotifyUser = vi.spyOn(notificationSvc, "notifyUser").mockResolvedValueOnce();
      const response = await request(app)
        .delete("/api/user/liked")
        .set("Authorization", `Bearer ${token}`)
        .send({ userid: "2" });
      expect(response.status).toBe(200);
      expect(mockisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockremoveLike).toHaveBeenCalledWith("1", "2");
      expect(mockupdateFameRating).toHaveBeenCalledWith("2", ConstMatcha.NEO4j_FAME_DECREMENT_UNLIKE, fameSvc.getFame, fameSvc.setFame);
      expect(mocknotifyUser).toHaveBeenCalledWith(
        getDb,
        notificationSvc.createNotification,
        {
          type: NOTIFICATION_TYPE.UNLIKE,
          userId: "2",
          message: "testuser has unliked you",
          createdAt: expect.any(Number),
          id: expect.any(String),
          read: false
        }
      );
      expect(response.body).toEqual({ msg: "unliked" });
    });
  });

  describe("GET /api/user/liked/matched", async () =>{
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/user/liked/matched");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 200 and list of matched users", async () => {
      const mockProfiles = [
        { id: "1", name: "testuser", age: 25, location: "USA" },
      ];
      const mockgetMatchedById = vi.spyOn(likeSvc, "getMatchedUsersShortProfile").mockResolvedValueOnce(mockProfiles as any);
      const response = await request(app)
        .get("/api/user/liked/matched")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(mockgetMatchedById).toHaveBeenCalledWith("1");
      expect(response.body).toEqual({ data: mockProfiles });
    });

    it("should return 500 if there is an internal server error", async () => {
      const mockgetMatchedById = vi.spyOn(likeSvc, "getMatchedUsersShortProfile").mockRejectedValueOnce(new Error("Database error"));
      const response = await request(app)
        .get("/api/user/liked/matched")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(mockgetMatchedById).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Error getting matched users",
        context: { error: {} }
      });
    });
  });
});