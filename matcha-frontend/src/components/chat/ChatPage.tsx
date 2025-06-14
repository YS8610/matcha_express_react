// src/components/chat/ChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, Heart, Image, Phone, Video } from 'lucide-react';
import Header from '../common/Header';
import MessageList from './MessageList';
import { Message, ChatRoom } from '../types/message';

interface ChatPageProps {
  chatRooms: ChatRoom[];
  currentChatId?: number;
  currentUser: any;
  onSendMessage: (chatId: number, message: string) => Promise<void>;
  onSelectChat: (chatId: number) => void;
  onBack?: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({
  chatRooms,
  currentChatId,
  currentUser,
  onSendMessage,
  onSelectChat,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const currentChat = chatRooms.find(chat => chat.id === currentChatId);

  useEffect(() => {
    if (currentChatId && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [currentChatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChatId) return;

    try {
      await onSendMessage(currentChatId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  if (!currentChatId) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Messages" currentUser={currentUser} />
        
        <div className="p-4">
          {chatRooms.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No conversations yet</h3>
              <p className="text-gray-500">Start swiping to find matches and begin chatting!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chatRooms.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={chat.otherUser.avatar}
                        alt={chat.otherUser.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {chat.otherUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800">{chat.otherUser.name}</h3>
                        <span className="text-xs text-gray-500">{chat.lastMessage.timestamp}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </p>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">
                          {chat.otherUser.isOnline ? 'Online' : `Last seen ${chat.otherUser.lastSeen}`}
                        </span>
                        {chat.unreadCount > 0 && (
                          <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <p className="text-gray-500">Chat not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-gray-600">
              ←
            </button>
            <img
              src={currentChat.otherUser.avatar}
              alt={currentChat.otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{currentChat.otherUser.name}</h3>
              <p className="text-xs text-gray-500">
                {currentChat.otherUser.isOnline ? 'Online' : `Last seen ${currentChat.otherUser.lastSeen}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="text-gray-600 hover:text-pink-500">
              <Phone size={20} />
            </button>
            <button className="text-gray-600 hover:text-pink-500">
              <Video size={20} />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={currentChat.messages}
          currentUserId={currentUser.id}
          otherUser={currentChat.otherUser}
        />
      </div>

      {currentChat.otherUser.isTyping && (
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center space-x-2">
            <img
              src={currentChat.otherUser.avatar}
              alt={currentChat.otherUser.name}
              className="w-6 h-6 rounded-full"
            />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 hover:text-pink-500">
            <Image size={24} />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={messageInputRef}
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              maxLength={500}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {newMessage.length}/500
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
