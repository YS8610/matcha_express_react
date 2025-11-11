import { describe, expect, it, beforeAll, vi, afterEach, beforeEach } from "vitest";
// Place this mock BEFORE you import your app so the route middleware uses the mocked multer.

let __simulateMissingFile = false;

vi.mock("multer", () => {
  // default export is a factory function
  const multer = () => ({
    single: (_fieldName: string) => {
      // return a middleware compatible function
      return (req: any, _res: any, next: any) => {
        if (__simulateMissingFile) {
          // simulate no file uploaded
          return next();
        }
        // simulate a file parsed by multer
        req.file = {
          fieldname: "photo",
          originalname: "test.jpg",
          buffer: Buffer.from("test"),
          mimetype: "image/jpeg",
          size: 4,
        };
        next();
      };
    },
  });
  // optional helpers some apps call
  multer.memoryStorage = () => ({});
  // provide a diskStorage shim used by some code paths
  multer.diskStorage = () => ({
    _handleFile: (_req: any, _file: any, cb: any) => cb(null, undefined),
    _removeFile: (_req: any, _file: any, cb: any) => cb(null),
  });
  // return an object with a default key to mimic ESM default export and expose helpers
  return {
    default: multer,
    memoryStorage: multer.memoryStorage,
    diskStorage: multer.diskStorage,
  };
});

// then import the rest of your test dependencies
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as photoSvc from "../../service/photoSvc.js";
import fs from "fs/promises";



