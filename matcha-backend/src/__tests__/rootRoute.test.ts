import appfunc from "../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { describe, expect, it, beforeAll } from "vitest";

describe("testing RootRoute file", () => {
  let app: Express;

  beforeAll(() => {
    app = appfunc();
  });

  describe("GET /pubapi/ping", () => {
    it("should return a 200 status code and a JSON response", async () => {
      const response = await request(app).get("/pubapi/ping");
      expect(response.status).toBe(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toEqual({ msg: "pong" });
    });
  });

  // describe("")
});





