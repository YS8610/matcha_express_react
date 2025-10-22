import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
vi.mock("argon2", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    verify: vi.fn(),
    hash: vi.fn(),
  };
});
import appfunc from "../../app.js";
import { type Express } from "express-serve-static-core";
import * as authSvc from "../../service/authSvc.js";
import * as argon2 from "argon2";
import * as jwtSvc from "../../service/jwtSvc.js";
import * as userSvc from "../../service/userSvc.js";
import { ProfileDb } from "../../model/profile.js";

let app: Express;

describe("testing functions in authSvc", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("verifyPW: should return true for correct password", async () => {
    (argon2.verify as any).mockResolvedValueOnce(true);
    const result = await authSvc.verifyPW("somehash", "correctpassword");
    expect(result).toBe(true);
    expect(argon2.verify).toHaveBeenCalledWith("somehash", "correctpassword", authSvc.option);
  });

  it("verifyPW: should return false for incorrect password", async () => {
    (argon2.verify as any).mockResolvedValueOnce(false);
    const result = await authSvc.verifyPW("somehash", "wrongpassword");
    expect(result).toBe(false);
    expect(argon2.verify).toHaveBeenCalledWith("somehash", "wrongpassword", authSvc.option);
  });

  it("verifyPW: should throw error if argon2.verify fails", async () => {
    (argon2.verify as any).mockRejectedValueOnce(new Error("Verification error"));
    await expect(authSvc.verifyPW("somehash", "anyPassword")).rejects.toThrow("Verification error");
    expect(argon2.verify).toHaveBeenCalledWith("somehash", "anyPassword", authSvc.option);
  });

  it("hashPW: should return hashed password", async () => {
    (argon2.hash as any).mockResolvedValueOnce("hashedpassword");
    const result = await authSvc.hashPW("mypassword");
    expect(result).toBe("hashedpassword");
    expect(argon2.hash).toHaveBeenCalledWith("mypassword", authSvc.option);
  });

  it("hashPW: should throw error if argon2.hash fails", async () => {
    (argon2.hash as any).mockRejectedValueOnce(new Error("Hashing error"));
    await expect(authSvc.hashPW("mypassword")).rejects.toThrow("Hashing error");
    expect(argon2.hash).toHaveBeenCalledWith("mypassword", authSvc.option);
  });

  it("loginSvc: should return token for valid credentials", async () => {
    const mockUser: Partial<ProfileDb> = {
      id: "1",
      email: "test@example.com",
      pw: "hashedpassword",
      activated: true,
      username: "testuser"
    };
    vi.spyOn(userSvc, "getUserByUsername").mockResolvedValueOnce(mockUser as any);
    (argon2.verify as any).mockResolvedValueOnce(true);
    vi.spyOn(jwtSvc, "createToken").mockResolvedValueOnce("token");
    const result = await authSvc.loginSvc("testuser", "correctpassword");
    expect(result).toBe("token");
    expect(userSvc.getUserByUsername).toHaveBeenCalledWith("testuser");
    expect(argon2.verify).toHaveBeenCalledWith("hashedpassword", "correctpassword", authSvc.option);
    expect(jwtSvc.createToken).toHaveBeenCalledWith(mockUser.id, mockUser.email, mockUser.username, mockUser.activated);
  });

  it("loginSvc: should return empty string for invalid username", async () => {
    vi.spyOn(userSvc, "getUserByUsername").mockResolvedValueOnce(null);
    const result = await authSvc.loginSvc("invaliduser", "anyPassword");
    expect(result).toBe("");
    expect(userSvc.getUserByUsername).toHaveBeenCalledWith("invaliduser");
  });

  it("loginSvc: should throw error for unactivated account", async () => {
    const mockUser: Partial<ProfileDb> = {
      id: "1",
      email: "test@example.com",
      pw: "hashedpassword",
      activated: false,
      username: "testuser"
    };
    vi.spyOn(userSvc, "getUserByUsername").mockResolvedValueOnce(mockUser as any);
    const result = authSvc.loginSvc("testuser", "correctpassword");
    await expect(result).rejects.toThrow("Account not activated. Please check your email for the activation link.");
    expect(userSvc.getUserByUsername).toHaveBeenCalledWith("testuser");
  });

  it("loginSvc: should return empty string if incorrect password is entered for activated user", async () => {
    const mockUser: Partial<ProfileDb> = {
      id: "1",
      email: "test@example.com",
      pw: "hashedpassword",
      activated: true,
      username: "testuser"
    };
    vi.spyOn(userSvc, "getUserByUsername").mockResolvedValueOnce(mockUser as any);
    const result = await authSvc.loginSvc("testuser", "wrongpassword");
    (argon2.verify as any).mockResolvedValueOnce(false);
    expect(result).toBe("");
    expect(userSvc.getUserByUsername).toHaveBeenCalledWith("testuser");
    expect(argon2.verify).toHaveBeenCalledWith("hashedpassword", "wrongpassword", authSvc.option);
  });

  it("loginSvc: should throw error if getUserByUsername fails", async () => {
    vi.spyOn(userSvc, "getUserByUsername").mockRejectedValueOnce(new Error("Database error"));
    await expect(authSvc.loginSvc("testuser", "anyPassword")).rejects.toThrow("Failed to get user by username");
    expect(userSvc.getUserByUsername).toHaveBeenCalledWith("testuser");
  });

  it("loginSvc: should throw error if verifyPW fails", async () => {
    const mockUser: Partial<ProfileDb> = {
      id: "1",
      email: "test@example.com",
      pw: "hashedpassword",
      activated: true,
      username: "testuser"
    };
    vi.spyOn(userSvc, "getUserByUsername").mockResolvedValueOnce(mockUser as any);
    (argon2.verify as any).mockRejectedValueOnce(new Error("Verification error"));
    await expect(authSvc.loginSvc("testuser", "anyPassword")).rejects.toThrow("Failed to verify password");
    expect(userSvc.getUserByUsername).toHaveBeenCalledWith("testuser");
    expect(argon2.verify).toHaveBeenCalledWith("hashedpassword", "anyPassword", authSvc.option);
  });

});
