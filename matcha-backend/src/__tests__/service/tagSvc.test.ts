import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import driver from "../../repo/neo4jRepo.js";
describe("tagSvc tests", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("createTag test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { createTag } = await import("../../service/tagSvc.js");
    await createTag("testTag");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { name: "testTag" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getTagCountById test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [{ get: vi.fn().mockReturnValue(5) }] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getTagCountById } = await import("../../service/tagSvc.js");
    const res = await getTagCountById("user-123");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-123" });
    expect(res).toBe(5);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("getTagsById test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [{ get: vi.fn().mockReturnValue("tag1") }, { get: vi.fn().mockReturnValue("tag2") }] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getTagsById } = await import("../../service/tagSvc.js");
    const res = await getTagsById("user-456");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-456" });
    expect(res).toEqual(["tag1", "tag2"]);
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("setTagbyUserId test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setTagbyUserId } = await import("../../service/tagSvc.js");
    await setTagbyUserId("user-789", "newTag");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-789", tagName: "newTag" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("deleteTagbyUserId test: parameter are entered correctly", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { deleteTagbyUserId } = await import("../../service/tagSvc.js");
    await deleteTagbyUserId("user-321", "oldTag");
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledWith(expect.any(String), { userId: "user-321", tagName: "oldTag" });
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});