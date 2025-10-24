import EventEmitter from "events";
import { Notification_Matcha } from "../model/notification.js";
import ConstMatcha, { NOTIFICATION_TYPE } from "../ConstMatcha.js";
import { serverErrorWrapper } from "../util/wrapper.js";
import { getDb } from "../repo/mongoRepo.js";
import { WithId, Document } from "mongodb";

export class NotificationManager extends EventEmitter {
  private static instance: NotificationManager;

  private constructor() {
    super();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance)
      NotificationManager.instance = new NotificationManager();
    return NotificationManager.instance;
  }

  public notify(event: string, data: Record<string, string|boolean|number> |Notification_Matcha): void {
    this.emit(event, data);
  }

  public subscribe(event: string, listener: (data: Record<string, string|boolean|number> |Notification_Matcha) => void): void {
    this.on(event, listener);
  }

  public unsubscribe(event: string, listener: (data: Record<string, string|boolean|number> |Notification_Matcha) => void): void {
    this.off(event, listener);
  }
}

export const notifyUser = async (data: Notification_Matcha) => {
  NotificationManager.getInstance().notify("event", data);
  await serverErrorWrapper(() => createNotification(data), "failed to create notification");
}

const isNotificationType = (v: any): boolean => {
  if (typeof v !== "string") return false;
  const allowedValues: string[] = [
    NOTIFICATION_TYPE.VIEW,
    NOTIFICATION_TYPE.LIKE,
    NOTIFICATION_TYPE.UNLIKE,
    NOTIFICATION_TYPE.MATCH,
    NOTIFICATION_TYPE.MESSAGE,
  ];
  return allowedValues.includes(v);
};

const toNotification = (d: WithId<Document>): Notification_Matcha | null => {
  if (
    typeof d.userId === "string" &&
    isNotificationType(d.type) &&
    typeof d.message === "string" &&
    typeof d.createdAt === "number" &&
    typeof d.read === "boolean" &&
    typeof d.id === "string"
  ) {
    return {
      id: d.id,
      userId: d.userId,
      type: d.type,
      message: d.message,
      createdAt: d.createdAt,
      read: d.read,
    };
  }
  return null;
}

export const getNotificationByUserID = async(userId: string, limit = 20, offset = 0): Promise<Notification_Matcha[]> => {
  const db = await getDb();
  // fetch from mongodb
  const noti = await db.collection(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS).find({ userId })
  .sort({ createdAt: -1 })
  .skip(offset)
  .limit(limit)
  .toArray();
  return noti.map(n => toNotification(n)).filter((n: Notification_Matcha | null) => n !== null) as Notification_Matcha[];
}

export const deleteNotificationByUserID = async(userId: string, notificationId: string): Promise<void> => {
  const db = await getDb();
  // delete from mongodb
  await db.collection(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS).deleteOne({ userId, id: notificationId });
}

export const createNotification = async(data: { id: string, userId: string, type: string, message: string, createdAt: number}): Promise<void> => {
  const db = await getDb();
  await db.collection(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS).insertOne({ ...data, read: false });
}

export const markNotificationAsRead = async(userId: string, notificationId: string): Promise<void> => {
  const db = await getDb();
  await db.collection(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS).updateOne(
    { userId, id: notificationId },
    { $set: { read: true } }
  );
}

export const isNotificationExists = async(notificationID:string, userId:string): Promise<boolean> => {
  const db = await getDb();
  const count = await db.collection(ConstMatcha.MONGO_COLLECTION_NOTIFICATIONS).countDocuments({ id: notificationID, userId });
  return count > 0;
}