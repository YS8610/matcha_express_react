import { describe, expect, it, beforeAll, vi, afterEach } from "vitest";
import driver from "../../repo/neo4jRepo.js";
import ConstMatcha from "../../ConstMatcha.js";
import BadRequestError from "../../errors/BadRequestError.js";

describe("photoSvc tests", () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("setPhotobyUserId with invalid photo number throws BadRequestError", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPhotobyUserId } = await import("../../service/photoSvc.js");

    await expect(setPhotobyUserId("userId", "photoUrl", 5)).rejects.toThrow(new BadRequestError({
      message: "Invalid photo number",
      logging: false,
      code: 400,
      context: { err : "pls provide a number from 0 to 4"}
    }));
    expect(runMock).not.toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });

  it("setPhotobyUserId with invalid photo number -2 throw BadRequestError", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPhotobyUserId } = await import("../../service/photoSvc.js");

    await expect(setPhotobyUserId("userId", "photoUrl", -2)).rejects.toThrow(new BadRequestError({
      message: "Invalid photo number",
      logging: false,
      code: 400,
      context: { err : "pls provide a number from 0 to 4"}
    }));
    expect(runMock).not.toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });

  it("setPhotobyUserId with valid photo number 0 calls session.run", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPhotobyUserId } = await import("../../service/photoSvc.js");

    await setPhotobyUserId("userId", "photoUrl", 0);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO0, {
      userId: "userId",
      photoUrl: "photoUrl"
    });
    expect(closeMock).toHaveBeenCalled();
  });

  it("setPhotobyUserId with valid photo number 1 calls session.run", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPhotobyUserId } = await import("../../service/photoSvc.js");

    await setPhotobyUserId("userId", "photoUrl", 1);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO1, {
      userId: "userId",
      photoUrl: "photoUrl"
    });
    expect(closeMock).toHaveBeenCalled();
  });

  it("setPhotobyUserId with valid photo number 2 calls session.run", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPhotobyUserId } = await import("../../service/photoSvc.js");

    await setPhotobyUserId("userId", "photoUrl", 2);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO2, {
      userId: "userId",
      photoUrl: "photoUrl"
    });
    expect(closeMock).toHaveBeenCalled();
  });

  it("setPhotobyUserId with valid photo number 3 calls session.run", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPhotobyUserId } = await import("../../service/photoSvc.js");

    await setPhotobyUserId("userId", "photoUrl", 3);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO3, {
      userId: "userId",
      photoUrl: "photoUrl"
    });
    expect(closeMock).toHaveBeenCalled();
  });

  it("setPhotobyUserId with valid photo number 4 calls session.run", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { setPhotobyUserId } = await import("../../service/photoSvc.js");

    await setPhotobyUserId("userId", "photoUrl", 4);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_ADD_USER_PHOTO4, {
      userId: "userId",
      photoUrl: "photoUrl"
    });
    expect(closeMock).toHaveBeenCalled();
  });

  it("deletePhotoByName deletes existing file and returns true", async () => {
    const unlinkMock = vi.fn().mockResolvedValue(undefined);
    const { deletePhotoByName } = await import("../../service/photoSvc.js");
    const result = await deletePhotoByName(unlinkMock, "existingPhoto.jpg");
    expect(unlinkMock).toHaveBeenCalledWith(`${ConstMatcha.PHOTO_DUMP_DIR}/existingPhoto.jpg`);
    expect(result).toBe(true);
  });

  it("deletePhotoByName handles non-existing file and returns false", async () => {
    const unlinkMock = vi.fn().mockRejectedValue({ code: 'ENOENT' });
    const { deletePhotoByName } = await import("../../service/photoSvc.js");
    const result = await deletePhotoByName(unlinkMock, "nonExistingPhoto.jpg");
    expect(unlinkMock).toHaveBeenCalledWith(`${ConstMatcha.PHOTO_DUMP_DIR}/nonExistingPhoto.jpg`);
    expect(result).toBe(false);
  });

  it("deletePhotoByName throws ServerRequestError on other errors", async () => {
    const unlinkMock = vi.fn().mockRejectedValue(new Error("Some other error"));
    const { deletePhotoByName } = await import("../../service/photoSvc.js");
    await expect(deletePhotoByName(unlinkMock, "photo.jpg")).rejects.toThrow("Failed to delete photo");
    expect(unlinkMock).toHaveBeenCalledWith(`${ConstMatcha.PHOTO_DUMP_DIR}/photo.jpg`);
  });

  it("getAllPhotoNameByUserId retrieves photo names", async () => {
    const runMock = vi.fn().mockResolvedValue({
      records: [
        { get: (index: number) => [`photo0.jpg`, `photo1.jpg`, `photo2.jpg`, "", ""] },
      ]
    });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getAllPhotoNameByUserId } = await import("../../service/photoSvc.js");

    const result = await getAllPhotoNameByUserId("userId");
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_ALL_PHOTO_NAME_BY_USER_ID, { userId: "userId" });
    expect(closeMock).toHaveBeenCalled();
    expect(result).toEqual([`photo0.jpg`, `photo1.jpg`, `photo2.jpg`, "", ""]);
  });

  it("getAllPhotoNameByUserId retrieves empty array when userid cannot be found", async () => {
    const runMock = vi.fn().mockResolvedValue({ records: [ ] });
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { getAllPhotoNameByUserId } = await import("../../service/photoSvc.js");

    const result = await getAllPhotoNameByUserId("userId");
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_GET_ALL_PHOTO_NAME_BY_USER_ID, { userId: "userId" });
    expect(closeMock).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("isValidOrder returns true for valid order", async () => {
    const { isValidOrder } = await import("../../service/photoSvc.js");
    const result = isValidOrder([0, 1, 2, 3, 4]);
    expect(result).toBe(true);
  });

  it("isValidOrder returns false for invalid order with missing number", async () => {
    const { isValidOrder } = await import("../../service/photoSvc.js");
    const result = isValidOrder([0, 1, 2, 4]);
    expect(result).toBe(false);
  });

  it("isValidOrder returns false for invalid order with duplicate number", async () => {
    const { isValidOrder } = await import("../../service/photoSvc.js");
    const result = isValidOrder([0, 1, 2, 2, 4]);
    expect(result).toBe(false);
  });

  it("isValidOrder returns false for invalid order with out-of-range number", async () => {
    const { isValidOrder } = await import("../../service/photoSvc.js");
    const result = isValidOrder([0, 1, 2, 3, 5]);
    expect(result).toBe(false);
  });

  it("reorderPhotosByID updates photo order when there is a change", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { reorderPhotosByID } = await import("../../service/photoSvc.js");

    await reorderPhotosByID("userId", [1, 0, 2, 3, 4], ["photo0.jpg", "photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"]);
    expect(runMock).toHaveBeenCalledWith(ConstMatcha.NEO4j_STMT_SET_PHOTO_ORDER_BY_USER_ID, {
      userId: "userId",
      photo0: "photo1.jpg",
      photo1: "photo0.jpg",
      photo2: "photo2.jpg",
      photo3: "photo3.jpg",
      photo4: "photo4.jpg"
    });
    expect(closeMock).toHaveBeenCalled();
  });

  it("reorderPhotosByID does not call session.run when there is no change", async () => {
    const runMock = vi.fn().mockResolvedValue({});
    const closeMock = vi.fn();
    vi.spyOn(driver, "session").mockImplementation(() => ({ run: runMock, close: closeMock } as any));
    const { reorderPhotosByID } = await import("../../service/photoSvc.js");

    await reorderPhotosByID("userId", [0, 1, 2, 3, 4], ["photo0.jpg", "photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"]);
    expect(runMock).not.toHaveBeenCalled();
    expect(closeMock).not.toHaveBeenCalled();
  });
});

