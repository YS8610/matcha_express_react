import EventEmitter from "events";
import { Notification_Matcha } from "../model/notification.js";
import driver from "../repo/neo4jRepo.js";
import ConstMatcha from "../ConstMatcha.js";
import { serverErrorWrapper } from "../util/wrapper.js";

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
  // todo: persist to redis or neo4j for offline users
  await serverErrorWrapper(() => createNotification(data), "failed to create notification");
}

// fetch notifications for a user from neo4j default latest 20, offset 0
export const getNotificationByUserID = async(userId: string, limit = 20, offset = 0): Promise<Notification_Matcha[]> => {
  // fetch from neo4j
  const session = driver.session();
  const result = await session.run<Notification_Matcha[]>(ConstMatcha.NEO4j_STMT_GET_NOTIFICATIONS_BY_USER_ID, { userId, limit, offset });
  const notifications: Notification_Matcha[] = result.records.map(record => record.get(0));
  session.close();
  return notifications;
}

export const deleteNotificationByUserID = async(userId: string, notificationId: string): Promise<void> => {
  // delete from neo4j
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_DELETE_NOTIFICATION_BY_ID, { userId, notificationId });
  session.close();
}

export const createNotification = async(data: { id: string, userId: string, type: string, message: string, createdAt: number}): Promise<void> => {
  const session = driver.session();
  await session.run(ConstMatcha.NEO4j_STMT_CREATE_NOTIFICATION, data);
  session.close();
}