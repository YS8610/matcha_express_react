import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ConstMatcha from "../../ConstMatcha.js";

describe("chatSvc tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("saveChatmsg : parameter are entered correctly", async () => {
    const insertOneMock = vi.fn().mockResolvedValue({ acknowledged: true, insertedId: "someid" });
    const collectionMock = vi.fn().mockReturnValue({ insertOne: insertOneMock });
    const dbMock = { collection: collectionMock } as any;
    const getDbMock = vi.fn().mockResolvedValue(dbMock);

    const msg = {
      fromUserId: "user1",
      toUserId: "user2",
      content: "Hello",
      timestamp: Date.now(),
    };

    const { saveChatmsg } = await import("../../service/chatSvc.js");
    await saveChatmsg(getDbMock, msg);
    expect(getDbMock).toHaveBeenCalled();
    expect(collectionMock).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES);
    expect(insertOneMock).toHaveBeenCalledWith(msg);
  });

  it("saveChatmsg : handles DB insertion error", async () => {
    const insertOneMock = vi.fn().mockRejectedValue(new Error("DB insertion failed"));
    const collectionMock = vi.fn().mockReturnValue({ insertOne: insertOneMock });
    const dbMock = { collection: collectionMock } as any;
    const getDbMock = vi.fn().mockResolvedValue(dbMock);

    const msg = {
      fromUserId: "user1",
      toUserId: "user2",
      content: "Hello",
      timestamp: Date.now(),
    };

    const { saveChatmsg } = await import("../../service/chatSvc.js");
    await expect(saveChatmsg(getDbMock, msg)).rejects.toThrow("Failed to save chat message in DB");
    expect(getDbMock).toHaveBeenCalled();
    expect(collectionMock).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES);
    expect(insertOneMock).toHaveBeenCalledWith(msg);
  });

  it("getChatHistoryBetweenUsers : retrieves chat history correctly", async () => {
    const mockMessages = [
      { fromUserId: "user1", toUserId: "user2", content: "Hello", timestamp: 1 },
      { fromUserId: "user2", toUserId: "user1", content: "Hi", timestamp: 2 },
    ];
    const findMock = vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue(mockMessages),
          }),
        }),
      }),
    });
    const collectionMock = vi.fn().mockReturnValue({ find: findMock });
    const dbMock = { collection: collectionMock } as any;
    const getDbMock = vi.fn().mockResolvedValue(dbMock);

    const { getChatHistoryBetweenUsers } = await import("../../service/chatSvc.js");
    const result = await getChatHistoryBetweenUsers(getDbMock, "user1", "user2", 0, 10);

    expect(getDbMock).toHaveBeenCalled();
    expect(collectionMock).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES);
    expect(findMock).toHaveBeenCalledWith({
      $or: [
        { fromUserId: "user1", toUserId: "user2" },
        { fromUserId: "user2", toUserId: "user1" },
      ],
    });
    expect(result).toEqual(mockMessages);
  });

  it("getChatHistoryBetweenUsers : handles DB retrieval error", async () => {
    const findMock = vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            toArray: vi.fn().mockRejectedValue(new Error("DB retrieval failed")),
          }),
        }),
      }),
    });
    const collectionMock = vi.fn().mockReturnValue({ find: findMock });
    const dbMock = { collection: collectionMock } as any;
    const getDbMock = vi.fn().mockResolvedValue(dbMock);

    const { getChatHistoryBetweenUsers } = await import("../../service/chatSvc.js");
    await expect(getChatHistoryBetweenUsers(getDbMock, "user1", "user2", 0, 10)).rejects.toThrow("Failed to retrieve chat history from DB");

    expect(getDbMock).toHaveBeenCalled();
    expect(collectionMock).toHaveBeenCalledWith(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES);
    expect(findMock).toHaveBeenCalledWith({
      $or: [
        { fromUserId: "user1", toUserId: "user2" },
        { fromUserId: "user2", toUserId: "user1" },
      ],
    });
  });
});