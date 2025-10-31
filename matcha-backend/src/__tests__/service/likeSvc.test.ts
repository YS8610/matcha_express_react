import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import driver from "../../repo/neo4jRepo.js";

describe("likeSvc tests", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("getLikedById test: parameters are entered correctly", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({ records: [] });
    const mockSessionClose = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: mockSessionRun, close: mockSessionClose } as any));
    const { getLikedById } = await import("../../service/likeSvc.js");
    const userId = "user123";
    await getLikedById(userId);
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
  });

  it("getLiked test: parameters are entered correctly", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({ records: [] });
    const mockSessionClose = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: mockSessionRun, close: mockSessionClose } as any));
    const { getLiked } = await import("../../service/likeSvc.js");
    const userId = "user123";
    await getLiked(userId);
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
  });

  it("addLiked test: parameters are entered correctly", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({});
    const mockSessionClose = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: mockSessionRun, close: mockSessionClose } as any));
    const { addLiked } = await import("../../service/likeSvc.js");
    const userId = "user123";
    const likedUserId = "user456";
    await addLiked(userId, likedUserId);
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId, likedUserId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
  });

  it("removeLiked test: parameters are entered correctly", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({});
    const mockSessionClose = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: mockSessionRun, close: mockSessionClose } as any));
    const { removeLiked } = await import("../../service/likeSvc.js");
    const userId = "user123";
    const likedUserId = "user456";
    await removeLiked(userId, likedUserId);
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId, likedUserId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
  });

  it("isLiked test: parameters are entered correctly", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({ records: [{ get: vi.fn().mockReturnValue(true) }] });
    const mockSessionClose = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: mockSessionRun, close: mockSessionClose } as any));
    const { isLiked } = await import("../../service/likeSvc.js");
    const userId = "user123";
    const otherUserId = "user456";
    await isLiked(userId, otherUserId);
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId, otherUserId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
  });

  it("isMatch test: parameters are entered correctly", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({ records: [{ get: vi.fn().mockReturnValue(2) }] });
    const mockSessionClose = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: mockSessionRun, close: mockSessionClose } as any));
    const { isMatch } = await import("../../service/likeSvc.js");
    const userId = "user123";
    const otherUserId = "user456";
    await isMatch(userId, otherUserId);
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId, otherUserId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
  });

  it("getMatchedUsersShortProfile test: parameters are entered correctly", async () => {
    const mockSessionRun = vi.fn().mockResolvedValue({ records: [] });
    const mockSessionClose = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: mockSessionRun, close: mockSessionClose } as any));
    const { getMatchedUsersShortProfile } = await import("../../service/likeSvc.js");
    const userId = "user123";
    await getMatchedUsersShortProfile(userId);
    expect(mockSessionRun).toHaveBeenCalledWith(
      expect.any(String),
      { userId }
    );
    expect(mockSessionClose).toHaveBeenCalled();
  });
});