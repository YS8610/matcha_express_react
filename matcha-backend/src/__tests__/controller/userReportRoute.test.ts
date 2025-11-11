import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as userSvc from "../../service/userSvc.js";
import * as reportSvc from "../../service/reportSvc.js";

let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/report", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("POST /api/user/report", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).post("/api/user/report").send({});
      expect(response.status).toBe(401);
      expect(response.body).toEqual({msg: "unauthorised. You need to be authenticated to access this resource"});
    });

    it("should return 400 if reason is missing", async () => {
      const response = await request(app)
        .post("/api/user/report/some-other-id")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { error: "Reason must be at least 10 characters long" },
        message: "Reason for report is required"
      });
    });

    it("should return 404 if path parameter is missing", async () => {
      const response = await request(app)
        .post("/api/user/report/")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "This is a valid reason" });
      expect(response.status).toBe(404); // because route does not match
      expect(response.body.errors[0]).toEqual({
        context: { msg : "The requested endpoint does not exist." },
        message: "invalid endpoint"
      });
    });

    it("should return 400 if trying to report self", async () => {
      const response = await request(app)
        .post("/api/user/report/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "This is a valid reason" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { error: "Self-reporting attempt" },
        message: "You cannot report yourself"
      });
    });

    it("should return 400 if reporting a non-existent user", async () => {
      vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(false);
      const response = await request(app)
        .post("/api/user/report/non-existent-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "This is a valid reason" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { error: "Reported user does not exist" },
        message: "The user you are trying to report does not exist"
      });
    });

    it("should return 400 if user has already reported the other user", async () => {
      vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
      vi.spyOn(reportSvc, "isUserReported").mockResolvedValueOnce(true);
      const response = await request(app)
        .post("/api/user/report/other-user-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "This is a valid reason" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { error: "Duplicate report attempt" },
        message: "You have already reported this user"
      });
    });

    it("should return 400 if reason is too short", async () => {
      const response = await request(app)
        .post("/api/user/report/other-user-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "short" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { error: "Reason must be at least 10 characters long" },
        message: "Reason for report is required"
      });
    });

    it("should return 500 if there is a server error during user existence check", async () => {
      vi.spyOn(userSvc, "isUserExistsById").mockImplementationOnce(() => {
        throw new Error("Database error");
      });
      const response = await request(app)
        .post("/api/user/report/other-user-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "This is a valid reason for reporting" });
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "failed to check if user exists"
      });
    });

    it("should return 500 if there is a server error during isReported check", async () => {
      vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
      vi.spyOn(reportSvc, "isUserReported").mockImplementationOnce(() => {
        throw new Error("Database error");
      });
      const response = await request(app)
        .post("/api/user/report/other-user-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "This is a valid reason for reporting" });
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "failed to check if user is already reported"
      });
    });

    it("should return 500 if there is a server error during reportUser", async () => {
      vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
      vi.spyOn(reportSvc, "isUserReported").mockResolvedValueOnce(false);
      vi.spyOn(reportSvc, "reportUser").mockImplementationOnce(() => {
        throw new Error("Database error");
      });
      const response = await request(app)
        .post("/api/user/report/other-user-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "This is a valid reason for reporting" });
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) },
        message: "failed to report user"
      });
    });

    it("should return 200 if report is successful", async () => {
      vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
      vi.spyOn(reportSvc, "isUserReported").mockResolvedValueOnce(false);
      vi.spyOn(reportSvc, "reportUser").mockResolvedValueOnce();
      const response = await request(app)
        .post("/api/user/report/other-user-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ reason: "This is a valid reason for reporting" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ msg: "Report submitted successfully" });
    });



  });
});