import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as userSvc from "../../service/userSvc.js";

let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/profile", () => {

  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("GET /api/user/profile", async () => {
    it("should return 403 if no token provided", async () => {
      const res = await request(app)
        .get("/api/user/profile");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if user does not exist", async () => {
      const mockedgetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValueOnce(null);
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toEqual({
        context: { id: "not_found" },
        message: "User profile not found"
      });
      expect(mockedgetUserProfileById).toHaveBeenCalledOnce();
      expect(mockedgetUserProfileById).toHaveBeenCalledWith("1");
    });

    it("should return 200 and user profile data if user is not activated and accessing own profile", async () => {
      const nonActivatedToken = await createToken("1", "testuser@email.com", "testuser", false);
      const mockProfile = {
        id: "1",
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "testuser@email.com",
        birthDate: { year: { low: 1990, high: 0 }, month: { low: 5, high: 0 }, day: { low: 15, high: 0 } },
        biography: "",
        sexualPreference: -1,
        fameRating: 0,
        photo0: "",
        photo1: "",
        photo2: "",
        photo3: "",
        photo4: "",
        lastOnline: 1234567890,
        gender: -1,
      };
      const mockedgetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValueOnce(mockProfile as any);
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${nonActivatedToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: "1",
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "testuser@email.com",
        birthDate: { year: { low: 1990, high: 0 }, month: { low: 5, high: 0 }, day: { low: 15, high: 0 } },
        biography: "",
        sexualPreference: -1,
        fameRating: 0,
        photo0: "",
        photo1: "",
        photo2: "",
        photo3: "",
        photo4: "",
        lastOnline: expect.any(Number),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        gender: -1,
      });
      expect(mockedgetUserProfileById).toHaveBeenCalledOnce();
      expect(mockedgetUserProfileById).toHaveBeenCalledWith("1");
    });

    it("should return 200 and user profile data", async () => {
      const mockProfile = {
        id: "1",
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "testuser@email.com",
        birthDate: "1999-12-31",
      };
      const mockedgetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValueOnce(mockProfile as any);
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: "1",
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "testuser@email.com",
        gender: -1,
        sexualPreference: -1,
        biography: "",
        birthDate: "1999-12-31",
        fameRating: 0,
        photo0: "",
        photo1: "",
        photo2: "",
        photo3: "",
        photo4: "",
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        lastOnline: expect.any(Number),
      });
      expect(mockedgetUserProfileById).toHaveBeenCalledOnce();
      expect(mockedgetUserProfileById).toHaveBeenCalledWith("1");
    });

    it("should handle server error gracefully", async () => {
      const mockedgetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockRejectedValueOnce(new Error("Database error"));
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(500);
      expect(res.body.errors[0]).toEqual({
        message: "Error getting user profile",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
      expect(mockedgetUserProfileById).toHaveBeenCalledOnce();
      expect(mockedgetUserProfileById).toHaveBeenCalledWith("1");
    });

  });

  describe("PUT /api/user/profile", async () => {
    it("should return 403 if no token provided", async () => {
      const res = await request(app)
        .put("/api/user/profile")
        .send({});
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if birthDate is invalid", async () => {
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ birthDate: "invalid-date" });
      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toEqual({
        context: {
          biography: "invalid. should be string of length between 5 and 500",
          birthDate: "Invalid birthDate format. Expected format: YYYY-MM-DD",
          email: "invalid",
          firstName: "invalid. should be string of length between 2 and 50",
          gender: "invalid. should be number between 0 and 2",
          lastName: "invalid. should be string of length between 2 and 50",
          sexualPreference: "invalid. should be number between 0 and 2",
        },
        message: "Profile validation failed"
      });
    });

    it("should return 400 if required fields are missing or invalid", async () => {
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "",
          lastName: "",
          email: "invalid-email",
          gender: "abc",
          sexualPreference: "abc",
          biography: "short",
          birthDate: "1990-12-10"
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toEqual({
        context: {
          firstName: "invalid. should be string of length between 2 and 50",
          lastName: "invalid. should be string of length between 2 and 50",
          email: "invalid",
          gender: "invalid. should be number between 0 and 2",
          sexualPreference: "invalid. should be number between 0 and 2",
          biography: "valid",
          birthDate: "valid"
        },
        message: "Profile validation failed"
      });
    });

    it("should return 200 if profile updated successfully and not activated", async () => {
      const mockedsetUserProfileById = vi.spyOn(userSvc, "setUserProfileById").mockResolvedValueOnce();
      const nonActivatedToken = await createToken("1", "testuser", "testuser@email.com", false);
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${nonActivatedToken}`)
        .send({
          firstName: "Updated",
          lastName: "User",
          email: "updateduser@Email.com",
          birthDate: "1990-01-01",
          gender: 1,
          sexualPreference: 1,
          biography: "This is a valid biography."
        });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ msg: "profile updated" });
      expect(mockedsetUserProfileById).toHaveBeenCalledOnce();
      expect(mockedsetUserProfileById).toHaveBeenCalledWith("1", {
        firstName: "Updated",
        lastName: "User",
        email: "updateduser@Email.com",
        birthDate: "1990-01-01",
        gender: 1,
        sexualPreference: 1,
        biography: "This is a valid biography."
      });
    });

    it("should return 400 if profile validation fails", async () => {
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "A",
          lastName: "B",
          email: "invalid-email",
          birthDate: "1990-12-12",
          gender: 5,
          sexualPreference: -1,
          biography: "Biofgdfg"
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toEqual({
        context: {
          firstName: "invalid. should be string of length between 2 and 50",
          lastName: "invalid. should be string of length between 2 and 50",
          email: "invalid",
          biography: "valid",
          birthDate: "valid",
          gender: "invalid. should be number between 0 and 2",
          sexualPreference: "invalid. should be number between 0 and 2"
        },
        message: "Profile validation failed"
      });
    });

    it("should return 400 if first name and last name are too long", async () => {
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "A".repeat(51),
          lastName: "B".repeat(51),
          email: "validemail@example.com",
          birthDate: "1990-12-12",
          gender: 1,
          sexualPreference: 1,
          biography: "This is a valid biography."
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toEqual({
        context: {
          firstName: "invalid. should be string of length between 2 and 50",
          lastName: "invalid. should be string of length between 2 and 50",
          email: "valid",
          biography: "valid",
          birthDate: "valid",
          gender: "valid",
          sexualPreference: "valid"
        },
        message: "Profile validation failed"
      });
    });

    it("should return 400 if biography is too long", async () => {
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Valid",
          lastName: "User",
          email: "validemail@example.com",
          birthDate: "1990-12-12",
          gender: 1,
          sexualPreference: 1,
          biography: "A".repeat(501)
        });
      expect(res.status).toBe(400);
      expect(res.body.errors[0]).toEqual({
        context: {
          firstName: "valid",
          lastName: "valid",
          email: "valid",
          biography: "invalid. should be string of length between 5 and 500",
          birthDate: "valid",
          gender: "valid",
          sexualPreference: "valid"
        },
        message: "Profile validation failed"
      });
    });

    it("should return 200 if profile updated successfully", async () => {
      const mockedsetUserProfileById = vi.spyOn(userSvc, "setUserProfileById").mockResolvedValueOnce();
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Updated",
          lastName: "User",
          email: "updateduser@Email.com",
          birthDate: "1990-01-01",
          gender: 1,
          sexualPreference: 1,
          biography: "This is a valid biography."
        });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ msg: "profile updated" });
      expect(mockedsetUserProfileById).toHaveBeenCalledOnce();
      expect(mockedsetUserProfileById).toHaveBeenCalledWith("1", {
        firstName: "Updated",
        lastName: "User",
        email: "updateduser@Email.com",
        birthDate: "1990-01-01",
        gender: 1,
        sexualPreference: 1,
        biography: "This is a valid biography."
      });
    });

    it("should handle server error gracefully", async () => {
      const mockedsetUserProfileById = vi.spyOn(userSvc, "setUserProfileById").mockRejectedValueOnce(new Error("Database error"));
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "Updated",
          lastName: "User",
          email: "updateduser@Email.com",
          gender: 1,
          sexualPreference: 1,
          biography: "This is a valid biography.",
          birthDate: "1990-01-01"
        });
      expect(res.status).toBe(500);
      expect(res.body.errors[0]).toEqual({
        message: "Error updating profile",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
      expect(mockedsetUserProfileById).toHaveBeenCalledOnce();
      expect(mockedsetUserProfileById).toHaveBeenCalledWith("1", {
        firstName: "Updated",
        lastName: "User",
        email: "updateduser@Email.com",
        birthDate: "1990-01-01",
        gender: 1,
        sexualPreference: 1,
        biography: "This is a valid biography."
      });
    });
  });
});