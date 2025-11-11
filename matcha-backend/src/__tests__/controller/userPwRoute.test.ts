import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as authSvc from "../../service/authSvc.js";
import * as userSvc from "../../service/userSvc.js";

let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/pw", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("PUT /api/user/pw", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).put("/api/user/pw").send({});
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if request body is missing", async () => {
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { body: "missing" },
        message: "Request body is missing"
      });
    });

    it("should return 400 if both newPassword and confirmPassword are missing", async () => {
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: "OldPass123!" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { pw: "missing", pw2: "missing", oldPassword: "present" },
        message: "OldPassword, pw and pw2 are required"
      });
    });

    it("should return 400 if currentPassword is missing", async () => {
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ pw2: "NewValidPass123!" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { pw: "missing", pw2: "present", oldPassword: "missing" },
        message: "OldPassword, pw and pw2 are required"
      });
    });

    it("should return 400 if newPassword is missing", async () => {
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ pw: "OldPass123!" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { pw: "present", pw2: "missing", oldPassword: "missing" },
        message: "OldPassword, pw and pw2 are required"
      });
    });

    it("should return 400 if pw and pw2 do not match", async () => {
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: "OldPass123!", pw: "NewValidPass123!", pw2: "DifferentPass123!" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { pw: "mismatch", confirmationPassword: "mismatch" },
        message: "New password and confirmation password do not match"
      });
    });

    it("should return 400 if new password is same as old password", async () => {
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: "SamePass123!", pw: "SamePass123!", pw2: "SamePass123!" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { oldPassword: "same", pw: "same" },
        message: "New password must be different from old password"
      });
    });

    it("should return 400 if new password is insecure", async () => {
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: "OldPass123!", pw: "short", pw2: "short" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: {
          "min 8 char": "missing",
          "upper case": "missing",
          "lower case": "present",
          "number": "missing",
          "special char": "missing"
        },
        message: "Invalid/insecure password format"
      });
    });

    it("should return 400 if old password is incorrect", async () => {
      const verifyPWMock = vi.spyOn(authSvc, "verifyPW").mockResolvedValue(false);
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: "WrongOldPass123!", pw: "NewValidPass123!", pw2: "NewValidPass123!" });
      expect(response.status).toBe(400);
      expect(verifyPWMock).toHaveBeenCalledWith(expect.any(String), "WrongOldPass123!");
      expect(response.body.errors[0]).toEqual({
        context: { oldPassword: "incorrect" },
        message: "Old password is incorrect"
      });
    });

    it("should return 200 if password is changed successfully", async () => {
      const getHashedPwByIdMock = vi.spyOn(userSvc, "getHashedPwById").mockResolvedValue("$2b$10$abcdefghijklmnopqrstuv");
      const verifyPWMock = vi.spyOn(authSvc, "verifyPW").mockResolvedValue(true);
      const hashPWMock = vi.spyOn(authSvc, "hashPW").mockResolvedValue("$2b$10$newhashedpasswordvalue");
      const updateUserPwByIdMock = vi.spyOn(userSvc, "setPwById").mockResolvedValue();
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: "CorrectOldPass123!", pw: "NewValidPass123!", pw2: "NewValidPass123!" });
      expect(response.status).toBe(200);
      expect(getHashedPwByIdMock).toHaveBeenCalledWith("1");
      expect(verifyPWMock).toHaveBeenCalledWith("$2b$10$abcdefghijklmnopqrstuv", "CorrectOldPass123!");
      expect(hashPWMock).toHaveBeenCalledWith("NewValidPass123!");
      expect(updateUserPwByIdMock).toHaveBeenCalledWith("1", "$2b$10$newhashedpasswordvalue");
      expect(response.body).toEqual({ msg: "Password updated successfully" });
    });

    it("should return 500 if error occurs when getting hashed password", async () => {
      const getHashedPwByIdMock = vi.spyOn(userSvc, "getHashedPwById").mockRejectedValue(new Error("DB error"));
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: "CorrectOldPass123!", pw: "NewValidPass123!", pw2: "NewValidPass123!" });
      expect(response.status).toBe(500);
      expect(getHashedPwByIdMock).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to get hashed password",
        context: { error: {}, errorMsg: "DB error", errorStack: expect.any(String) }
      });
    });

    it("should return 500 if error occurs verifying old password", async () => {
      const getHashedPwByIdMock = vi.spyOn(userSvc, "getHashedPwById").mockResolvedValue("$2b$10$abcdefghijklmnopqrstuv");
      const verifyPWMock = vi.spyOn(authSvc, "verifyPW").mockRejectedValue(new Error("Hashing error"));
      const response = await request(app)
        .put("/api/user/pw")
        .set("Authorization", `Bearer ${token}`)
        .send({ oldPassword: "CorrectOldPass123!", pw: "NewValidPass123!", pw2: "NewValidPass123!" });
      expect(response.status).toBe(500);
      expect(getHashedPwByIdMock).toHaveBeenCalledWith("1");
      expect(verifyPWMock).toHaveBeenCalledWith("$2b$10$abcdefghijklmnopqrstuv", "CorrectOldPass123!");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to verify password",
        context: { error: {}, errorMsg: "Hashing error", errorStack: expect.any(String) }
      });
    });
  });

  it("should return 500 if error occurs hashing new password", async () => {
    const getHashedPwByIdMock = vi.spyOn(userSvc, "getHashedPwById").mockResolvedValue("$2b$10$abcdefghijklmnopqrstuv");
    const verifyPWMock = vi.spyOn(authSvc, "verifyPW").mockResolvedValue(true);
    const hashPWMock = vi.spyOn(authSvc, "hashPW").mockRejectedValue(new Error("Hashing error"));
    const response = await request(app)
      .put("/api/user/pw")
      .set("Authorization", `Bearer ${token}`)
      .send({ oldPassword: "CorrectOldPass123!", pw: "NewValidPass123!", pw2: "NewValidPass123!" });
    expect(response.status).toBe(500);
    expect(getHashedPwByIdMock).toHaveBeenCalledWith("1");
    expect(verifyPWMock).toHaveBeenCalledWith("$2b$10$abcdefghijklmnopqrstuv", "CorrectOldPass123!");
    expect(response.body.errors[0]).toEqual({
      message: "Failed to hash password",
      context: { error: {}, errorMsg: "Hashing error", errorStack: expect.any(String) }
    });
  });

  it("should return 500 if error occurs updating password in database", async () => {
    const getHashedPwByIdMock = vi.spyOn(userSvc, "getHashedPwById").mockResolvedValue("$2b$10$abcdefghijklmnopqrstuv");
    const verifyPWMock = vi.spyOn(authSvc, "verifyPW").mockResolvedValue(true);
    const hashPWMock = vi.spyOn(authSvc, "hashPW").mockResolvedValue("$2b$10$newhashedpasswordvalue");
    const updateUserPwByIdMock = vi.spyOn(userSvc, "setPwById").mockRejectedValue(new Error("DB error"));
    const response = await request(app)
      .put("/api/user/pw")
      .set("Authorization", `Bearer ${token}`)
      .send({ oldPassword: "CorrectOldPass123!", pw: "NewValidPass123!", pw2: "NewValidPass123!" });
    expect(response.status).toBe(500);
    expect(getHashedPwByIdMock).toHaveBeenCalledWith("1");
    expect(verifyPWMock).toHaveBeenCalledWith("$2b$10$abcdefghijklmnopqrstuv", "CorrectOldPass123!");
    expect(hashPWMock).toHaveBeenCalledWith("NewValidPass123!");
    expect(updateUserPwByIdMock).toHaveBeenCalledWith("1", "$2b$10$newhashedpasswordvalue");
    expect(response.body.errors[0]).toEqual({
      message: "Failed to update password",
      context: { error: {}, errorMsg: "DB error", errorStack: expect.any(String) }
    });
  });
});


