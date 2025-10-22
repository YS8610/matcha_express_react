import { Document, WithId } from "mongodb";
import ConstMatcha from "../ConstMatcha.js";
import { ChatMessage } from "../model/Response.js";
import db from "../repo/mongoRepo.js";
import { serverErrorWrapper } from "../util/wrapper.js";

export const saveChatmsg = async (msg: ChatMessage): Promise<void> => {
  await serverErrorWrapper(
    () => db.collection(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES).insertOne(msg),
    'Failed to save chat message in DB'
  );
};

export const getChatHistoryBetweenUsers = async (userAId: string, userBId: string, skipno: number = 0, limit: number = 50): Promise<ChatMessage[]> => {
  const messages = await serverErrorWrapper(
    () => db.collection(ConstMatcha.MONGO_COLLECTION_CHATMESSAGES)
      .find({
        $or: [
          { fromUserId: userAId, toUserId: userBId },
          { fromUserId: userBId, toUserId: userAId }
        ]
      })
      .sort({ timestamp: -1 })
      .skip(skipno)
      .limit(limit)
      .toArray(),
    'Failed to retrieve chat history from DB'
  );
  return messages.map(
    m => toChatMessage(m)).filter((m : ChatMessage | null) => m !== null
  );
};

const toChatMessage = (d: WithId<Document>): ChatMessage | null => {
  if (
    typeof d.fromUserId === "string" &&
    typeof d.toUserId === "string" &&
    typeof d.content === "string" &&
    typeof d.timestamp === "number"
  ) {
    return {
      fromUserId: d.fromUserId,
      toUserId: d.toUserId,
      content: d.content,
      timestamp: d.timestamp,
    };
  }
  return null;
}