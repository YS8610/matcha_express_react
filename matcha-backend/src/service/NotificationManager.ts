import EventEmitter from "events";
import { Notification_Matcha } from "../model/notification.js";

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

export const notifyUser = (data: Notification_Matcha): void => {
  NotificationManager.getInstance().notify("event", data);
  // todo: persist to redis or neo4j for offline users
}