import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import appfunc from "../../app.js";
import request from "supertest";
import { type Express } from "express-serve-static-core";
import * as authSvc from "../../service/authSvc.js";
import * as userSvc from "../../service/userSvc.js";
import * as jwtSvc from "../../service/jwtSvc.js";
import ServerRequestError from "../../errors/ServerRequestError.js";
import { createToken, verifyToken } from "../../service/jwtSvc.js";
import { sign } from "jsonwebtoken";
import ConstMatcha from "../../ConstMatcha.js";
import { AuthToken } from "../../model/token.js";

let app: Express;

// route tests for /pubapi/ping
describe("Route /pubapi/ping", () => {
  beforeAll(() => {
    app = appfunc();
  });

  it("get should return a 200 status code and a JSON response", async () => {
    const response = await request(app).get("/pubapi/ping");
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "pong" });
  });

  it("post should return a 404 status code for an invalid route", async () => {
    const response = await request(app).post("/pubapi/ping");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("put should return a 404 status code for an invalid route", async () => {
    const response = await request(app).put("/pubapi/ping");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("delete should return a 404 status code for an invalid route", async () => {
    const response = await request(app).delete("/pubapi/ping");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });
});

// route tests for /pubapi/login
describe("Route /pubapi/login", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it("get should return a 404 status code for an invalid route", async () => {
    const response = await request(app).get("/pubapi/login");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("put should return a 404 status code for an invalid route", async () => {
    const response = await request(app).put("/pubapi/login");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("delete should return a 404 status code for an invalid route", async () => {
    const response = await request(app).delete("/pubapi/login");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("post without body should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/login");
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        body: "missing"
      },
      message: "Request body is required"
    });
  });

  it("post with empty body should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/login").send({});
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        username: "missing",
        password: "missing"
      },
      message: "username and/or password are required"
    });
  });

  it("post with only username should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/login")
      .send({ username: "testuser" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        username: "present",
        password: "missing"
      },
      message: "username and/or password are required"
    });
  });

  it("post with only password should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/login")
      .send({ password: "testpassword" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        username: "missing",
        password: "present"
      },
      message: "username and/or password are required"
    });
  });

  it("post with wrong field names should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/login")
      .send({ user: "testuser", pass: "testpassword" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        username: "missing",
        password: "missing"
      },
      message: "username and/or password are required"
    });
  });

  it("post with wrong username and password should return a 401 status code", async () => {
    const response = await request(app)
      .post("/pubapi/login")
      .send({ username: "testuser", password: "testpassword" });
    expect(response.status).toBe(401);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        username: "invalid", password: "invalid"
      },
      message: "Invalid username and/or password"
    });
  });

  it("post with correct username and password should return a 200 status code and a JWT token", async () => {
    vi.spyOn(authSvc, "loginSvc").mockResolvedValue("mocked-jwt-token");
    const response = await request(app)
      .post("/pubapi/login")
      .send({ username: "admin", password: "admin" });
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "mocked-jwt-token" });
  });

  it("post with correct username and password but loginSvc throws error should return a 500 status code", async () => {
    vi.spyOn(authSvc, "loginSvc").mockRejectedValue(new ServerRequestError({
      message: "Failed to get user by username",
      code: 500,
      logging: true,
      context: { error: {} }
    }));
    const response = await request(app)
      .post("/pubapi/login")
      .send({ username: "admin", password: "admin" });
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        error: {}
      },
      message: "Failed to get user by username"
    });
  });
});

