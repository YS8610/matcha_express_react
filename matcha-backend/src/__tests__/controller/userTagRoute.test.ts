import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import { createToken } from "../../service/jwtSvc.js";
import * as tagSvc from "../../service/tagSvc.js";

let app: Express;

const token = await createToken("1", "testuser@email.com", "testuser", true);

describe("Route /api/user/tag", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });


  describe("GET /api/user/tag", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).get("/api/user/tag");
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 200 and tags if authenticated", async () => {
      // Mock authentication and tag retrieval
      const mockTags = ["tag1", "tag2", "tag3"];
      vi.spyOn(await import("../../service/tagSvc.js"), "getTagsById").mockResolvedValue(mockTags);
      const response = await request(app)
        .get("/api/user/tag")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ tags: mockTags });
    });

    it("should return 500 if there is a server error", async () => {
      vi.spyOn(await import("../../service/tagSvc.js"), "getTagsById").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .get("/api/user/tag")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        message: "Error getting tags for user",
        context: { error: {} }
      });
    });
  });

  describe("POST /api/user/tag", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).post("/api/user/tag").send({ tagName: "newtag" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if empty body", async () => {
      const response = await request(app)
        .post("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { tagName: "empty" },
        message: "Tag name cannot be empty"
      });
    });

    it("should return 400 if tagName is empty space", async () => {
      const response = await request(app)
        .post("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagName: "   " });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { tagName: "empty" },
        message: "Tag name cannot be empty"
      });
    });

    it("should return 400 if request body is missing", async () => {
      const response = await request(app)
        .post("/api/user/tag")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { body: "missing" },
        message: "Request body is missing"
      });
    });

    it("should return 400 if user has exceeded max tags", async () => {
      const mockGetTagCountById = vi.spyOn(tagSvc, "getTagCountById").mockResolvedValue(10);
      const response = await request(app)
        .post("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagName: "newtag" });
      expect(response.status).toBe(400);
      expect(mockGetTagCountById).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        context: { tagCount: "exceeded" },
        message: "User has reached the maximum number of tags"
      });
    });

    it("should return 201 if tag is created successfully", async () => {
      const mockGetTagCountById = vi.spyOn(tagSvc, "getTagCountById").mockResolvedValue(5);
      const mockSetTagbyUserId = vi.spyOn(tagSvc, "setTagbyUserId").mockResolvedValue();
      const response = await request(app)
        .post("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagName: "newtag" });
      expect(response.status).toBe(201);
      expect(mockGetTagCountById).toHaveBeenCalledWith("1");
      expect(mockSetTagbyUserId).toHaveBeenCalledWith("1", "newtag");
      expect(response.body).toEqual({ msg: "Tag linked successfully" });
    });

    it("should return 500 if getTagCountById fails", async () => {
      vi.spyOn(tagSvc, "getTagCountById").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .post("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagName: "newtag" });
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        message: "Error getting tag count for user",
        context: { error: {} }
      });
    });

    it("should return 500 if setTagbyUserId fails", async () => {
      const mockGetTagCountById = vi.spyOn(tagSvc, "getTagCountById").mockResolvedValue(5);
      vi.spyOn(tagSvc, "setTagbyUserId").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .post("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagName: "newtag" });
      expect(response.status).toBe(500);
      expect(mockGetTagCountById).toHaveBeenCalledWith("1");
      expect(response.body.errors[0]).toEqual({
        message: "Error creating tag for user",
        context: { error: {} }
      });
    });
  });

  describe("DELETE /api/user/tag", () => {
    it("should return 401 if not authenticated", async () => {
      const response = await request(app).delete("/api/user/tag").send({ tagName: "tagToDelete" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ msg: "unauthorised. You need to be authenticated to access this resource" });
    });

    it("should return 400 if empty body", async () => {
      const response = await request(app)
        .delete("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { tagName: "empty" },
        message: "Tag name cannot be empty"
      });
    });

    it("should return 400 if request body is missing", async () => {
      const response = await request(app)
        .delete("/api/user/tag")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { body: "missing" },
        message: "Request body is missing"
      });
    });

    it("should return 400 if tagName is empty space", async () => {
      const response = await request(app)
        .delete("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagName: "   " });
      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toEqual({
        context: { tagName: "empty" },
        message: "Tag name cannot be empty"
      });
    });

    it("should return 200 if tag is deleted successfully", async () => {
      const mockDeleteTagbyUserId = vi.spyOn(tagSvc, "deleteTagbyUserId").mockResolvedValue();
      const response = await request(app)
        .delete("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagName: "tagToDelete" });
      expect(response.status).toBe(200);
      expect(mockDeleteTagbyUserId).toHaveBeenCalledWith("1", "tagToDelete");
      expect(response.body).toEqual({ msg: "Tag unlinked successfully" });
    });

    it("should return 500 if deleteTagbyUserId fails", async () => {
      vi.spyOn(tagSvc, "deleteTagbyUserId").mockRejectedValue(new Error("Database error"));
      const response = await request(app)
        .delete("/api/user/tag")
        .set("Authorization", `Bearer ${token}`)
        .send({ tagName: "tagToDelete" });
      expect(response.status).toBe(500);
      expect(response.body.errors[0]).toEqual({
        message: "Error deleting tag for user",
        context: { error: {} }
      });
    });
  });
});