let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/photo", () => {
  beforeAll(() => {
    app = appfunc();
  });

  // example usage in tests:
  beforeEach(() => {
    __simulateMissingFile = false; // default: file present
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/user/photo/", () => {
    it("should return 401 if no token provided", async () => {
      const response = await request(app)
        .get("/api/user/photo/");
      expect(response.status).toBe(401);
    });

    it("should return 401 if invalid token provided", async () => {
      const response = await request(app)
        .get("/api/user/photo/")
        .set("Authorization", `Bearer invalidtoken`);
      expect(response.status).toBe(401);
    });

    it("should return 500 if service throws error", async () => {
      const getAllPhotoNameByUserIdMock = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/user/photo/")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(getAllPhotoNameByUserIdMock).toHaveBeenCalledTimes(1);
      expect(getAllPhotoNameByUserIdMock).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to get photo names",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 200 with photo names", async () => {
      const getAllPhotoNameByUserIdMock = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockResolvedValue(["photo1.jpg", "photo2.jpg"]);
      const response = await request(app)
        .get("/api/user/photo/")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ photoNames: ["photo1.jpg", "photo2.jpg"] });
      expect(getAllPhotoNameByUserIdMock).toHaveBeenCalledTimes(1);
      expect(getAllPhotoNameByUserIdMock).toHaveBeenCalledWith("1");
    });
  });

  describe("PUT /api/user/photo/order", () => {
    it("should return 401 if no token provided", async () => {
      const response = await request(app)
        .put("/api/user/photo/order");
      expect(response.status).toBe(401);
    });

    it("should return 400 if no body provided", async () => {
      const response = await request(app)
        .put("/api/user/photo/order")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "No body provided",
        context: { err: "pls provide a valid photo order" }
      });
    });

    it("should return 400 if newOrder is missing", async () => {
      const response = await request(app)
        .put("/api/user/photo/order")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "No new order provided",
        context: { err: "pls provide a valid photo order" }
      });
    });

    it("should return 400 if newOrder is not an array", async () => {
      const response = await request(app)
        .put("/api/user/photo/order")
        .set("Authorization", `Bearer ${token}`)
        .send({ newOrder: "invalid" });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "Invalid photo order",
        context: { err: "pls provide a valid photo order" }
      });
    });

    it("should return 400 if newOrder is invalid", async () => {
      const response = await request(app)
        .put("/api/user/photo/order")
        .set("Authorization", `Bearer ${token}`)
        .send({ newOrder: [0, 1, 1, 3, 4] }); // duplicate 1
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "Invalid photo order",
        context: { err: "pls provide a valid photo order" }
      });
    });

    it("should return 500 if getAllPhotoNameByUserId service throws error", async () => {
      const mockedgetAllPhotoNameByUserId = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .put("/api/user/photo/order")
        .set("Authorization", `Bearer ${token}`)
        .send({ newOrder: [0, 1, 2, 3, 4] });
      expect(response.status).toBe(500);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledTimes(1);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to get photo names",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 500 if reorderPhotosByID service throws error", async () => {
      const mockedgetAllPhotoNameByUserId = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockResolvedValue(["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"]);
      const mockedreorderPhotosByID = vi.spyOn(photoSvc, "reorderPhotosByID").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .put("/api/user/photo/order")
        .set("Authorization", `Bearer ${token}`)
        .send({ newOrder: [0, 1, 2, 3, 4] });
      expect(response.status).toBe(500);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledTimes(1);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledWith("1");
      expect(mockedreorderPhotosByID).toHaveBeenCalledTimes(1);
      expect(mockedreorderPhotosByID).toHaveBeenCalledWith("1", [0, 1, 2, 3, 4], ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"]);
      expect(response.body.errors[0]).toEqual({
        message: "Failed to reorder photos",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 200 on successful reorder", async () => {
      const mockedgetAllPhotoNameByUserId = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockResolvedValue(["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"]);
      const mockedreorderPhotosByID = vi.spyOn(photoSvc, "reorderPhotosByID").mockResolvedValue();
      const response = await request(app)
        .put("/api/user/photo/order")
        .set("Authorization", `Bearer ${token}`)
        .send({ newOrder: [4, 3, 2, 1, 0] });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ msg: "Photo order updated successfully" });
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledTimes(1);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledWith("1");
      expect(mockedreorderPhotosByID).toHaveBeenCalledTimes(1);
      expect(mockedreorderPhotosByID).toHaveBeenCalledWith("1", [4, 3, 2, 1, 0], ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"]);
    });
  });

  // todo: mock multer to simulate file upload scenarios
  describe("PUT /api/user/photo/:no", () => {
    it("should return 401 if no token provided", async () => {
      const response = await request(app)
        .put("/api/user/photo/0");
      expect(response.status).toBe(401);
    });

    it("should return 400 if no photo is uploaded", async () => {
      const response = await request(app)
        .put("/api/user/photo/5")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "No photo uploaded",
        context: { err: "No photo uploaded" }
      });
    });

  });

  describe("DELETE /api/user/photo/:no", () => {
    it("should return 401 if no token provided", async () => {
      const response = await request(app)
        .delete("/api/user/photo/0");
      expect(response.status).toBe(401);
    });

    it("should return 400 if photo number is invalid", async () => {
      const response = await request(app)
        .delete("/api/user/photo/invalid")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "Photo number is not a number",
        context: { err: "pls provide a number from 0 to 4" }
      });
    });

    it("should return 400 if photo number is out of range", async () => {
      const response = await request(app)
        .delete("/api/user/photo/5")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        message: "Invalid photo number",
        context: { err: "pls provide a number from 0 to 4" }
      });
    });

    it("should return 500 if getAllPhotoNameByUserId service throws error", async () => {
      const mockedgetAllPhotoNameByUserId = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .delete("/api/user/photo/0")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledTimes(1);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to get photo names",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 500 if deletePhotoByName service throws error", async () => {
      const mockedgetAllPhotoNameByUserId = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockResolvedValue(["photo1.jpg"]);
      const mockeddeletePhotoByName = vi.spyOn(photoSvc, "deletePhotoByName").mockRejectedValue(new Error("File system error"));
      const response = await request(app)
        .delete("/api/user/photo/0")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledTimes(1);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledWith("1");
      expect(mockeddeletePhotoByName).toHaveBeenCalledTimes(1);
      expect(mockeddeletePhotoByName).toHaveBeenCalledWith(expect.any(Function), "photo1.jpg");
      expect(response.body.errors[0]).toEqual({
        message: "Failed to delete photo",
        context: { error: {}, errorMsg: "File system error", errorStack: expect.any(String) }
      });
    });

    it("should return 500 if setPhotobyUserId service throws error", async () => {
      const mockedgetAllPhotoNameByUserId = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockResolvedValue(["photo1.jpg"]);
      const mockedsetPhotobyUserId = vi.spyOn(photoSvc, "setPhotobyUserId").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .delete("/api/user/photo/0")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledTimes(1);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledWith("1");
      expect(mockedsetPhotobyUserId).toHaveBeenCalledTimes(1);
      expect(mockedsetPhotobyUserId).toHaveBeenCalledWith("1", "", 0);
      expect(response.body.errors[0]).toEqual({
        message: "Failed to set photo",
        context: { error: {}, errorMsg: "Database error", errorStack: expect.any(String) }
      });
    });

    it("should return 400 if there is no photo to delete", async () => {
      const mockedgetAllPhotoNameByUserId = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockResolvedValue([""]);
      const response = await request(app)
        .delete("/api/user/photo/0")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledTimes(1);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "No photo to delete",
        context: { err: "No photo to delete" }
      });
    });

    it("should return 200 on successful deletion", async () => {
      const mockedgetAllPhotoNameByUserId = vi.spyOn(photoSvc, "getAllPhotoNameByUserId").mockResolvedValue(["photo1.jpg"]);
      const mockeddeletePhotoByName = vi.spyOn(photoSvc, "deletePhotoByName").mockResolvedValue(true);
      const mockedsetPhotobyUserId = vi.spyOn(photoSvc, "setPhotobyUserId").mockResolvedValue();
      const response = await request(app)
        .delete("/api/user/photo/0")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ msg: "Photo deleted successfully" });
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledTimes(1);
      expect(mockedgetAllPhotoNameByUserId).toHaveBeenCalledWith("1");
      expect(mockeddeletePhotoByName).toHaveBeenCalledTimes(1);
      expect(mockeddeletePhotoByName).toHaveBeenCalledWith(fs.unlink, "photo1.jpg");
      expect(mockedsetPhotobyUserId).toHaveBeenCalledTimes(1);
      expect(mockedsetPhotobyUserId).toHaveBeenCalledWith("1", "", 0);
    });
  });
});