// todo: route tests for /pubapi/register
describe("Route /pubapi/register", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it("get should return a 404 status code for an invalid route", async () => {
    const response = await request(app).get("/pubapi/register");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("put should return a 404 status code for an invalid route", async () => {
    const response = await request(app).put("/pubapi/register");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("delete should return a 404 status code for an invalid route", async () => {
    const response = await request(app).delete("/pubapi/register");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("post without body should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register");
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        body: "missing"
      },
      message: "Request body is required"
    });
  });

  it("post with empty body should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({});
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "missing",
        pw: "missing",
        pw2: "missing",
        firstName: "missing",
        lastName: "missing",
        birthDate: "missing",
        username: "missing"
      },
      message: "Email, passwords, first name, last name, birthDate, and/or username are required"
    });
  });

  it("post with email missing should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      username: "johndoe",
      pw: "password",
      pw2: "password",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "missing",
        pw: "present",
        pw2: "present",
        firstName: "present",
        lastName: "present",
        birthDate: "present",
        username: "present"
      },
      message: "Email, passwords, first name, last name, birthDate, and/or username are required"
    });
  });

  it("post with username missing should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      pw: "password",
      pw2: "password",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "present",
        pw: "present",
        pw2: "present",
        firstName: "present",
        lastName: "present",
        birthDate: "present",
        username: "missing"
      },
      message: "Email, passwords, first name, last name, birthDate, and/or username are required"
    });
  });

  it("post with pw missing should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw2: "password",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "present",
        pw: "missing",
        pw2: "present",
        firstName: "present",
        lastName: "present",
        birthDate: "present",
        username: "present"
      },
      message: "Email, passwords, first name, last name, birthDate, and/or username are required"
    });
  });

  it("post with pw2 missing should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "password",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "present",
        pw: "present",
        pw2: "missing",
        firstName: "present",
        lastName: "present",
        birthDate: "present",
        username: "present"
      },
      message: "Email, passwords, first name, last name, birthDate, and/or username are required"
    });
  });

  it("post with firstName missing should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "password",
      pw2: "password",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "present",
        pw: "present",
        pw2: "present",
        firstName: "missing",
        lastName: "present",
        birthDate: "present",
        username: "present"
      },
      message: "Email, passwords, first name, last name, birthDate, and/or username are required"
    });
  });

  it("post with lastName missing should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "password",
      pw2: "password",
      firstName: "John",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "present",
        pw: "present",
        pw2: "present",
        firstName: "present",
        lastName: "missing",
        birthDate: "present",
        username: "present"
      },
      message: "Email, passwords, first name, last name, birthDate, and/or username are required"
    });
  });

  it("post with birthDate missing should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "password",
      pw2: "password",
      firstName: "John",
      lastName: "Doe"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "present",
        pw: "present",
        pw2: "present",
        firstName: "present",
        lastName: "present",
        birthDate: "missing",
        username: "present"
      },
      message: "Email, passwords, first name, last name, birthDate, and/or username are required"
    });
  });

  it("post with all required fields but pw and pw2 do not match should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "password",
      pw2: "differentpassword",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { pw: "mismatch" },
      message: "Passwords do not match"
    });
  });

  it("post with all required fields but invalid pw should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "short",
      pw2: "short",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        "lower case": "present",
        "min 8 char": "missing",
        "number": "missing",
        "special char": "missing",
        "upper case": "missing",
      },
      message: "Password does not meet complexity requirements"
    });
  });

  it("post with all valid fields but birthdate is in wrong format should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "Pa55word!",
      pw2: "Pa55word!",
      firstName: "John",
      lastName: "Doe",
      birthDate: "01-01-1990"
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { birthDate: "invalid" },
      message: "Invalid birthDate format. Expected format: YYYY-MM-DD"
    });
  });

  it("post with all valid fields but age is less than 18 should return a 400 status code", async () => {
    const underageDate = new Date();
    underageDate.setFullYear(underageDate.getFullYear() - 17); // set to 17 years ago
    const underageDateString = underageDate.toISOString().split('T')[0]; // get YYYY-MM-DD format
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "Pa55word!",
      pw2: "Pa55word!",
      firstName: "John",
      lastName: "Doe",
      birthDate: underageDateString
    });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { birthDate: "too young" },
      message: "User must be at least 18 years old."
    });
  });

  it("post with all valid fields but user already exists should return a 409 status code", async () => {
    vi.spyOn(userSvc, "isUserByUsername").mockResolvedValueOnce(true);
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "Pa55word!",
      pw2: "Pa55word!",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(409);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { username: "already taken" },
      message: "Username is already taken"
    });
  });

  it("post with all valid fields should return a 201 status code", async () => {
    vi.spyOn(userSvc, "isUserByUsername").mockResolvedValueOnce(false);
    const createUserSpy = vi.spyOn(userSvc, "createUser").mockResolvedValueOnce();
    const response = await request(app).post("/pubapi/register").send({
      email: "user@example.com",
      username: "johndoe",
      pw: "Pa55word!",
      pw2: "Pa55word!",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01"
    });
    expect(response.status).toBe(201);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "registered and activation email sent to user@example.com" });
    expect(createUserSpy).toHaveBeenCalledWith(
      expect.any(String),
      "user@example.com",
      expect.any(String),
      "John",
      "Doe",
      "johndoe",
      "1990-01-01",
      expect.any(Number)
    );
  });
});

