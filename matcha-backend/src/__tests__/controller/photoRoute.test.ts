import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as photoSvc from "../../service/photoSvc.js";

let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/photo", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/photo", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/photo").send({});
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 404 if photo not found", async () => {
      const response = await request(app)
        .get("/api/photo/nonexistentphoto.jpg")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(404);
      expect(response.body.errors[0]).toEqual({
        context : { msg : "The requested file does not exist." },
        message: "file not found",
      });
    });

    it("should return 404 if there is no path parameter", async () => {
      const response = await request(app)
        .get("/api/photo/")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(404);
      expect(response.body.errors[0]).toEqual({
        context : { msg : "The requested endpoint does not exist." },
        message: "invalid endpoint",
      });
    });
  });
});