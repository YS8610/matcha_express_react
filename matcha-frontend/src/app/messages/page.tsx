'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { Alert } from '@/components/ui';
import { api, generateAvatarUrl } from '@/lib/api';
import { ProfileShort, ChatMessage } from '@/types';
import AuthImage from '@/components/AuthImage';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useProfilePhoto } from '@/hooks/useProfilePhoto';

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { chatMessages, onlineUsers, checkOnlineStatus } = useWebSocket();
  const [matches, setMatches] = useState<ProfileShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!user.profileComplete) {
      router.replace('/profile/setup');
      return;
    }

    loadMatches();
  }, [user, authLoading, router]);

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
    const photoUrl = useProfilePhoto(
      profile.photo0,
      profile.firstName + ' ' + profile.lastName,
      profile.id
    );

    const lastMessage = getLastMessage(profile.id);
    const unreadCount = getUnreadCount(profile.id);
    const isOnline = onlineUsers[profile.id] || false;

    return (
      <div
        onClick={() => router.push(`/chat/${profile.id}`)}
        className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <AuthImage
              src={photoUrl}
              alt={profile.username}
              width={56}
              height={56}
              className="object-cover"
              unoptimized
              priority
              fallbackSrc={generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id)}
            />
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
              {profile.firstName} {profile.lastName}
            </h3>
            {lastMessage && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(lastMessage.timestamp).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
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

  if (authLoading || !user || !user.profileComplete) {
    return null;
  }

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
          <p className="text-gray-600 dark:text-gray-400">Chat with your matches</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-100 dark:border-green-900">
          {loading ? (
            <LoadingSkeleton count={5} type="list" />
          ) : matches.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {matches.map((profile) => (
                <ConversationItem key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
              title="No conversations yet"
              description="Match with someone to start chatting"
              action={{
                label: "Browse Profiles",
                onClick: () => router.push('/browse')
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
