import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import { NOTIFICATION_TYPE } from "../../ConstMatcha.js";
import { getDb } from "../../repo/mongoRepo.js";
import { createNotification } from "../../service/notificationSvc.js";

let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/viewed", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/user/viewed/", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/user/viewed/");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 200 and viewed users list if authenticated", async () => {
      const mockedgetVisitedById = vi.spyOn(await import("../../service/viewedSvc.js"), "getVisitedById").mockResolvedValue([
        {
          id: "2",
          username: "vieweduser1",
          firstName: "Viewed User One",
          lastName: "Test",
          birthDate: { year: { low: 1990, high: 0 }, month: { low: 1, high: 0 }, day: { low: 1, high: 0 } },
          fameRating: 50,
          photo0: "http://example.com/photo1.jpg",
          lastOnline: 1625155200,
        },
      ]);
      const response = await request(app)
        .get("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(mockedgetVisitedById).toHaveBeenCalledWith("1");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toEqual([
        {
          id: "2",
          username: "vieweduser1",
          firstName: "Viewed User One",
          lastName: "Test",
          birthDate: { year: { low: 1990, high: 0 }, month: { low: 1, high: 0 }, day: { low: 1, high: 0 } },
          fameRating: 50,
          photo0: "http://example.com/photo1.jpg",
          lastOnline: 1625155200,
        },
      ]);
    });

    it("should return 500 if server error occurs", async () => {
      const mockedgetVisitedById = vi.spyOn(await import("../../service/viewedSvc.js"), "getVisitedById").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(mockedgetVisitedById).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to get viewed users",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String)}
      })
    });
  });

  describe("GET /api/user/viewed/by", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/user/viewed/by");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 200 and users who viewed the authenticated user", async () => {
      const mockedgetViewedById = vi.spyOn(await import("../../service/viewedSvc.js"), "getViewedById").mockResolvedValue([
        {
          id: "3",
          username: "vieweruser1",
          firstName: "Viewer User One",
          lastName: "Test",
          birthDate: { year: { low: 1985, high: 0 }, month: { low: 5, high: 0 }, day: { low: 15, high: 0 } },
          fameRating: 70,
          photo0: "http://example.com/photo2.jpg",
          lastOnline: 1625241600,
        },
      ]);
      const response = await request(app)
        .get("/api/user/viewed/by")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(mockedgetViewedById).toHaveBeenCalledWith("1");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toEqual([
        {
          id: "3",
          username: "vieweruser1",
          firstName: "Viewer User One",
          lastName: "Test",
          birthDate: { year: { low: 1985, high: 0 }, month: { low: 5, high: 0 }, day: { low: 15, high: 0 } },
          fameRating: 70,
          photo0: "http://example.com/photo2.jpg",
          lastOnline: 1625241600,
        },
      ]);
    });

    it("should return 500 if server error occurs", async () => {
      const mockedgetViewedById = vi.spyOn(await import("../../service/viewedSvc.js"), "getViewedById").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/user/viewed/by")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(mockedgetViewedById).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to get users who viewed you",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String)}
      })
    });
  });

  describe("POST /api/user/viewed/", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).post("/api/user/viewed/").send({ viewedUserID: "2" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if viewedUserID is missing", async () => {
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "viewedUserID is required",
        context: { viewedUserID: "missing" }
      });
    });

    it("should return 400 if trying to view oneself", async () => {
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "1" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "Cannot view yourself",
        context: { viewedUserID: "self_view" }
      });
    });

    it("should return 404 if viewed user does not exist", async () => {
      const mockedisUserExistsById = vi.spyOn(await import("../../service/userSvc.js"), "isUserExistsById").mockResolvedValue(false);
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "999" });
      expect(response.status).toBe(404);
      expect(mockedisUserExistsById).toHaveBeenCalledWith("999");
      expect(response.body.errors[0]).toEqual({
        message: "Viewed user does not exist",
        context: { viewedUserID: "not_found" }
      });
    });

    it("should return 403 if the viewed user is blocked", async () => {
      const mockedisUserExistsById = vi.spyOn(await import("../../service/userSvc.js"), "isUserExistsById").mockResolvedValue(true);
      const mockedgetBlockedRel = vi.spyOn(await import("../../service/blockSvc.js"), "getBlockedRel").mockResolvedValue(true);
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "2" });
      expect(response.status).toBe(403);
      expect(mockedisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockedgetBlockedRel).toHaveBeenCalledWith("1", "2");
      expect(response.body.errors[0]).toEqual({
        message: "User is blocked or being blocked",
        context: { userId: "blocked or being blocked" }
      });
    });

    it("should return 400 if the user has already been viewed", async () => {
      const mockedisUserExistsById = vi.spyOn(await import("../../service/userSvc.js"), "isUserExistsById").mockResolvedValue(true);
      const mockedgetBlockedRel = vi.spyOn(await import("../../service/blockSvc.js"), "getBlockedRel").mockResolvedValue(false);
      const mockedisViewed = vi.spyOn(await import("../../service/viewedSvc.js"), "isViewed").mockResolvedValue(true);
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "2" });
      expect(response.status).toBe(400);
      expect(mockedisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockedgetBlockedRel).toHaveBeenCalledWith("1", "2");
      expect(mockedisViewed).toHaveBeenCalledWith("1", "2");
      expect(response.body.errors[0]).toEqual({
        message: "User has already been viewed",
        context: { "viewedUserID": "already_viewed" }
      });
    });

    it("should return 201 if viewing is recorded successfully", async () => {
      const mockedisUserExistsById = vi.spyOn(await import("../../service/userSvc.js"), "isUserExistsById").mockResolvedValue(true);
      const mockedgetBlockedRel = vi.spyOn(await import("../../service/blockSvc.js"), "getBlockedRel").mockResolvedValue(false);
      const mockedisViewed = vi.spyOn(await import("../../service/viewedSvc.js"), "isViewed").mockResolvedValue(false);
      const mockedrecordView = vi.spyOn(await import("../../service/viewedSvc.js"), "addViewed").mockResolvedValue();
      const mockednotifyUser = vi.spyOn(await import("../../service/notificationSvc.js"), "notifyUser").mockResolvedValue();
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "2" });
      expect(response.status).toBe(201);
      expect(mockedisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockedgetBlockedRel).toHaveBeenCalledWith("1", "2");
      expect(mockedisViewed).toHaveBeenCalledWith("1", "2");
      expect(mockedrecordView).toHaveBeenCalledWith("1", "2");
      expect(mockednotifyUser).toHaveBeenCalledWith(
        getDb,
        createNotification,
        {
          userId: "2",
          type: NOTIFICATION_TYPE.VIEW,
          message: "testuser has viewed your profile",
          createdAt: expect.any(Number),
          id: expect.any(String),
          read: false,
        }
      );
      expect(response.body).toEqual({ msg: "view recorded" });
    });

    it("should return 500 if isUserExistsById throws error", async () => {
      const mockedisUserExistsById = vi.spyOn(await import("../../service/userSvc.js"), "isUserExistsById").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "2" });
      expect(response.status).toBe(500);
      expect(mockedisUserExistsById).toHaveBeenCalledWith("2");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to check if user exists",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 500 if getBlockedRel throws error", async () => {
      const mockedisUserExistsById = vi.spyOn(await import("../../service/userSvc.js"), "isUserExistsById").mockResolvedValue(true);
      const mockedgetBlockedRel = vi.spyOn(await import("../../service/blockSvc.js"), "getBlockedRel").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "2" });
      expect(response.status).toBe(500);
      expect(mockedisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockedgetBlockedRel).toHaveBeenCalledWith("1", "2");
      expect(response.body.errors[0]).toEqual({
        message: "Error checking if user is blocked",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 500 if isViewed throws error", async () => {
      const mockedisUserExistsById = vi.spyOn(await import("../../service/userSvc.js"), "isUserExistsById").mockResolvedValue(true);
      const mockedgetBlockedRel = vi.spyOn(await import("../../service/blockSvc.js"), "getBlockedRel").mockResolvedValue(false);
      const mockedisViewed = vi.spyOn(await import("../../service/viewedSvc.js"), "isViewed").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "2" });
      expect(response.status).toBe(500);
      expect(mockedisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockedgetBlockedRel).toHaveBeenCalledWith("1", "2");
      expect(mockedisViewed).toHaveBeenCalledWith("1", "2");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to check if already viewed",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 500 if addViewed throws error", async () => {
      const mockedisUserExistsById = vi.spyOn(await import("../../service/userSvc.js"), "isUserExistsById").mockResolvedValue(true);
      const mockedgetBlockedRel = vi.spyOn(await import("../../service/blockSvc.js"), "getBlockedRel").mockResolvedValue(false);
      const mockedisViewed = vi.spyOn(await import("../../service/viewedSvc.js"), "isViewed").mockResolvedValue(false);
      const mockedrecordView = vi.spyOn(await import("../../service/viewedSvc.js"), "addViewed").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .post("/api/user/viewed/")
        .set("Authorization", `Bearer ${token}`)
        .send({ viewedUserID: "2" });
      expect(response.status).toBe(500);
      expect(mockedisUserExistsById).toHaveBeenCalledWith("2");
      expect(mockedgetBlockedRel).toHaveBeenCalledWith("1", "2");
      expect(mockedisViewed).toHaveBeenCalledWith("1", "2");
      expect(mockedrecordView).toHaveBeenCalledWith("1", "2");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to record viewed user",
        context: { error: {}, errorMsg : "Database error", errorStack: expect.any(String) }
      });
    });
  });

});