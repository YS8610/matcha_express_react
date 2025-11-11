import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as notificationSvc from "../../service/notificationSvc.js";
import { NOTIFICATION_TYPE } from "../../ConstMatcha.js";
import { getDb } from "../../repo/mongoRepo.js";

let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/notification", () => {

  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/user/notification", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/user/notification");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 200 and notifications if authenticated without any query parameters", async () => {
      const mockgetnotifications = vi.spyOn(notificationSvc, "getNotificationByUserID").mockResolvedValueOnce([
        {
          id: "notif1",
          userId: "1",
          type: NOTIFICATION_TYPE.LIKE,
          message: "User2 liked you",
          read: false,
          createdAt: Date.now()
        }
      ]);
      const response = await request(app)
        .get("/api/user/notification")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(mockgetnotifications).toHaveBeenCalledWith(getDb, "1", 20, 0);
      expect(response.body).toEqual([
        {
          id: "notif1",
          userId: "1",
          type: NOTIFICATION_TYPE.LIKE,
          message: "User2 liked you",
          read: false,
          createdAt: expect.any(Number)
        }
      ]);
    });

    it("should return 200 and notifications if authenticated with 2 query parameters", async () => {
      const mockgetnotifications = vi.spyOn(notificationSvc, "getNotificationByUserID").mockResolvedValueOnce([
        {
          id: "notif2",
          userId: "1",
          type: NOTIFICATION_TYPE.MATCH,
          message: "You have a new match",
          read: true,
          createdAt: Date.now()
        }
      ]);
      const response = await request(app)
        .get("/api/user/notification?limit=100&offset=50")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(mockgetnotifications).toHaveBeenCalledWith(getDb, "1", 100, 50);
      expect(response.body).toEqual([
        {
          id: "notif2",
          userId: "1",
          type: NOTIFICATION_TYPE.MATCH,
          message: "You have a new match",
          read: true,
          createdAt: expect.any(Number)
        }
      ]);
    });

    it("should return 200 if limit and offset are not numbers", async () => {
      const mockgetnotifications = vi.spyOn(notificationSvc, "getNotificationByUserID").mockResolvedValueOnce([]);
      const response = await request(app)
        .get("/api/user/notification?limit=abc&offset=def")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(mockgetnotifications).toHaveBeenCalledWith(getDb, "1", 20, 0);
      expect(response.body).toEqual([]);
    });
  });

  describe("DELETE /api/user/notification", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).delete("/api/user/notification").send({ notificationId: "notif1" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if request body is missing", async () => {
      const response = await request(app)
        .delete("/api/user/notification")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "Request body is missing",
        context : { body: "missing" }
      });
    });

    it("should return 400 if notificationId is missing in request body", async () => {
      const response = await request(app)
        .delete("/api/user/notification")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "bad request. Missing notificationId in request body",
        context: { err: "notificationId is required" }
      });
    });

    it("should return 200 if notification is deleted successfully", async () => {
      const mockdeletenotification = vi.spyOn(notificationSvc, "deleteNotificationByUserID").mockResolvedValueOnce();
      const response = await request(app)
        .delete("/api/user/notification")
        .set("Authorization", `Bearer ${token}`)
        .send({ notificationId: "notif1" });
      expect(response.status).toBe(200);
      expect(mockdeletenotification).toHaveBeenCalledWith(getDb, "1", "notif1");
      expect(response.body).toEqual({ msg: "notification deleted" });
    });

    it("should return 500 if there is an error deleting the notification", async () => {
      const mockdeletenotification = vi.spyOn(notificationSvc, "deleteNotificationByUserID").mockRejectedValueOnce(new Error("Database error"));
      const response = await request(app)
        .delete("/api/user/notification")
        .set("Authorization", `Bearer ${token}`)
        .send({ notificationId: "notif1" });
      expect(response.status).toBe(500);
      expect(mockdeletenotification).toHaveBeenCalledWith(getDb, "1", "notif1");
      expect(response.body.errors[0]).toEqual({
        message: "failed to delete notifications for user",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String)}
      });
    });
  });

  describe("PUT /api/user/notification", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).put("/api/user/notification").send({ notificationId: "notif1" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if notificationId is missing in request body", async () => {
      const response = await request(app)
        .put("/api/user/notification")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "bad request. Missing notificationId in request body",
        context: { err: "notificationId is required" }
      });
    });

    it("should return 404 if notification does not exist", async () => {
      const mockisNotificationExists = vi.spyOn(notificationSvc, "isNotificationExists").mockResolvedValueOnce(false);
      const response = await request(app)
        .put("/api/user/notification")
        .set("Authorization", `Bearer ${token}`)
        .send({ notificationId: "notif1" });
      expect(response.status).toBe(404);
      expect(mockisNotificationExists).toHaveBeenCalledWith(getDb, "1", "notif1");
      expect(response.body.errors[0]).toEqual({
        message: "notification not found",
        context: { err: "notification not found" }
      });
    });

    it("should return 200 if notification is marked as read successfully", async () => {
      const mockisNotificationExists = vi.spyOn(notificationSvc, "isNotificationExists").mockResolvedValueOnce(true);
      const mockmarkNotificationAsRead = vi.spyOn(notificationSvc, "markNotificationAsRead").mockResolvedValueOnce();
      const response = await request(app)
        .put("/api/user/notification")
        .set("Authorization", `Bearer ${token}`)
        .send({ notificationId: "notif1" });
      expect(response.status).toBe(200);
      expect(mockisNotificationExists).toHaveBeenCalledWith(getDb, "1", "notif1");
      expect(mockmarkNotificationAsRead).toHaveBeenCalledWith(getDb, "1", "notif1");
      expect(response.body).toEqual({ msg: "notification marked as read" });
    });

    it("should return 500 if there is an error marking the notification as read", async () => {
      const mockisNotificationExists = vi.spyOn(notificationSvc, "isNotificationExists").mockResolvedValueOnce(true);
      const mockmarkNotificationAsRead = vi.spyOn(notificationSvc, "markNotificationAsRead").mockRejectedValueOnce(new Error("Database error"));
      const response = await request(app)
        .put("/api/user/notification")
        .set("Authorization", `Bearer ${token}`)
        .send({ notificationId: "notif1" });
      expect(response.status).toBe(500);
      expect(mockisNotificationExists).toHaveBeenCalledWith(getDb, "1", "notif1");
      expect(mockmarkNotificationAsRead).toHaveBeenCalledWith(getDb, "1", "notif1");
      expect(response.body.errors[0]).toEqual({
        message: "failed to mark notification as read",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 500 if there is an error checking if notification exists", async () => {
      const mockisNotificationExists = vi.spyOn(notificationSvc, "isNotificationExists").mockRejectedValueOnce(new Error("Database error"));
      const response = await request(app)
        .put("/api/user/notification")
        .set("Authorization", `Bearer ${token}`)
        .send({ notificationId: "notif1" });
      expect(response.status).toBe(500);
      expect(mockisNotificationExists).toHaveBeenCalledWith(getDb, "1", "notif1");
      expect(response.body.errors[0]).toEqual({
        message: "failed to check if notification exists",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });
  });
});