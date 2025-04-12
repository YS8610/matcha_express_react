import appfunc from "../app";
import request from "supertest";
import { type Express } from "express-serve-static-core";

describe("GET /api/ping", () => {
  let app: Express;

  beforeAll(() => {
    app = appfunc();
  });

  it("should return a 200 status code and a JSON response", async () => {
    const response = await request(app).get("/api/ping");
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "pong" });
  });
});





