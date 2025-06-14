// src/components/chat/ChatPage.tsx
import React, { useState } from 'react';
import { Send, Heart, ArrowLeft, Smile, MoreVertical } from 'lucide-react';

interface ChatPageProps {
  chatRooms: any[];
  currentChatId?: number;
  currentUser: any;
  onSendMessage: (chatId: number, content: string) => Promise<void>;
  onSelectChat: (chatId: number) => void;
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({
  chatRooms, currentChatId, currentUser, onSendMessage, onSelectChat, onBack
}) => {
  const [newMessage, setNewMessage] = useState('');

  const currentChat = chatRooms.find(chat => chat.id === currentChatId);

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

  if (!currentChatId) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white p-4 shadow-sm border-b">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        
        <div className="p-4">
          {chatRooms.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No conversations yet</h3>
              <p className="text-gray-500 mb-6">Start swiping to find matches!</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm">
                  💡 Tip: Like profiles to start conversations when you match!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {chatRooms.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-green-50 transition-all cursor-pointer"
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
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800 truncate">{chat.otherUser.name}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                        {chat.lastMessage.content}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                          {chat.unreadCount}
                        </div>
                      )}
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center space-x-3 shadow-sm">
        <button 
          onClick={onBack} 
          className="text-gray-600 hover:text-green-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <img 
          src={currentChat.otherUser.avatar} 
          alt={currentChat.otherUser.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{currentChat.otherUser.name}</h3>
          <p className="text-xs text-gray-500">
            {currentChat.otherUser.isOnline ? (
              <span className="text-green-500">● Online now</span>
            ) : (
              `Last seen ${new Date(currentChat.otherUser.lastSeen).toLocaleDateString()}`
            )}
          </p>
        </div>
        <button className="text-gray-600 hover:text-green-500 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {currentChat.messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-green-500" size={24} />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">You matched with {currentChat.otherUser.name}!</h3>
            <p className="text-gray-500 text-sm">Start the conversation and say hello 👋</p>
          </div>
        ) : (
          currentChat.messages.map((message: any) => (
            <div key={message.id} className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.senderId === currentUser.id
                  ? 'bg-green-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
              }`}>
                <p className="text-sm">{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  message.senderId === currentUser.id ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-green-500 transition-colors">
            <Smile size={20} />
          </button>
          <div className="flex-1 relative">
            <textarea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none max-h-20"
              rows={1}
              style={{ minHeight: '48px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2 text-center">
          {newMessage.length}/500 characters
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
