import  { NOTIFICATION_TYPE }  from "../ConstMatcha.js";

type NotificationType =
  typeof NOTIFICATION_TYPE.VIEW |
  typeof NOTIFICATION_TYPE.LIKE |
  typeof NOTIFICATION_TYPE.UNLIKE |
  typeof NOTIFICATION_TYPE.MATCH |
  typeof NOTIFICATION_TYPE.MESSAGE;

export interface Notification_Matcha {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  createdAt: number;
  read: boolean;
}