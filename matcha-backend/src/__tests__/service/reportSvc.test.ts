import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";

describe("reportSvc tests", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("isUserReported test: parameters are entered correctly", async () => {
    const mockCountDocuments = vi.fn().mockResolvedValue(1);
    const mockCollection = vi.fn().mockReturnValue({
      countDocuments: mockCountDocuments,
    });
    const mockGetDb = vi.spyOn(await import("../../repo/mongoRepo.js"), "getDb").mockResolvedValue({
      collection: mockCollection,
    } as any);
    const { isUserReported } = await import("../../service/reportSvc.js");
    const reporterId = "user1";
    const reportedId = "user2";
    const result = await isUserReported(reporterId, reportedId, mockGetDb as any);
    expect(mockGetDb).toHaveBeenCalled();
    expect(mockCollection).toHaveBeenCalledWith(expect.any(String));
    expect(mockCountDocuments).toHaveBeenCalledWith({ reporterId, reportedId });
    expect(result).toBe(true);
  });

  it("reportUser test: parameters are entered correctly", async () => {
    const mockInsertOne = vi.fn().mockResolvedValue({ acknowledged: true });
    const mockCollection = vi.fn().mockReturnValue({
      insertOne: mockInsertOne,
    });
    const mockGetDb = vi.spyOn(await import("../../repo/mongoRepo.js"), "getDb").mockResolvedValue({
      collection: mockCollection,
    } as any);

    const { reportUser } = await import("../../service/reportSvc.js");
    const reporterId = "user1";
    const reportedId = "user2";
    await reportUser(reporterId, reportedId, "Inappropriate behavior", mockGetDb as any);
    expect(mockGetDb).toHaveBeenCalled();
    expect(mockCollection).toHaveBeenCalledWith(expect.any(String));
    expect(mockInsertOne).toHaveBeenCalledWith({ reporterId, reportedId, reason: "Inappropriate behavior", timestamp: expect.any(Number) });
  });
});