// route tests for /pubapi/activate/:token
describe("Route /pubapi/activate/:token", () => {
  beforeAll(() => {
    app = appfunc();
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it("post should return a 404 status code", async () => {
    const response = await request(app).post("/pubapi/activate/sometoken");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("put should return a 404 status code", async () => {
    const response = await request(app).put("/pubapi/activate/sometoken");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("delete should return a 404 status code", async () => {
    const response = await request(app).delete("/pubapi/activate/sometoken");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("get without token should return a 404 status code", async () => {
    const response = await request(app).get("/pubapi/activate/");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("get with token should return a 401 status code if token is invalid", async () => {
    const response = await request(app).get("/pubapi/activate/invalidtoken");
    expect(response.status).toBe(401);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        token: "Invalid token. Please log in again."
      },
      message: "invalid token"
    });
  });

  it("get with valid token which is activated should return 200", async () => {
    const mockedToken = await createToken("1", "user@example.com", "username", true);
    const response = await request(app).get(`/pubapi/activate/${mockedToken}`);
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: mockedToken });
  });

  it("get with incomplete token with missing activated should return 400", async () => {
    const incompleteToken = sign({ id: "1", email: "user@example.com", username: "username" }, ConstMatcha.JWT_SECRET, { algorithm: "HS512", expiresIn: ConstMatcha.JWT_EXPIRY });
    const response = await request(app).get(`/pubapi/activate/${incompleteToken}`);
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "Invalid token" });
  });

  it("get with incomplete token with missing id should return 400", async () => {
    const incompleteToken = sign({ email: "user@example.com", username: "username", activated: true }, ConstMatcha.JWT_SECRET, { algorithm: "HS512", expiresIn: ConstMatcha.JWT_EXPIRY });
    const response = await request(app).get(`/pubapi/activate/${incompleteToken}`);
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "Invalid token" });
  });

  it("get with incomplete token with missing email should return 400", async () => {
    const incompleteToken = sign({ id: "1", username: "username", activated: true }, ConstMatcha.JWT_SECRET, { algorithm: "HS512", expiresIn: ConstMatcha.JWT_EXPIRY });
    const response = await request(app).get(`/pubapi/activate/${incompleteToken}`);
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "Invalid token" });
  });

  it("get with incomplete token with missing username should return 400", async () => {
    const incompleteToken = sign({ id: "1", email: "user@example.com", activated: true }, ConstMatcha.JWT_SECRET, { algorithm: "HS512", expiresIn: ConstMatcha.JWT_EXPIRY });
    const response = await request(app).get(`/pubapi/activate/${incompleteToken}`);
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "Invalid token" });
  });

  it("get with valid unactivated token should return a 200 status code", async () => {
    const mockedToken = await createToken("1", "user@example.com", "username", false);
    vi.spyOn(userSvc, "activateUserByUsername").mockResolvedValueOnce(true);
    const response = await request(app).get(`/pubapi/activate/${mockedToken}`);
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    const tokenPayload = await verifyToken(response.body.msg) as AuthToken;
    expect(tokenPayload.id).toEqual("1");
    expect(tokenPayload.email).toEqual("user@example.com");
    expect(tokenPayload.username).toEqual("username");
    expect(tokenPayload.activated).toEqual(true);
  });

  it("get with valid unactivated token but activateUserByUsername throws error should return a 500 status code", async () => {
    const mockedToken = await createToken("1", "user@example.com", "username", false);
    vi.spyOn(userSvc, "activateUserByUsername").mockRejectedValueOnce(new Error("Database error"));
    const response = await request(app).get(`/pubapi/activate/${mockedToken}`);
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        error: {}
      },
      message: "Failed to activate user"
    });
  });
});

