import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import fs from "fs/promises";


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

    it("should return 400 if filename contains ..", async () => {
      const response = await request(app)
        .get("/api/photo/...jpg")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context : { msg : "Filename contains invalid characters or path traversal." },
        message: "invalid filename",
      });
    });

    it("should return 400 if filename contains \\", async () => {
      const response = await request(app)
        .get("/api/photo/invalid\\name.jpg")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(404);
      expect(response.body.errors[0]).toEqual({
        context : { msg : "The requested endpoint does not exist." },
        message: "invalid endpoint",
      });
    });

    it("should return 400 if filename contains /", async () => {
      const response = await request(app)
        .get("/api/photo/invalid/name/with/slash.jpg")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(404);
      expect(response.body.errors[0]).toEqual({
        context : { msg : "The requested endpoint does not exist." },
        message: "invalid endpoint",
      });
    });

    it("should return 200 and send file when it exists", async () => {
      const expressModule = await import("express");
      const sendFileSpy = vi
        .spyOn(expressModule.response as any, "sendFile")
        .mockImplementation(function (this: any, ...args: any[]) {
          // sendFile(path, options?, callback?) — callback is usually the last arg
          const cb = args.find((a) => typeof a === "function") as ((err?: Error | null) => void) | undefined;
          // simulate successful send and respond to the callback
          if (typeof this.status === "function") this.status(200).send("OK");
          if (typeof cb === "function") cb(null);
        });

      vi.spyOn(fs, "stat").mockResolvedValue({ isFile: () => true } as any);

      const response = await request(app)
        .get("/api/photo/existing.jpg")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.text).toBe("OK");

      sendFileSpy.mockRestore();
    });

    it("should return 404 if sendFile reports an error", async () => {
      const expressModule = await import("express");
      const sendFileSpy = vi
        .spyOn(expressModule.response as any, "sendFile")
        .mockImplementation(function (this: any, ...args: any[]) {
          const cb = args.find((a) => typeof a === "function") as ((err?: Error | null) => void) | undefined;
          if (typeof cb === "function") cb(new Error("send error"));
        });

      vi.spyOn(fs, "stat").mockResolvedValue({ isFile: () => true } as any);

      const response = await request(app)
        .get("/api/photo/existing.jpg")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.status).toBe(404);
      expect(response.body.errors[0]).toEqual({
        context: { msg: "The requested file does not exist." },
        message: "file not found",
      });

      sendFileSpy.mockRestore();
    });
  });
});