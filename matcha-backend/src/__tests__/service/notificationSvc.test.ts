import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ConstMatcha, { NOTIFICATION_TYPE } from "../../ConstMatcha.js";
import { Notification_Matcha } from "../../model/notification.js";

describe("notificationSvc tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("notifyUser: ensures that parameters are passed and functions are called", async () => {
    const { notifyUser } = await import("../../service/notificationSvc.js");
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockCreateNotification = vi.fn().mockResolvedValue(undefined);
    const notificationData : Notification_Matcha = {
      id: "notif123",
      userId: "user123",
      type: NOTIFICATION_TYPE.LIKE,
      message: "User123 liked your profile",
      createdAt: Date.now(),
      read: false,
    };
    await notifyUser(mockGetDb, mockCreateNotification, notificationData);
    expect(mockCreateNotification).toHaveBeenCalledWith(mockGetDb, notificationData);
  });

  it("getNotificationByUserID : ensures that parameters are passed and functions are called", async () => {
    const { getNotificationByUserID } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockSort = vi.fn().mockReturnThis();
    const mockSkip = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockReturnThis();
    const mockFind = vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue([]),
      sort: mockSort,
      skip: mockSkip,
      limit: mockLimit,
    });
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        find: mockFind,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    await getNotificationByUserID(mockGetDb, userId);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(20);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockFind).toHaveBeenCalledWith({ userId });
  });

  it("getNotificationByUserID : handles limit parameter", async () => {
    const { getNotificationByUserID } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const limit = 10;
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockSort = vi.fn().mockReturnThis();
    const mockSkip = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockReturnThis();

    const mockFind = vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue([]),
      sort: mockSort,
      skip: mockSkip,
      limit: mockLimit,
    });
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        find: mockFind,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    await getNotificationByUserID(mockGetDb, userId, limit);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(limit);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockFind).toHaveBeenCalledWith({ userId });
  });

  it("getNotificationByUserID : handles offset parameter", async () => {
    const { getNotificationByUserID } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const offset = 5;
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockSort = vi.fn().mockReturnThis();
    const mockSkip = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockReturnThis();
    const mockFind = vi.fn().mockReturnValue({
      toArray: vi.fn().mockResolvedValue([]),
      sort: mockSort,
      skip: mockSkip,
      limit: mockLimit,
    });
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        find: mockFind,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    await getNotificationByUserID(mockGetDb, userId, 20, offset);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockSkip).toHaveBeenCalledWith(offset);
    expect(mockLimit).toHaveBeenCalledWith(20);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockFind).toHaveBeenCalledWith({ userId });
  });

  it("deleteNotificationByUserID : ensures that parameters are passed and functions are called", async () => {
    const { deleteNotificationByUserID } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const notificationId = "notif123";
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockDeleteOne = vi.fn().mockResolvedValue(undefined);
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        deleteOne: mockDeleteOne,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    await deleteNotificationByUserID(mockGetDb, userId, notificationId);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockDeleteOne).toHaveBeenCalledWith({ userId, id: notificationId });
  });

  it("createNotification : ensures that parameters are passed and functions are called", async () => {
    const { createNotification } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const type = NOTIFICATION_TYPE.LIKE;
    const message = "User123 liked your profile";
    const createdAt = Date.now();
    const notificationData = {
      id: "notif123",
      userId,
      type,
      message,
      createdAt,
    };
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockInsertOne = vi.fn().mockResolvedValue(undefined);
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        insertOne: mockInsertOne,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    await createNotification(mockGetDb, notificationData);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockInsertOne).toHaveBeenCalledWith({ ...notificationData, read: false });
  });

  it("markNotificationAsRead : ensures that parameters are passed and functions are called", async () => {
    const { markNotificationAsRead } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const notificationId = "notif123";
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockUpdateOne = vi.fn().mockResolvedValue(undefined);
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        updateOne: mockUpdateOne,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    await markNotificationAsRead(mockGetDb, userId, notificationId);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userId, id: notificationId },
      { $set: { read: true } }
    );
  });

  it("isNotificationExists : ensures that parameters are passed and functions are called", async () => {
    const { isNotificationExists } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const notificationId = "notif123";
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockCountDocuments = vi.fn().mockResolvedValue(1);
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        countDocuments: mockCountDocuments,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    const exists = await isNotificationExists(mockGetDb, notificationId, userId);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockCountDocuments).toHaveBeenCalledWith({ id: notificationId, userId });
    expect(exists).toBe(true);
  });

  it("isNotificationExists : returns false when notification does not exist", async () => {
    const { isNotificationExists } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const notificationId = "notif123";
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockCountDocuments = vi.fn().mockResolvedValue(0);
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        countDocuments: mockCountDocuments,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    const exists = await isNotificationExists(mockGetDb, notificationId, userId);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockCountDocuments).toHaveBeenCalledWith({ id: notificationId, userId });
    expect(exists).toBe(false);
  });

  it("isNotificationExists : return true when notification exists", async () => {
    const { isNotificationExists } = await import("../../service/notificationSvc.js");
    const userId = "user123";
    const notificationId = "notif123";
    const mockGetDb = vi.fn().mockResolvedValue({} as any);
    const mockCountDocuments = vi.fn().mockResolvedValue(1);
    const mockDb = {
      collection: vi.fn().mockReturnValue({
        countDocuments: mockCountDocuments,
      }),
    };
    mockGetDb.mockResolvedValue(mockDb as any);
    const exists = await isNotificationExists(mockGetDb, notificationId, userId);
    expect(mockGetDb).toHaveBeenCalledTimes(1);
    expect(mockDb.collection).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS);
    expect(mockCountDocuments).toHaveBeenCalledWith({ id: notificationId, userId });
    expect(exists).toBe(true);
  });
});