// route tests for /pubapi/reset-password
describe("Route /pubapi/reset-password", () => {
  beforeAll(() => {
    app = appfunc();
  });

  it("get should return a 404 status code for an invalid route", async () => {
    const response = await request(app).get("/pubapi/reset-password");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("put should return a 404 status code for an invalid route", async () => {
    const response = await request(app).put("/pubapi/reset-password");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("delete should return a 404 status code for an invalid route", async () => {
    const response = await request(app).delete("/pubapi/reset-password");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("post without body should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/reset-password");
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        body: "missing"
      },
      message: "Request body is required"
    });
  });

  it("post with empty body should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/reset-password").send({});
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "missing",
        username: "missing"
      },
      message: "Email and username are required"
    });
  });

  it("post with only email should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password")
      .send({ email: "user@example.com" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "present",
        username: "missing"
      },
      message: "Email and username are required"
    });
  });

  it("post with only username should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password")
      .send({ username: "username" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "missing",
        username: "present"
      },
      message: "Email and username are required"
    });
  });

  it("post with wrong field names should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password")
      .send({ emal: "user@example.com", username: "username" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        email: "missing",
        username: "present"
      },
      message: "Email and username are required"
    });
  });

  it("post with email or username which does not exist in db should return 400", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password")
      .send({ email: "nonexistent@example.com", username: "nonexistent" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      message: "No user found with the provided email/username",
      context: { email_or_Username: "not found" }
    });
  });

  it("post with email or username but there is isUserByEmailUsername svc error should return 500", async () => {
    vi.spyOn(userSvc, "isUserByEmailUsername").mockRejectedValueOnce(new Error("Database error"));
    const response = await request(app)
      .post("/pubapi/reset-password")
      .send({ email: "nonexistent@example.com", username: "nonexistent" });
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      message: "Failed to check if user exists",
      context: { error: {} }
    });
  });

  it("post with email or username but there is getUserIdByUsername svc error should return 500", async () => {
    vi.spyOn(userSvc, "isUserByEmailUsername").mockResolvedValueOnce(true);
    vi.spyOn(userSvc, "getUserIdByUsername").mockRejectedValueOnce(new Error("Database error"));
    const response = await request(app)
      .post("/pubapi/reset-password")
      .send({ email: "nonexistent@example.com", username: "nonexistent" });
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      message: "Failed to get user ID",
      context: { error: {} }
    });
  });

  it("post with email or username but there is getHashedPwByUsername svc error should return 500", async () => {
    vi.spyOn(userSvc, "isUserByEmailUsername").mockResolvedValueOnce(true);
    vi.spyOn(userSvc, "getUserIdByUsername").mockResolvedValueOnce("1");
    vi.spyOn(userSvc, "getHashedPwByUsername").mockRejectedValueOnce(new Error("Database error"));
    const response = await request(app)
      .post("/pubapi/reset-password")
      .send({ email: "nonexistent@example.com", username: "nonexistent" });
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      message: "Failed to get hashed password",
      context: { error: {} }
    });
  });

  it("post with valid email and username should return 200", async () => {
    vi.spyOn(userSvc, "isUserByEmailUsername").mockResolvedValueOnce(true);
    vi.spyOn(userSvc, "getUserIdByUsername").mockResolvedValueOnce("1");
    vi.spyOn(userSvc, "getHashedPwByUsername").mockResolvedValueOnce("hashedpassword");
    const create = vi.spyOn(jwtSvc, "createPWResetToken");

    const response = await request(app)
      .post("/pubapi/reset-password")
      .send({ email: "user@example.com", username: "username" });
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "Password reset email sent" });
    expect(create).toHaveBeenCalledOnce();
    expect(create).toHaveBeenCalledWith("1", "user@example.com", "username", "hashedpassword");
  });
});

