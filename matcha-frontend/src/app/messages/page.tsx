'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Conversation } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { generateAvatarUrl } from '@/utils/avatar';
import { MessageCircle, Leaf, Clock } from 'lucide-react';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadConversations();
  }, [user, router]);

  const loadConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-green-700">Loading your conversations...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-full">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Messages</h1>
      </div>
      
      {conversations.length === 0 ? (
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 text-center border border-green-100">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <p className="text-green-700 text-lg font-medium">No conversations yet</p>
          <p className="text-sm text-green-600 mt-2">
            Start brewing connections to begin chatting!
          </p>
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl divide-y divide-green-100 border border-green-100 overflow-hidden">
          {conversations.map(conversation => (
            <a
              key={conversation.userId}
              href={`/chat/${conversation.userId}`}
              className="block p-5 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={conversation.profilePhoto || generateAvatarUrl(conversation.username, conversation.userId)}
                    alt={conversation.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-green-800">{conversation.username || 'Unknown User'}</h3>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-green-500 to-green-400 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-green-600 truncate flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}