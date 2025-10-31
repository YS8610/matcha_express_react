import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import driver from "../../repo/neo4jRepo.js";

describe("viewedSvc tests", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("getVisitedById test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getVisitedById } = await import("../../service/viewedSvc.js");
    const res = await getVisitedById("user-123");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-123" });
    expect(res).toEqual([]);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getViewedById test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getViewedById } = await import("../../service/viewedSvc.js");
    const res = await getViewedById("user-456");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-456" });
    expect(res).toEqual([]);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("addViewed test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { addViewed } = await import("../../service/viewedSvc.js");
    await addViewed("user-789", "user-987");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-789", viewedUserId: "user-987" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("isViewed test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [{ get: vi.fn().mockReturnValue(true) }] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { isViewed } = await import("../../service/viewedSvc.js");
    const res = await isViewed("user-111", "user-222");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-111", otherUserId: "user-222" });
    expect(res).toBe(true);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});