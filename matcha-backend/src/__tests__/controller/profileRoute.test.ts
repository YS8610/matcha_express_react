import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as blockSvc from "../../service/blockSvc.js";
import * as userSvc from "../../service/userSvc.js";
import * as likeSvc from "../../service/likeSvc.js";
import * as locationSvc from "../../service/locationSvc.js";
import { ProfileShort } from "../../model/profile.js";

let app: Express;

const token = await createToken("1", "user@example.com", "testuser", true);

describe("Route /api/profile", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/profile/", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/profile/").send();
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 500 if there is error in getUserProfileById", async () => {
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("1");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error getting user profile",
      });
    });

    it("should return 500 if there is error in getUserLocation", async () => {
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValue({
        id: "1",
        username: "testuser",
        email: "email"
      } as any);
      const mockedGetUserLocation = vi.spyOn(locationSvc, "getUserLocation").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(500);
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("1");
      expect(mockedGetUserLocation).toHaveBeenCalled();
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error getting user location",
      });
    });

    it("should return 400 if there is no user profile", async () => {
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValue(null);
      const response = await request(app)
        .get("/api/profile/")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("1");
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { id: "not_found" },
        message: "User profile not found"
      });
    });


  });

  describe("GET /api/profile/short/:userId", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/profile/short/2").send();
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if there is no path variable", async () => {
      const response = await request(app)
        .get("/api/profile/short/")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { id: "not_found" },
        message: "User profile not found"
      });
    });

    it("should return 403 if the user is blocked", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(true);
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(403);
      expect(response.body.errors[0]).toEqual({
        message: "User is blocked or is blocking you",
        context: { userId: "blocked or blocking" },
      });
    });

    it("should return 400 if there is no such user id", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetShortProfileById = vi.spyOn(userSvc, "getShortProfileById").mockResolvedValue(null);
      const response = await request(app)
        .get("/api/profile/short/ads")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "User profile not found",
        context: { id: "not_found" },
      });
    });

    it("should return 500 if there is error in isBlocked check", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error checking if user blocked or is blocked",
      });
    });

    it("should return 500 if there is error in getShortProfileById", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetShortProfileById = vi.spyOn(userSvc, "getShortProfileById").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error getting user profile",
      });
    });

    it("should return 500 if there is error in isMatch", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetShortProfileById = vi.spyOn(userSvc, "getShortProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
      } as ProfileShort);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedGetShortProfileById).toHaveBeenCalledWith("2");
      expect(mockedIsMatch).toHaveBeenCalledWith("1", "2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error checking match status",
      });
    });

    it("should return 500 if there is error in isLiked", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetShortProfileById = vi.spyOn(userSvc, "getShortProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
      } as ProfileShort);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(false);
      const mockedIsLiked = vi.spyOn(likeSvc, "isLiked").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetShortProfileById).toHaveBeenCalledWith("2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error checking liked status",
      });
    });

    it("should return 500 if there is error in isLikedBack", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetShortProfileById = vi.spyOn(userSvc, "getShortProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
      } as ProfileShort);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(false);
      const mockedIsLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValue(false);
      const mockedIsLikedBack = vi.spyOn(likeSvc, "isLikedBack").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetShortProfileById).toHaveBeenCalledWith("2");
      expect(mockedIsLikedBack).toHaveBeenCalledWith("2", "1");
      expect(mockedIsLiked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsMatch).toHaveBeenCalledWith("1", "2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error checking liked back status",
      });
    });

    it("should return 200 and short profile if successful when match is false, isliked is false, likedBack is false", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(false);
      const mockedIsLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValue(false);
      const mockedIsLikedBack = vi.spyOn(likeSvc, "isLikedBack").mockResolvedValue(false);
      const mockedGetShortProfileById = vi.spyOn(userSvc, "getShortProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
      } as ProfileShort);
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsLikedBack).toHaveBeenCalledWith("2", "1");
      expect(mockedIsLiked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsMatch).toHaveBeenCalledWith("1", "2");
      expect(mockedGetShortProfileById).toHaveBeenCalledWith("2");
      expect(response.status).toBe(200);
      expect(mockedGetShortProfileById).toHaveBeenCalledWith("2");
      expect(response.body).toEqual({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
        connectionStatus: {
          userid: "2",
          matched: false,
          liked: false,
          likedBack: false
        }
      });
    });

    it("should return 200 and short profile if successful when match is true, isliked is true, likedBack is true", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(true);
      const mockedIsLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValue(true);
      const mockedIsLikedBack = vi.spyOn(likeSvc, "isLikedBack").mockResolvedValue(true);
      const mockedGetShortProfileById = vi.spyOn(userSvc, "getShortProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
      } as ProfileShort);
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsLikedBack).toHaveBeenCalledWith("2", "1");
      expect(mockedIsLiked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsMatch).toHaveBeenCalledWith("1", "2");
      expect(response.status).toBe(200);
      expect(mockedGetShortProfileById).toHaveBeenCalledWith("2");
      expect(response.body).toEqual({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
        connectionStatus: {
          userid: "2",
          matched: true,
          liked: true,
          likedBack: true
        }
      });
    });

    it("should return 200 and short profile if successful when match is true, isliked is false, likedBack is true", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(true);
      const mockedIsLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValue(false);
      const mockedIsLikedBack = vi.spyOn(likeSvc, "isLikedBack").mockResolvedValue(true);
      const mockedGetShortProfileById = vi.spyOn(userSvc, "getShortProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
      } as ProfileShort);
      const response = await request(app)
        .get("/api/profile/short/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsLikedBack).toHaveBeenCalledWith("2", "1");
      expect(mockedIsLiked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsMatch).toHaveBeenCalledWith("1", "2");
      expect(response.status).toBe(200);
      expect(mockedGetShortProfileById).toHaveBeenCalledWith("2");
      expect(response.body).toEqual({
        id: "2",
        username: "testuser",
        fameRating: 100,
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        photo0: "photo0.jpg",
        connectionStatus: {
          userid: "2",
          matched: true,
          liked: false,
          likedBack: true
        }
      });
    });
  });

  describe("GET /api/profile/:userId", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/profile").send();
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if there is no such user id", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const response = await request(app)
        .get("/api/profile/ads")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "ads");
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "User profile not found",
        context: { id: "not_found" },
      });
    });

    it("should return 403 if the user is blocked", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(true);
      const response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(403);
      expect(response.body.errors[0]).toEqual({
        message: "User is blocked or is blocking you",
        context: { userId: "blocked or blocking" },
      });
    });

    it("should return 500 if there is error in isBlocked check", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error checking if user blocked or is blocked",
      });
    });

    it("should return 500 if there is error in getUserProfileById", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error getting user profile",
      });
    });

    it("should return 500 if there is error in getUserLocation", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        email: "email"
      } as any);
      const mockedGetUserLocation = vi.spyOn(locationSvc, "getUserLocation").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("2");
      expect(mockedGetUserLocation).toHaveBeenCalledWith("2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error getting user location",
      });
    });

    it("should return 500 if there is error in isMatch", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        email: "email"
      } as any);
      const mockedGetUserLocation = vi.spyOn(locationSvc, "getUserLocation").mockResolvedValue(null);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("2");
      expect(mockedGetUserLocation).toHaveBeenCalledWith("2");
      expect(mockedIsMatch).toHaveBeenCalledWith("1", "2");
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error checking match status",
      });
    });

    it("should return 500 if there is error in isLiked", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        email: "email"
      } as any);
      const mockedGetUserLocation = vi.spyOn(locationSvc, "getUserLocation").mockResolvedValue(null);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(false);
      const mockedIsLiked = vi.spyOn(likeSvc, "isLiked").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(500);
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("2");
      expect(mockedGetUserLocation).toHaveBeenCalledWith("2");
      expect(mockedIsLiked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsMatch).toHaveBeenCalledWith("1", "2");
      expect(mockedGetUserLocation).toHaveBeenCalled();
      expect(mockedGetUserProfileById).toHaveBeenCalled();
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error checking liked status",
      });
    });

    it("should return 500 if there is error in isLikedBack", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        email: "email"
      } as any);
      const mockedGetUserLocation = vi.spyOn(locationSvc, "getUserLocation").mockResolvedValue(null);
      const mockedIsMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(false);
      const mockedIsLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValue(false);
      const mockedIsLikedBack = vi.spyOn(likeSvc, "isLikedBack").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(500);
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("2");
      expect(mockedGetUserLocation).toHaveBeenCalled();
      expect(mockedIsLikedBack).toHaveBeenCalledWith("2", "1");
      expect(mockedIsLiked).toHaveBeenCalledWith("1", "2");
      expect(mockedIsMatch).toHaveBeenCalledWith("1", "2");
      expect(response.body.errors[0]).toEqual({
        context: {
          error: {},
          errorMsg: "Database error",
          errorStack: expect.any(String),
        },
        message: "Error checking liked back status",
      });
    });

    it("should return 200 and user profile if successful and location is null", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        email: "testuser@example.com",
        firstName: "Test",
        lastName: "User",
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        gender: 0,
        sexualPreference: { low: 1, high: 1 },
        fameRating: 100,
        biography: "This is a test user.",
        photo0: "photo0.jpg",
        photo1: "photo1.jpg",
        photo2: "photo2.jpg",
        photo3: "photo3.jpg",
        photo4: "photo4.jpg",
        lastOnline: Date.now(),
      });
      const mockedisMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(false);
      const mockedisLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValue(true);
      const mockedisLikedBack = vi.spyOn(likeSvc, "isLikedBack").mockResolvedValue(false);
      const response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(200);
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("2");
      expect(mockedisMatch).toHaveBeenCalledWith("1", "2");
      expect(mockedisLiked).toHaveBeenCalledWith("1", "2");
      expect(mockedisLikedBack).toHaveBeenCalledWith("2", "1");
      expect(response.body).toEqual({
        id: "2",
        username: "testuser",
        email: "testuser@example.com",
        firstName: "Test",
        lastName: "User",
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        gender: 0,
        sexualPreference: { low: 1, high: 1 },
        fameRating: 100,
        biography: "This is a test user.",
        photo0: "photo0.jpg",
        photo1: "photo1.jpg",
        photo2: "photo2.jpg",
        photo3: "photo3.jpg",
        photo4: "photo4.jpg",
        lastOnline: expect.any(Number),
        connectionStatus: {
          "liked": true,
          "likedBack": false,
          "matched": false,
          "userid": "2",
        }
      });
    });

    it("should return 200 and user profile if successful and location is not null", async () => {
      const mockedIsBlocked = vi.spyOn(blockSvc, "getBlockedRel").mockResolvedValue(false);
      const mockedGetUserProfileById = vi.spyOn(userSvc, "getUserProfileById").mockResolvedValue({
        id: "2",
        username: "testuser",
        email: "testuser@example.com",
        firstName: "Test",
        lastName: "User",
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        gender: 0,
        sexualPreference: { low: 1, high: 1 },
        fameRating: 100,
        biography: "This is a test user.",
        photo0: "photo0.jpg",
        photo1: "photo1.jpg",
        photo2: "photo2.jpg",
        photo3: "photo3.jpg",
        photo4: "photo4.jpg",
        lastOnline: Date.now(),
      });
      const mockedGetUserLocation = vi.spyOn(locationSvc, "getUserLocation").mockResolvedValue({
        latitude: 40.7128,
        longitude: -74.0060,
      });
      const mockedisMatch = vi.spyOn(likeSvc, "isMatch").mockResolvedValue(false);
      const mockedisLiked = vi.spyOn(likeSvc, "isLiked").mockResolvedValue(true);
      const mockedisLikedBack = vi.spyOn(likeSvc, "isLikedBack").mockResolvedValue(false);
      const Response = await request(app)
        .get("/api/profile/2")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(Response.status).toBe(200);
      expect(mockedIsBlocked).toHaveBeenCalledWith("1", "2");
      expect(mockedGetUserProfileById).toHaveBeenCalledWith("2");
      expect(mockedGetUserLocation).toHaveBeenCalled();
      expect(mockedisMatch).toHaveBeenCalledWith("1", "2");
      expect(mockedisLiked).toHaveBeenCalledWith("1", "2");
      expect(mockedisLikedBack).toHaveBeenCalledWith("2", "1");
      expect(Response.body).toEqual({
        id: "2",
        username: "testuser",
        email: "testuser@example.com",
        firstName: "Test",
        lastName: "User",
        birthDate: { year: { low: 1990, high: 1990 }, month: { low: 1, high: 1 }, day: { low: 1, high: 1 } },
        gender: 0,
        sexualPreference: { low: 1, high: 1 },
        fameRating: 100,
        biography: "This is a test user.",
        photo0: "photo0.jpg",
        photo1: "photo1.jpg",
        photo2: "photo2.jpg",
        photo3: "photo3.jpg",
        photo4: "photo4.jpg",
        lastOnline: expect.any(Number),
        latitude: 40.7128,
        longitude: -74.0060,
        connectionStatus: {
          "liked": true,
          "likedBack": false,
          "matched": false,
          "userid": "2",
        }

      });
    });

  });
});