export interface ResMsg{
  msg: string;
}

export interface ChatMessage{
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: number;
}