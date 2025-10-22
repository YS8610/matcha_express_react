import { vi, describe, it, expect, beforeAll, afterEach, type Mock } from "vitest";
// vi.mock("jsonwebtoken", async (importOriginal) => {
//   const actual = await importOriginal() as any;
//   return {
//     ...actual,
//     sign: vi.fn(),
//     verify: vi.fn(),
//   };
// });
import * as pkg from "jsonwebtoken";
import appfunc from "../../app.js";
import { type Express } from "express-serve-static-core";
import * as jwtSvc from "../../service/jwtSvc.js";
import ConstaMatcha from "../../ConstMatcha.js";
import BadRequestError from "../../errors/BadRequestError.js";

let app: Express;

describe("testing functions in jwtSvc", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("createToken: should create a token for valid user", async () => {
    const token = await jwtSvc.createToken("1", "email", "username", true);
    const decoded = pkg.verify(token, ConstaMatcha.JWT_SECRET) as pkg.JwtPayload;
    expect(decoded).toHaveProperty("id", "1");
    expect(decoded).toHaveProperty("email", "email");
    expect(decoded).toHaveProperty("username", "username");
    expect(decoded).toHaveProperty("activated", true);
  });

  it("createToken: should create a token with activated false by default", async () => {
    const token = await jwtSvc.createToken("2", "email2", "username2");
    const decoded = pkg.verify(token, ConstaMatcha.JWT_SECRET) as pkg.JwtPayload;
    expect(decoded).toHaveProperty("id", "2");
    expect(decoded).toHaveProperty("email", "email2");
    expect(decoded).toHaveProperty("username", "username2");
    expect(decoded).toHaveProperty("activated", false);
  });

  it("verifyToken: should verify a valid token", async () => {
    const token = await jwtSvc.createToken("1", "email", "username", true);
    const decoded = await jwtSvc.verifyToken(token) as pkg.JwtPayload;
    expect(decoded).toHaveProperty("id", "1");
    expect(decoded).toHaveProperty("email", "email");
    expect(decoded).toHaveProperty("username", "username");
    expect(decoded).toHaveProperty("activated", true);
  });

  it("verifyToken: should throw error for invalid token", async () => {
    const invalidToken = "invalid.token.here";
    await expect(jwtSvc.verifyToken(invalidToken)).rejects.toThrow("invalid token");
    await expect(jwtSvc.verifyToken(invalidToken)).rejects.toBeInstanceOf(BadRequestError);});

  it("createPWResetToken: should create a password reset token", async () => {
    const hashedpw = "$argon2id$v=19$m=65536,t=3,p=4$someSalt$someHash";
    const token = await jwtSvc.createPWResetToken("1", "email", "username", hashedpw);
    const decoded = pkg.verify(token, hashedpw) as pkg.JwtPayload;
    expect(decoded).toHaveProperty("id", "1");
    expect(decoded).toHaveProperty("email", "email");
    expect(decoded).toHaveProperty("username", "username");
  });

  it("verifyPWResetToken: should verify a valid password reset token", async () => {
    const hashedpw = "$argon2id$v=19$m=65536,t=3,p=4$someSalt$someHash";
    const token = await jwtSvc.createPWResetToken("1", "email", "username", hashedpw);
    const decoded = await jwtSvc.verifyPWResetToken(token, hashedpw) as pkg.JwtPayload;
    expect(decoded).toHaveProperty("id", "1");
    expect(decoded).toHaveProperty("email", "email");
    expect(decoded).toHaveProperty("username", "username");
  });

  it("verifyPWResetToken: should throw error for invalid password reset token", async () => {
    const hashedpw = "$argon2id$v=19$m=65536,t=3,p=4$someSalt$someHash";
    const invalidToken = "invalid.token.here";
    // do NOT await the call — assert the Promise rejects
    await expect(jwtSvc.verifyPWResetToken(invalidToken, hashedpw))
      .rejects.toThrow("invalid password reset token");
    // or assert specific error type
    await expect(jwtSvc.verifyPWResetToken(invalidToken, hashedpw))
      .rejects.toBeInstanceOf(BadRequestError);
  });


});