// src/components/chat/MessageList.tsx
import React, { useEffect, useRef } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Message, User } from '../types/message';

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  otherUser: User;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  otherUser
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const MessageBubble: React.FC<{ message: Message; isOwn: boolean; showAvatar: boolean }> = ({
    message,
    isOwn,
    showAvatar
  }) => (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwn && showAvatar && (
        <img
          src={otherUser.avatar}
          alt={otherUser.name}
          className="w-8 h-8 rounded-full mr-3 mt-auto"
        />
      )}
      {!isOwn && !showAvatar && <div className="w-8 mr-3" />}

      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isOwn
              ? 'bg-pink-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          
          {isOwn && (
            <div className="text-gray-500">
              {message.status === 'sent' && <Check size={12} />}
              {message.status === 'delivered' && <CheckCheck size={12} />}
              {message.status === 'read' && <CheckCheck size={12} className="text-pink-500" />}
            </div>
          )}
        </div>
      </div>

      {isOwn && <div className="w-8 ml-3" />}
    </div>
  );

  const DateSeparator: React.FC<{ date: string }> = ({ date }) => (
    <div className="flex items-center my-6">
      <div className="flex-1 border-t border-gray-200" />
      <span className="px-4 text-xs text-gray-500 bg-gray-50 rounded-full">{date}</span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  );

  const processMessages = () => {
    const processed: Array<Message & { showAvatar: boolean; showDate?: string }> = [];
    let lastDate = '';
    let lastSenderId = 0;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp).toDateString();
      const showDate = messageDate !== lastDate;
      const showAvatar = message.senderId !== currentUserId && 
                        (message.senderId !== lastSenderId || showDate);

      if (showDate) {
        const formattedDate = messageDate === new Date().toDateString() 
          ? 'Today' 
          : messageDate === new Date(Date.now() - 86400000).toDateString()
          ? 'Yesterday'
          : new Date(message.timestamp).toLocaleDateString();
        
        processed.push({
          ...message,
          showAvatar,
          showDate: formattedDate
        });
        lastDate = messageDate;
      } else {
        processed.push({ ...message, showAvatar });
      }

      lastSenderId = message.senderId;
    });

    return processed;
  };

  const processedMessages = processMessages();

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Start the conversation!</h3>
        <p className="text-gray-500 text-sm">
          Say hello to {otherUser.name} and break the ice
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {processedMessages.map((message, index) => (
        <div key={message.id}>
          {message.showDate && <DateSeparator date={message.showDate} />}
          <MessageBubble
            message={message}
            isOwn={message.senderId === currentUserId}
            showAvatar={message.showAvatar}
          />
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
