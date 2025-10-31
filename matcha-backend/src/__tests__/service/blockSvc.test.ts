import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import driver from "../../repo/neo4jRepo.js";
import ConstMatcha from "../../ConstMatcha.js";

describe("blockSvc tests", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("getBlockedById : parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getBlockedById } = await import("../../service/blockSvc.js");
    const res = await getBlockedById("user-123");
    // assert the mocked run was called with the expected statement and params
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_USER_BLOCKED_BY_ID, { userId: "user-123" });
    expect(res).toEqual([]);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("setBlockedById : parameter are entered correctly", async () => {
    const runMock = vi.fn();
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setBlockedById } = await import("../../service/blockSvc.js");
    await setBlockedById("user-123", "blocked-user-456");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-123", blockedUserId: "blocked-user-456" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("deleteBlockedById : parameter are entered correctly", async () => {
    const runMock = vi.fn();
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { deleteBlockedById } = await import("../../service/blockSvc.js");
    await deleteBlockedById("user-123", "blocked-user-456");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-123", blockedUserId: "blocked-user-456" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getBlockedRel : parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValueOnce({ records: [ { get: vi.fn().mockReturnValue(true) } ] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getBlockedRel } = await import("../../service/blockSvc.js");
    const res = await getBlockedRel("user-123", "other-user-456");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-123", otherUserId: "other-user-456" });
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(res).toBe(true);
  });

});