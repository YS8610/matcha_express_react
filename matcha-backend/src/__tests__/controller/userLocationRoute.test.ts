import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as locationSvc from "../../service/locationSvc.js";

let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/location", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("PUT /api/user/location", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).put("/api/user/location").send({});
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if body is missing", async () => {
      const response = await request(app)
        .put("/api/user/location")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context : {body : 'missing'},
        message: "Request body is required",
      });
    });

    it("should return 400 if latitude or longitude is missing", async () => {
      const response = await request(app)
        .put("/api/user/location")
        .set("Authorization", `Bearer ${token}`)
        .send({ latitude: 40.7128 });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { latitude: 'provided', longitude: 'missing' },
        message: "latitude and longitude are required",
      });
    });

    it("should return 200 if location is updated successfully", async () => {
      const updateUserLocationSpy = vi.spyOn(locationSvc, "updateUserLocation").mockResolvedValue();
      const response = await request(app)
        .put("/api/user/location")
        .set("Authorization", `Bearer ${token}`)
        .send({ latitude: 40.7128, longitude: -74.0060 });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ msg: "User location updated successfully" });
      expect(updateUserLocationSpy).toHaveBeenCalledOnce();
      expect(updateUserLocationSpy).toHaveBeenCalledWith("1", "testuser", 40.7128, -74.0060);
    });

    it("should return 500 if there is an internal server error", async () => {
      const updateUserLocationSpy = vi.spyOn(locationSvc, "updateUserLocation").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .put("/api/user/location")
        .set("Authorization", `Bearer ${token}`)
        .send({ latitude: 40.7128, longitude: -74.0060 });
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toStrictEqual({
        message: "error updating user location",
        context: { error: { }, errorMsg: "Database error", errorStack: expect.any(String) }
      });
      expect(updateUserLocationSpy).toHaveBeenCalledOnce();
      expect(updateUserLocationSpy).toHaveBeenCalledWith("1", "testuser", 40.7128, -74.0060);
    });
  });
});