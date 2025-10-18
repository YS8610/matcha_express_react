'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { api, generateAvatarUrl } from '@/lib/api';
import { ProfileShort, ChatMessage } from '@/types';
import Image from 'next/image';
import { useWebSocket } from '@/contexts/WebSocketContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { chatMessages, onlineUsers, checkOnlineStatus } = useWebSocket();
  const [matches, setMatches] = useState<ProfileShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadMatches();
  }, [user, router]);

  useEffect(() => {
    if (matches.length > 0) {
      checkOnlineStatus(matches.map(m => m.id));
    }
  }, [matches, checkOnlineStatus]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getMatchedUsers();
      setMatches(response.data || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const getLastMessage = (userId: string): ChatMessage | null => {
    const messages = chatMessages[userId] || [];
    return messages.length > 0 ? messages[messages.length - 1] : null;
  };

  const getUnreadCount = (userId: string): number => {
    const messages = chatMessages[userId] || [];
    return messages.filter(msg => msg.fromUserId === userId).length;
  };

  const ConversationItem = ({ profile }: { profile: ProfileShort }) => {
    const photoUrl = profile.photo0
      ? api.getPhoto(profile.photo0)
      : generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id);

    const lastMessage = getLastMessage(profile.id);
    const unreadCount = getUnreadCount(profile.id);
    const isOnline = onlineUsers[profile.id] || false;

    return (
      <div
        onClick={() => router.push(`/chat/${profile.id}`)}
        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <Image
              src={photoUrl}
              alt={profile.username}
              width={56}
              height={56}
              className="object-cover"
              unoptimized
            />
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-800 truncate">
              {profile.firstName} {profile.lastName}
            </h3>
            {lastMessage && (
              <span className="text-xs text-gray-500">
                {new Date(lastMessage.timestamp).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">
            {lastMessage ? lastMessage.content : 'Start a conversation!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {unreadCount}
          </div>
        )}
      </div>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <MessageCircle className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 mb-2">No conversations yet</p>
      <p className="text-gray-400 text-sm">Match with someone to start chatting</p>
      <button
        onClick={() => router.push('/matches')}
        className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
      >
        View Matches
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
            Messages
          </h1>
          <p className="text-gray-600">Chat with your matches</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {matches.map((profile) => (
                <ConversationItem key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}