// route tests for /pubapi/reset-password/:id/:token
describe("Route /pubapi/reset-password/:id/:token", () => {
  beforeAll(() => {
    app = appfunc();
  });

  it("get should return a 404 status code", async () => {
    const response = await request(app).get("/pubapi/reset-password/invalid-id/invalid-token")
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("put should return a 404 status code", async () => {
    const response = await request(app).put("/pubapi/reset-password/invalid-id/invalid-token");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { msg: "The requested endpoint does not exist." },
      message: "invalid endpoint"
    });
  });

  it("delete should return a 404 status code", async () => {
    const response = await request(app).delete("/pubapi/reset-password/invalid-id/invalid-token");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        msg: "The requested endpoint does not exist."
      },
      "message": "invalid endpoint"
    });
  });

  it("post with only userId should return a 404 status code", async () => {
    const response = await request(app).post("/pubapi/reset-password/invalid-id");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { msg: "The requested endpoint does not exist." },
      message: "invalid endpoint"
    });
  });

  it("post without body should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/reset-password/1/sometoken");
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        body: "missing"
      },
      message: "Request body is required"
    });
  });

  it("post with empty body should return a 400 status code", async () => {
    const response = await request(app).post("/pubapi/reset-password/1/sometoken").send({});
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        newPassword: "missing",
        newPassword2: "missing"
      },
      message: "New passwords are required"
    });
  });

  it("post with only newPassword should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password/1/sometoken")
      .send({ newPassword: "newpassword" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        newPassword: "present",
        newPassword2: "missing"
      },
      message: "New passwords are required"
    });
  });

  it("post with only newPassword2 should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password/1/sometoken")
      .send({ newPassword2: "newpassword" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        newPassword: "missing",
        newPassword2: "present"
      },
      message: "New passwords are required"
    });
  });

  it("post with wrong field names should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password/1/sometoken")
      .send({ newPw: "newpassword", newPw2: "newpassword" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        newPassword: "missing",
        newPassword2: "missing"
      },
      message: "New passwords are required"
    });
  });

  it("post with non-matching passwords should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password/1/sometoken")
      .send({ newPassword: "newpassword1", newPassword2: "newpassword2" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { newPassword: "mismatch" },
      message: "New passwords do not match"
    });
  });

  it("post with correct body but password is invalid format should return a 400 status code", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password/1/sometoken")
      .send({ newPassword: "short", newPassword2: "short" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: {
        "lower case": "present",
        "min 8 char": "missing",
        "number": "missing",
        "special char": "missing",
        "upper case": "missing",
      },
      message: "New password does not meet complexity requirements"
    });
  });

  it("post with correct body, but wrong userid should return 401", async () => {
    const response = await request(app)
      .post("/pubapi/reset-password/1/invalidtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(401);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { id: "invalid" },
      message: "Invalid id"
    });
  });

  it("post with correct body, but wrong token should return 400", async () => {
    vi.spyOn(userSvc, "getHashedPwById").mockResolvedValueOnce("hashedpassword");
    vi.spyOn(jwtSvc, "verifyPWResetToken").mockResolvedValueOnce("");
    const response = await request(app)
      .post("/pubapi/reset-password/1/invalidtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { token: "invalid" },
      message: "Invalid token"
    });
  });

  it("post with correct body, valid userid and token but decoded value is missing id", async () => {
    vi.spyOn(userSvc, "getHashedPwById").mockResolvedValueOnce("hashedpassword");
    vi.spyOn(jwtSvc, "verifyPWResetToken").mockResolvedValueOnce({ email: "test@example.com", username: "username" });
    const response = await request(app)
      .post("/pubapi/reset-password/1/validtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { token: "invalid" },
      message: "Invalid token"
    });
  });

  it("post with correct body, valid userid and token but decoded value is missing email", async () => {
    vi.spyOn(userSvc, "getHashedPwById").mockResolvedValueOnce("hashedpassword");
    vi.spyOn(jwtSvc, "verifyPWResetToken").mockResolvedValueOnce({ id: "1", username: "username" });
    const response = await request(app)
      .post("/pubapi/reset-password/1/validtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { token: "invalid" },
      message: "Invalid token"
    });
  });

  it("post with correct body, valid userid and token but decoded value is missing username", async () => {
    vi.spyOn(userSvc, "getHashedPwById").mockResolvedValueOnce("hashedpassword");
    vi.spyOn(jwtSvc, "verifyPWResetToken").mockResolvedValueOnce({ id: "1", email: "test@example.com" });
    const response = await request(app)
      .post("/pubapi/reset-password/1/validtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { token: "invalid" },
      message: "Invalid token"
    });
  });

  it("post with correct body, valid userid and token but decoded value is id != id param", async () => {
    vi.spyOn(userSvc, "getHashedPwByUsername").mockResolvedValueOnce("hashedpassword");
    vi.spyOn(jwtSvc, "verifyPWResetToken").mockResolvedValueOnce({ id: "2", email: "test@example.com" });
    const response = await request(app)
      .post("/pubapi/reset-password/1/validtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(401);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { id: "invalid" },
      message: "Invalid id"
    });
  });

  it("post with correct body, valid userid and token but there is getHashedPwById svc error should return 500", async () => {
    vi.spyOn(userSvc, "getHashedPwById").mockRejectedValueOnce(new Error("Database error"));
    const response = await request(app)
      .post("/pubapi/reset-password/1/validtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { error: {} },
      message: "Failed to get hashed password"
    });
  });

  it("post with correct body, valid userid and token but there is verifyPWResetToken svc error should return 500", async () => {
    vi.spyOn(userSvc, "getHashedPwById").mockResolvedValueOnce("hashedpassword");
    vi.spyOn(jwtSvc, "verifyPWResetToken").mockRejectedValueOnce(new Error("Token verification error"));
    const response = await request(app)
      .post("/pubapi/reset-password/1/validtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      err: {},
      message: "Something went wrong"
    });
  });

  it("post with correct body, valid userid and token but hashPW return error should return 500", async () => {
    vi.spyOn(userSvc, "getHashedPwById").mockResolvedValueOnce("hashedpassword");
    vi.spyOn(jwtSvc, "verifyPWResetToken").mockResolvedValueOnce({ id: "1", email: "test@example.com", username: "username" });
    vi.spyOn(authSvc, "hashPW").mockRejectedValueOnce(new Error("Hashing error"));
    const response = await request(app)
      .post("/pubapi/reset-password/1/validtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body.errors[0]).toEqual({
      context: { error: {} },
      message: "Failed to hash new password"
    });
  });

  it("post with correct body, valid userid and token should return 200", async () => {
    vi.spyOn(userSvc, "getHashedPwById").mockResolvedValueOnce("hashedpassword");
    vi.spyOn(jwtSvc, "verifyPWResetToken").mockResolvedValueOnce({ id: "1", email: "test@example.com", username: "username" });
    vi.spyOn(authSvc, "hashPW").mockResolvedValueOnce("newhashedpassword");
    vi.spyOn(userSvc, "setPwById").mockResolvedValueOnce();
    const response = await request(app)
      .post("/pubapi/reset-password/1/validtoken")
      .send({ newPassword: "Validpass1!", newPassword2: "Validpass1!" });
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ msg: "Password has been reset successfully. Pls login again with new pw" });
  });
});
