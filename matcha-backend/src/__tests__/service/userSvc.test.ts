import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ConstMatcha from "../../ConstMatcha.js";
import driver from "../../repo/neo4jRepo.js";
import { int } from "neo4j-driver";
import { ProfilePutJson } from "../../model/profile.js";

describe("userSvc tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
    delete (globalThis as any).__mongoMocks;
  });

  // Add userSvc specific tests here
  it("isUserByEmail test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [{ get: () => ({ email: "test@example.com" }) }] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { isUserByEmail } = await import("../../service/userSvc.js");
    const email = "test@example.com";
    const result = await isUserByEmail(email);
    expect(result).toEqual(true);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_EMAIL, { email });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("isUserByUsername test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [{ get: () => ({ email: "test@example.com" }) }] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { isUserByUsername } = await import("../../service/userSvc.js");
    const username = "testuser";
    const result = await isUserByUsername(username);
    expect(result).toEqual(true);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("isUserExistsById test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [{ get: () => ({ id: "user-123" }) }] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { isUserExistsById } = await import("../../service/userSvc.js");
    const id = "user-123";
    const result = await isUserExistsById(id);
    expect(result).toEqual(true);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("isUserByEmailUsername test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [{ get: () => ({ email: "test@example.com", username: "testuser" }) }] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { isUserByEmailUsername } = await import("../../service/userSvc.js");
    const email = "test@example.com";
    const username = "testuser";
    const result = await isUserByEmailUsername(email, username);
    expect(result).toEqual(true);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_EMAIL_USERNAME, { email, username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUsers test: retrieves all users", async () => {
    const mockUsers = [
      { get: () => ({ id: "user-1", email: "user1@example.com" }) },
      { get: () => ({ id: "user-2", email: "user2@example.com" }) }
    ];
    const runMock = vi.fn().mockResolvedValue({ records: mockUsers });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUsers } = await import("../../service/userSvc.js");
    const result = await getUsers();
    expect(result).toEqual(mockUsers.map(record => record.get()));
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_ALL_USERS);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserById test: retrieves user by ID", async () => {
    const mockRecord = { get: () => ({ id: "user-123", email: "user123@example.com" }) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserById } = await import("../../service/userSvc.js");
    const id = "user-123";
    const result = await getUserById(id);
    expect(result).toEqual(mockRecord.get());
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getShortProfileById test: retrieves short profile by ID", async () => {
    const mockRecord = {
      get: (key: string) => {
        if (key === "u") return { id: "user-456", username: "shortuser" };
        if (key === "userTags") return ["gaming", "music"];
        return null;
      }
    };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getShortProfileById } = await import("../../service/userSvc.js");
    const id = "user-456";
    const result = await getShortProfileById(id);
    expect(result).toEqual({ id: "user-456", username: "shortuser", userTags: ["gaming", "music"] });
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_SHORT_PROFILE_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getShortProfileById test: retrieves 2 short profile by ID, should return null", async () => {
    const mockRecord1 = {
      get: (key: string) => {
        if (key === "u") return { id: "user-456", username: "shortuser" };
        if (key === "userTags") return ["tag1"];
        return null;
      }
    };
    const mockRecord2 = {
      get: (key: string) => {
        if (key === "u") return { id: "user-789", username: "shortuser2" };
        if (key === "userTags") return ["tag2"];
        return null;
      }
    };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord1, mockRecord2] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getShortProfileById } = await import("../../service/userSvc.js");
    const id = "user-456";
    const result = await getShortProfileById(id);
    expect(result).toEqual(null);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_SHORT_PROFILE_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getShortProfilebyIdFiltered test: retrieves filtered short profiles", async () => {
    const mockRecords = [
      {
        get: (key: string) => {
          if (key === "u") return { id: "user-1", username: "filtereduser1" };
          if (key === "userTags") return ["sports", "travel"];
          return null;
        }
      },
      {
        get: (key: string) => {
          if (key === "u") return { id: "user-2", username: "filtereduser2" };
          if (key === "userTags") return ["books", "art"];
          return null;
        }
      }
    ];
    const runMock = vi.fn().mockResolvedValue({ records: mockRecords });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getShortProfilebyIdFiltered } = await import("../../service/userSvc.js");
    const result = await getShortProfilebyIdFiltered("user-123", 18, 30, 10, 100, 1, 0, 10);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), {
      userId: "user-123",
      minAge: int(18),
      maxAge: int(30),
      minFameRating: int(10),
      maxFameRating: int(100),
      sexualPreference: int(1),
      skip: int(0),
      limit: int(10)
    });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserByUsername test: retrieves 1 user by username", async () => {
    const mockRecord = { get: () => ({ id: "user-789", username: "testuser" }) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserByUsername } = await import("../../service/userSvc.js");
    const username = "testuser";
    const result = await getUserByUsername(username);
    expect(result).toEqual(mockRecord.get());
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserByUsername test: retrieves 0 user by username, should return null", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserByUsername } = await import("../../service/userSvc.js");
    const username = "nonexistentuser";
    const result = await getUserByUsername(username);
    expect(result).toEqual(null);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserByUsername test: retrieves 2 users by username, should return null", async () => {
    const mockRecord1 = { get: () => ({ id: "user-1", username: "duplicateuser" }) };
    const mockRecord2 = { get: () => ({ id: "user-2", username: "duplicateuser" }) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord1, mockRecord2] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock }as any));
    const { getUserByUsername } = await import("../../service/userSvc.js");
    const username = "duplicateuser";
    const result = await getUserByUsername(username);
    expect(result).toEqual(null);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserIdByUsername test: retrieves user ID by username", async () => {
    const mockRecord = { get: () => ({ id: "user-999" }) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserIdByUsername } = await import("../../service/userSvc.js");
    const username = "testuser";
    const result = await getUserIdByUsername(username);
    expect(result).toEqual("user-999");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserIdByUsername test: retrieves 0 user by username, should return empty string", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserIdByUsername } = await import("../../service/userSvc.js");
    const username = "nonexistentuser";
    const result = await getUserIdByUsername(username);
    expect(result).toEqual("");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserIdByUsername test: retrieves 2 users by username, should return empty string", async () => {
    const mockRecord1 = { get: () => ({ id: "user-1" }) };
    const mockRecord2 = { get: () => ({ id: "user-2" }) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord1, mockRecord2] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserIdByUsername } = await import("../../service/userSvc.js");
    const username = "duplicateuser";
    const result = await getUserIdByUsername(username);
    expect(result).toEqual("");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getHashedPwById test: retrieves hashed password by user ID", async () => {
    const mockRecord = { get: (key: string) => (key === "pw" ? "hashedpassword123" : null) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getHashedPwById } = await import("../../service/userSvc.js");
    const id = "user-123";
    const result = await getHashedPwById(id);
    expect(result).toEqual("hashedpassword123");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_PW_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getHashedPwById test: retrieves 0 user by ID, should return empty string", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getHashedPwById } = await import("../../service/userSvc.js");
    const id = "nonexistentuser";
    const result = await getHashedPwById(id);
    expect(result).toEqual("");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_PW_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getHashedPwById test: retrieves 2 users by ID, should return empty string", async () => {
    const mockRecord1 = { get: (key: string) => (key === "pw" ? "hashedpassword1" : null) };
    const mockRecord2 = { get: (key: string) => (key === "pw" ? "hashedpassword2" : null) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord1, mockRecord2] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getHashedPwById } = await import("../../service/userSvc.js");
    const id = "duplicateuser";
    const result = await getHashedPwById(id);
    expect(result).toEqual("");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_PW_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getHashedPwByUsername test: retrieves hashed password by username", async () => {
    const mockRecord = { get: (key: string) => (key === "pw" ? "hashedpassword456" : null) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getHashedPwByUsername } = await import("../../service/userSvc.js");
    const username = "testuser";
    const result = await getHashedPwByUsername(username);
    expect(result).toEqual("hashedpassword456");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_PW_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getHashedPwByUsername test: retrieves 0 user by username, should return empty string", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock }as any));
    const { getHashedPwByUsername } = await import("../../service/userSvc.js");
    const username = "nonexistentuser";
    const result = await getHashedPwByUsername(username);
    expect(result).toEqual("");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_PW_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getHashedPwByUsername test: retrieves 2 users by username, should return empty string", async () => {
    const mockRecord1 = { get: (key: string) => (key === "pw" ? "hashedpassword1" : null) };
    const mockRecord2 = { get: (key: string) => (key === "pw" ? "hashedpassword2" : null) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord1, mockRecord2] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getHashedPwByUsername } = await import("../../service/userSvc.js");
    const username = "duplicateuser";
    const result = await getHashedPwByUsername(username);
    expect(result).toEqual("");
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_PW_BY_USERNAME, { username });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("setUserProfileById test: parameters are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setUserProfileById } = await import("../../service/userSvc.js");
    const profileUpdateJson :Partial<ProfilePutJson> = {
      firstName: "Updated",
      lastName: "User",
      biography: "This is an updated bio.",
      gender: 2,
      sexualPreference: 1,
    };
    await setUserProfileById("user-123", profileUpdateJson as any);
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_SET_USER_PROFILE_BY_ID, { id: "user-123", ...profileUpdateJson });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("setPwByUsername test: parameters are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPwByUsername } = await import("../../service/userSvc.js");
    await setPwByUsername("testuser", "newhashedpassword");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_SET_PW_BY_USERNAME, { username: "testuser", hashedpw: "newhashedpassword" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("setPwById test: parameters are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPwById } = await import("../../service/userSvc.js");
    await setPwById("user-123", "newhashedpassword");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_SET_PW_BY_ID, { id: "user-123", hashedpw: "newhashedpassword" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("createUser test: parameters are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { createUser } = await import("../../service/userSvc.js");
    await createUser("user-123", "test@email.com", "hashedpassword", "Test", "User", "testuser", "1990-01-01", 1625158800);
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_CREATE_USER, {
      id: "user-123",
      email: "test@email.com",
      password: "hashedpassword",
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      birthDate: "1990-01-01",
      lastOnline: 1625158800
    });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("activateUserByUsername test: activates user correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [{ get: () => ({ username: "testuser" }) }] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { activateUserByUsername } = await import("../../service/userSvc.js");
    const result = await activateUserByUsername("testuser");
    expect(result).toEqual(true);
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_ACTIVATE_USER_BY_USERNAME, { username: "testuser" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("activateUserByUsername test: activation fails for non-existent user", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { activateUserByUsername } = await import("../../service/userSvc.js");
    const result = await activateUserByUsername("nonexistentuser");
    expect(result).toEqual(false);
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_ACTIVATE_USER_BY_USERNAME, { username: "nonexistentuser" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("activateUserByUsername test: activation fails when multiple users found", async () => {
    const mockRecord1 = { get: () => ({ username: "duplicateuser" }) };
    const mockRecord2 = { get: () => ({ username: "duplicateuser" }) };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord1, mockRecord2] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { activateUserByUsername } = await import("../../service/userSvc.js");
    const result = await activateUserByUsername("duplicateuser");
    expect(result).toEqual(true);
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_ACTIVATE_USER_BY_USERNAME, { username: "duplicateuser" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserProfileById test: retrieves user profile by ID", async () => {
    const mockRecord = {
      get: (key: string) => {
        if (key === "u") return { id: "user-123", firstName: "Test", lastName: "User" };
        if (key === "userTags") return ["hiking", "coffee"];
        return null;
      }
    };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserProfileById } = await import("../../service/userSvc.js");
    const id = "user-123";
    const result = await getUserProfileById(id);
    expect(result).toEqual({ id: "user-123", firstName: "Test", lastName: "User", userTags: ["hiking", "coffee"] });
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_PROFILE_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserProfileById test: retrieves 0 user by ID, should return null", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserProfileById } = await import("../../service/userSvc.js");
    const id = "nonexistentuser";
    const result = await getUserProfileById(id);
    expect(result).toEqual(null);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_PROFILE_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getUserProfileById test: retrieves 2 users by ID, should return null", async () => {
    const mockRecord1 = {
      get: (key: string) => {
        if (key === "u") return { id: "user-1", firstName: "User1" };
        if (key === "userTags") return ["tag1"];
        return null;
      }
    };
    const mockRecord2 = {
      get: (key: string) => {
        if (key === "u") return { id: "user-2", firstName: "User2" };
        if (key === "userTags") return ["tag2"];
        return null;
      }
    };
    const runMock = vi.fn().mockResolvedValue({ records: [mockRecord1, mockRecord2] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getUserProfileById } = await import("../../service/userSvc.js");
    const id = "duplicateuser";
    const result = await getUserProfileById(id);
    expect(result).toEqual(null);
    expect(driver.session).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_PROFILE_BY_ID, { id });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("setLastOnlineById test: parameters are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setLastOnlineById } = await import("../../service/userSvc.js");
    await setLastOnlineById("user-123", 1625158800);
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_SET_LAST_ONLINE_BY_ID, { id: "user-123", timestamp: 1625158800 });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("isPwValid test: invalid password with min 8 characters and lowercase but no uppercase, number, special character", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("hashedpassword");
    expect(result).toEqual(0 | 2 | 8 | 16);
  });

  it("isPwValid test: valid password with all criteria met", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("Valid1@Password");
    expect(result).toEqual(0);
  });

  it("isPwValid test: invalid password with less than 8 characters", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("V1@p");
    expect(result).toEqual(0 | 1);
  });

  it("isPwValid test: invalid password missing uppercase letter", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("valid1@password");
    expect(result).toEqual(0 | 2);
  });

  it("isPwValid test: invalid password missing lowercase letter", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("VALID1@PASSWORD");
    expect(result).toEqual(0 | 4);
  });

  it("isPwValid test: invalid password missing number", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("Valid@Password");
    expect(result).toEqual(0 | 8);
  });

  it("isPwValid test: invalid password missing special character", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("Valid1Password");
    expect(result).toEqual(0 | 16);
  });

  it("isPwValid test: invalid password missing multiple criteria", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("validpassword");
    expect(result).toEqual(0 | 2 | 8 | 16);
  });

  it("isPwValid test: empty password", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("");
    expect(result).toEqual(0 | 1 | 2 | 4 | 8 | 16);
  });

  it("isPwValid test: password with only special characters", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("@#$%^&*");
    expect(result).toEqual(0 | 1 | 2 | 4 | 8);
  });

  it("isPwValid test: password with only numbers", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("12345678");
    expect(result).toEqual(0 | 2 | 4 | 16);
  });

  it("isPwValid test: password with spaces only", async () => {
    const { isPwValid } = await import("../../service/userSvc.js");
    const result = isPwValid("        ");
    expect(result).toEqual(0 | 2 | 4 | 8 | 16);
  });

  it("isValidDateString test: valid date string", async () => {
    const { isValidDateStr } = await import("../../service/userSvc.js");
    const result = isValidDateStr("2023-10-15");
    expect(result).toEqual(true);
  });

  it("isValidDateString test: invalid date string", async () => {
    const { isValidDateStr } = await import("../../service/userSvc.js");
    const result = isValidDateStr("15-10-2023");
    expect(result).toEqual(false);
  });

  it("isValidDateString test: non-date string", async () => {
    const { isValidDateStr } = await import("../../service/userSvc.js");
    const result = isValidDateStr("invalid-date");
    expect(result).toEqual(false);
  });

  it("isValidDateString test: empty string", async () => {
    const { isValidDateStr } = await import("../../service/userSvc.js");
    const result = isValidDateStr("");
    expect(result).toEqual(false);
  });

  it("isValidDateString test: null input", async () => {
    const { isValidDateStr } = await import("../../service/userSvc.js");
    const result = isValidDateStr(null as any);
    expect(result).toEqual(false);
  });

  it("isValidDateString test: undefined input", async () => {
    const { isValidDateStr } = await import("../../service/userSvc.js");
    const result = isValidDateStr(undefined as any);
    expect(result).toEqual(false);
  });

  it("isValidDateString test: invalid date with correct format", async () => {
    const { isValidDateStr } = await import("../../service/userSvc.js");
    const result = isValidDateStr("2023-aa-30");
    expect(result).toEqual(false);
  });

  it("isValidEmail test: valid email address", async () => {
    const { isValidEmail } = await import("../../service/userSvc.js");
    const result = isValidEmail("testuser@email.com");
    expect(result).toEqual(true);
  });

  it("isValidEmail test: invalid email address", async () => {
    const { isValidEmail } = await import("../../service/userSvc.js");
    const result = isValidEmail("invalid-email");
    expect(result).toEqual(false);
  });

  it("isValidEmail test: empty email string", async () => {
    const { isValidEmail } = await import("../../service/userSvc.js");
    const result = isValidEmail("");
    expect(result).toEqual(false);
  });

  it("isValidEmail test: email without domain", async () => {
    const { isValidEmail } = await import("../../service/userSvc.js");
    const result = isValidEmail("user@");
    expect(result).toEqual(false);
  });

  it("isValidEmail test: email without username", async () => {
    const { isValidEmail } = await import("../../service/userSvc.js");
    const result = isValidEmail("@domain.com");
    expect(result).toEqual(false);
  });

  it("isValidEmail test: email with special characters", async () => {
    const { isValidEmail } = await import("../../service/userSvc.js");
    const result = isValidEmail("user!#$%&'*+/=?^_`{|}~-@domain.com");
    expect(result).toEqual(true);
  });

  it("isValidEmail test: email with subdomain", async () => {
    const { isValidEmail } = await import("../../service/userSvc.js");
    const result = isValidEmail("user@sub.domain.com");
    expect(result).toEqual(true);
  });

  it("isValidProfile test : valid profile data", async () => {
    const { isValidProfile } = await import("../../service/userSvc.js");
    const profileData: ProfilePutJson = {
      firstName: "John",
      lastName: "Doe",
      biography: "Hello, I'm John!",
      birthDate: "1990-01-01",
      email: "john.doe@email.com",
      gender: 1,
      sexualPreference: 1
    };
    const result = isValidProfile(profileData);
    expect(result).toEqual(0);
  });

  it("isValidProfile test : invalid profile data with multiple errors", async () => {
    const { isValidProfile } = await import("../../service/userSvc.js");
    const profileData: ProfilePutJson = {
      firstName: "",
      lastName: "Doe",
      email: "john.doeemail.com",
      biography: "Hello, I'm John!",
      birthDate: "01-01-1990",
      gender: 3,
      sexualPreference: 5
    };
    const result = isValidProfile(profileData);
    expect(result).toEqual(1 | 1<<2 | 1<<4 | 1<<6);
  });

  it("isValidProfile test : invalid profile data with all errors", async () => {
    const { isValidProfile } = await import("../../service/userSvc.js");
    const profileData: ProfilePutJson = {
      firstName: "",
      lastName: "",
      email: "johndoeemailcom",
      biography: "Hello, I'm John!",
      birthDate: "19900101",
      gender: -1,
      sexualPreference: -1
    };
    const result = isValidProfile(profileData);
    expect(result).toEqual(1 | 1<<1 | 1<<2 | 1<<4 | 1<<5 | 1<<6);
  });

});