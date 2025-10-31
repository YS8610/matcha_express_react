import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import driver from "../../repo/neo4jRepo.js";
import BadRequestError from "../../errors/BadRequestError.js";
import { mock } from "node:test";
import { get } from "http";
import { getFame, setFame } from "../../service/fameSvc.js";

describe("testing fameSvc", () => {

  beforeAll(async () => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("getFame : test with correct parameters", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({
      records: [{ get: (key: string) => 85 }],
    });
    const mockSessionClose = vi.fn();
    const mockSession = {
      run: mockSessionRun,
      close: mockSessionClose,
    };
    vi.spyOn(driver, "session").mockReturnValue(mockSession as any);
    const { getFame } = await import("../../service/fameSvc.js");
    const userId = "user123";
    const fame = await getFame(userId);
    expect(driver.session).toHaveBeenCalled();
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
    expect(fame).toBe(85);
  });

  it("getFame : should return null if no records found", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({
      records: [],
    });
    const mockSessionClose = vi.fn();
    const mockSession = {
      run: mockSessionRun,
      close: mockSessionClose,
    };
    vi.spyOn(driver, "session").mockReturnValue(mockSession as any);
    const { getFame } = await import("../../service/fameSvc.js");
    const userId = "user123";
    const fame = await getFame(userId);
    expect(driver.session).toHaveBeenCalled();
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
    expect(fame).toBeNull();
  });

  it("getFame : should test setFame with correct parameters", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({
      records: [{ get: (key: string) => 85 }],
    });
    const mockSessionClose = vi.fn();
    const mockSession = {
      run: mockSessionRun,
      close: mockSessionClose,
    };
    vi.spyOn(driver, "session").mockReturnValue(mockSession as any);
    const { setFame } = await import("../../service/fameSvc.js");
    const userId = "user123";
    const fameValue = 90;
    // Mock isUserExistsById to return true
    const userSvc = await import("../../service/userSvc.js");
    vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(true);
    await setFame(userId, fameValue);
    expect(driver.session).toHaveBeenCalled();
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId, fameRating: fameValue }
    );
    expect(mockSessionClose).toHaveBeenCalled();
  });

  it("setFame : should throw error in setFame if user does not exist", async () => {
    const mockSessionRun = vi.fn();
    const mockSessionClose = vi.fn();
    const mockSession = {
      run: mockSessionRun,
      close: mockSessionClose,
    };
    vi.spyOn(driver, "session").mockReturnValue(mockSession as any);
    const { setFame } = await import("../../service/fameSvc.js");
    const userId = "nonExistentUser";
    const fameValue = 90;
    // Mock isUserExistsById to return false
    const userSvc = await import("../../service/userSvc.js");
    vi.spyOn(userSvc, "isUserExistsById").mockResolvedValueOnce(false);
    expect(driver.session).not.toHaveBeenCalled();
    expect(mockSessionRun).not.toHaveBeenCalled();
    expect(mockSessionClose).not.toHaveBeenCalled();
    await expect(setFame(userId, fameValue)).rejects.toThrowError(new BadRequestError({
      message: `User with id ${userId} does not exist`,
      code: 400,
      context: { error: "UserNotFound" },
    }));
  });

  it("updateFameRating : should update fame rating correctly", async () => {
    const fameSvc = await import("../../service/fameSvc.js");
    const { updateFameRating } = fameSvc;
    const userId = "user123";
    const increment = 30;
    const mockgetFame = vi.spyOn(fameSvc, "getFame").mockResolvedValue(50);
    const mocksetFame = vi.spyOn(fameSvc, "setFame").mockResolvedValue();
    const newFame = await updateFameRating(userId, increment, getFame, setFame);
    expect(mockgetFame).toHaveBeenCalledWith(userId);
    expect(mocksetFame).toHaveBeenCalledWith(userId, 80);
    expect(newFame).toBe(80);
  });

  it("updateFameRating : should throw error if user does not exist", async () => {
    const { updateFameRating } = await import("../../service/fameSvc.js");
    const userId = "nonExistentUser";
    const increment = 20;
    await expect(updateFameRating(userId, increment, getFame, setFame)).rejects.toThrowError(
      new BadRequestError({
        message: `User with id ${userId} does not exist`,
        code: 400,
        context: { error: "UserNotFound" },
      })
    );
  });

});

