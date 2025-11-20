import { describe, expect, it, beforeAll, vi, afterEach, beforeEach } from "vitest";
import { NextFunction, Request, Response } from "express";
import { authMiddleware, authWSmiddleware } from "../../middleware/auth.js";
import * as jwtSvc from "../../service/jwtSvc.js";
import { AuthToken } from "../../model/token.js";
import { ResMsg } from "../../model/Response.js";
import BadRequestError from "../../errors/BadRequestError.js";
import pkg from "jsonwebtoken";
import ConstMatcha from "../../ConstMatcha.js";


describe("authMiddleware", () => {
  let mockedreq: Partial<Request>;
  let mockedres: Partial<Response<ResMsg>>;
  let mockednext: NextFunction = vi.fn();

  beforeEach(() => {
    mockedreq = {};
    mockedres = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      locals: {} as any,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Testing authMiddleware", () => {
    it("should return 401 if no authorization header", async () => {
      mockedreq.headers = {};
      await authMiddleware(mockedreq as Request, mockedres as Response, mockednext);
      expect(mockedres.status).toHaveBeenCalledWith(401);
      expect(mockedres.json).toHaveBeenCalledWith({
        msg: "unauthorised. You need to be authenticated to access this resource",
      });
    });

    it("should return 401 if authorization header is malformed", async () => {
      mockedreq.headers = { authorization: "InvalidToken" };
      await authMiddleware(mockedreq as Request, mockedres as Response, mockednext);
      expect(mockedres.status).toHaveBeenCalledWith(401);
      expect(mockedres.json).toHaveBeenCalledWith({
        msg: "unauthorised. You need to be authenticated to access this resource",
      });
    });

    it("should return 401 if token is invalid", async () => {
      mockedreq.headers = { authorization: "Bearer invalidtoken" };
      await expect(authMiddleware(mockedreq as Request, mockedres as Response, mockednext)).rejects.toThrow(
        new BadRequestError({
          message: "invalid token",
          logging: false,
          code: 401,
          context: { token: "Invalid token. Please log in again." },
        })
      );
    });

    it("should return 403 if account is not activated", async () => {
      mockedreq.headers = { authorization: "Bearer validtoken" };
      const decodedToken: AuthToken = {
        id: "123",
        email: "user@example.com",
        username: "testuser",
        activated: false,
      };
      vi.spyOn(jwtSvc, "verifyToken").mockResolvedValue(decodedToken);
      await authMiddleware(mockedreq as Request, mockedres as Response, mockednext);
      expect(mockedres.status).toHaveBeenCalledWith(403);
      expect(mockedres.json).toHaveBeenCalledWith({
        msg: "forbidden. You need to activate your account to access this resource",
      });
    });

    it("should call next with error if email or username is missing in token", async () => {
      const faketoken = pkg.sign({ id: "1", activated: true }, ConstMatcha.JWT_SECRET, { algorithm: "HS512", expiresIn: ConstMatcha.JWT_EXPIRY });
      mockedreq.headers = { authorization: `Bearer ${faketoken}` };
      const mockedNext: any = vi.fn();
      await authMiddleware(mockedreq as Request, mockedres as Response, mockednext);
      expect(mockedres.status).toHaveBeenCalledWith(401);
      expect(mockedres.json).toHaveBeenCalledWith({
        msg: "unauthorised. You need to be authenticated to access this resource",
      });
    });

    it("should call next if token is valid and account is activated", async () => {
      const decodedToken: AuthToken = {
        id: "123",
        email: "user@example.com",
        username: "testuser",
        activated: true,
      };
      const faketoken = jwtSvc.createToken(decodedToken.id, decodedToken.email, decodedToken.username, decodedToken.activated);
      mockedreq.headers = { authorization: `Bearer ${faketoken}` };
      vi.spyOn(jwtSvc, "verifyToken").mockResolvedValue(decodedToken);
      await authMiddleware(mockedreq as Request, mockedres as Response, mockednext);
      expect(mockednext).toHaveBeenCalled();
      expect(mockedres.locals).toEqual({
        activated: true,
        authenticated: true,
        id: "123",
        username: "testuser",
      });
    });
  });

  describe("Testing authWSmiddleware", () => {
    it("should call next with error if no token provided", () => {
      const mockedSocket: any = {
        handshake: {
          auth: {},
          query: {},
        },
      };
      const mockedNext: any = vi.fn();
      authWSmiddleware(mockedSocket, mockedNext);
      expect(mockedNext).toHaveBeenCalledWith(new Error("Authentication error"));
    });

    it("should call next with error if token is invalid", async () => {
      const mockedSocket: any = {
        handshake: {
          auth: { token: "invalidtoken" },
          query: {},
        },
      };
      const mockedNext: any = vi.fn();
      vi.spyOn(jwtSvc, "verifyToken").mockRejectedValue(new Error("invalid token"));
      authWSmiddleware(mockedSocket, mockedNext);
      await new Promise((r) => process.nextTick(r));
      expect(mockedNext).toHaveBeenCalledWith(new Error("Authentication failed"));
    });

    it("should call next and attach user if token is valid", async () => {
      const decodedToken: AuthToken = {
        id: "123",
        email: "user@example.com",
        username: "testuser",
        activated: true,
      };
      const faketoken = jwtSvc.createToken(decodedToken.id, decodedToken.email, decodedToken.username, decodedToken.activated);
      const mockedSocket: any = {
        handshake: {
          auth: { token: faketoken },
          query: {},
        },
      };
      const mockedNext: any = vi.fn();
      vi.spyOn(jwtSvc, "verifyToken").mockResolvedValue(decodedToken);
      authWSmiddleware(mockedSocket, mockedNext);
      await new Promise((r) => process.nextTick(r));
      expect(mockedNext).toHaveBeenCalled();
      expect(mockedSocket.user).toEqual(decodedToken);
    });
  });

});
