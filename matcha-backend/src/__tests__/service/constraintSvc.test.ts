import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { setAllConstraints } from "../../service/constraintSvc.js";
import driver from "../../repo/neo4jRepo.js";
import ConstMatcha from "../../ConstMatcha.js";

describe("Testing constraintSvc", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("runs both constraint statements and closes the session", async () => {
    const mockRun = vi.fn().mockResolvedValueOnce({} as any).mockResolvedValueOnce({} as any);
    const mockClose = vi.fn();
    const mockSession = { run: mockRun, close: mockClose } as any;
    vi.spyOn(driver, "session").mockReturnValue(mockSession);
    await setAllConstraints();
    expect(mockRun).toHaveBeenCalledTimes(2);
    expect(mockRun).toHaveBeenNthCalledWith(1, ConstMatcha.NEO4j_STMT_ID_CONSTRAINT_UNIQUE_ID);
    expect(mockRun).toHaveBeenNthCalledWith(2, ConstMatcha.NEO4j_STMT_TAG_CONSTRAINT_UNIQUE_NAME);
    expect(mockClose).toHaveBeenCalled();
  });

});