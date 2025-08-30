'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Leaf, MessageCircle } from 'lucide-react';

interface ChatProps {
  userId: string;
}

export default function Chat({ userId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await api.getMessages(userId);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await api.sendMessage(userId, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[600px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-green-700">Loading conversation...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-green-100">
      <div className="p-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-green-100/50">
        <h2 className="font-semibold text-green-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          Chat with {userId}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-transparent to-green-50/20">
        {messages.length === 0 ? (
          <div className="text-center text-green-600 py-8">
            <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3 animate-pulse" />
            No messages yet. Start brewing a conversation!
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.fromUserId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.fromUserId === user?.id
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
                    : 'bg-white border border-green-200 text-green-800 shadow-sm'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.fromUserId === user?.id ? 'text-white' : 'text-green-600'
                }`}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-green-200 bg-green-50/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-green-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white/80"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 font-medium transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}