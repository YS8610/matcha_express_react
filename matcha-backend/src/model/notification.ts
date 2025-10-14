import  ConstMatcha  from "../ConstMatcha.js";

type NotificationType = 
  | typeof ConstMatcha.NOTIFICATION_TYPE_PROFILE_VIEW
  | typeof ConstMatcha.NOTIFICATION_TYPE_LIKE
  | typeof ConstMatcha.NOTIFICATION_TYPE_UNLIKE
  | typeof ConstMatcha.NOTIFICATION_TYPE_MATCH;

export interface Notification_Matcha {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  createdAt: number;
  read: boolean;
}