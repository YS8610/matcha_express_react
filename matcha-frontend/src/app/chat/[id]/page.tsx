'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeft, Send, Circle } from 'lucide-react';
import Link from 'next/link';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { api, generateAvatarUrl, getPhotoUrl } from '@/lib/api';
import { ProfileShort, ChatMessage as ChatMessageType } from '@/types';
import AuthImage from '@/components/AuthImage';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const chatUserId = params?.id as string;

  const { sendChatMessage, getChatHistory, onlineUsers, checkOnlineStatus, isConnected } = useWebSocket();
  const [profile, setProfile] = useState<ProfileShort | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [skipno, setSkipno] = useState(0);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.request<ProfileShort>(`/api/profile/short/${chatUserId}`);
      setProfile(response.data || null);
    } catch (err) {
      setError((err as Error).message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [chatUserId]);

  const loadChatHistoryFromAPI = useCallback(async () => {
    if (!chatUserId) return;

    setLoadingHistory(true);
    try {
      const response = await api.getChatHistory(chatUserId, 50, skipno);
      const historyMessages = response.data || [];

      if (skipno === 0) {
        const webSocketMessages = getChatHistory(chatUserId);
        const combinedMessages = [...historyMessages, ...webSocketMessages];

        const uniqueMessages = Array.from(
          new Map(
            combinedMessages.map(msg => [
              `${msg.fromUserId}-${msg.toUserId}-${msg.timestamp}-${msg.content}`,
              msg
            ])
          ).values()
        );

        uniqueMessages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(uniqueMessages);
      } else {
        setMessages(prev => [...historyMessages, ...prev]);
      }

      setHasMoreHistory(historyMessages.length === 50);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      const webSocketMessages = getChatHistory(chatUserId);
      setMessages(webSocketMessages);
    } finally {
      setLoadingHistory(false);
    }
  }, [chatUserId, skipno, getChatHistory]);

  useEffect(() => {
    if (chatUserId) {
      loadProfile();
      checkOnlineStatus([chatUserId]);
      loadChatHistoryFromAPI();
    }
  }, [chatUserId, loadProfile, checkOnlineStatus, loadChatHistoryFromAPI]);

  useEffect(() => {
    if (chatUserId) {
      const webSocketMessages = getChatHistory(chatUserId);
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => `${m.fromUserId}-${m.toUserId}-${m.timestamp}-${m.content}`));
        const newMessages = webSocketMessages.filter(
          m => !existingIds.has(`${m.fromUserId}-${m.toUserId}-${m.timestamp}-${m.content}`)
        );

        if (newMessages.length > 0) {
          return [...prev, ...newMessages].sort((a, b) => a.timestamp - b.timestamp);
        }
        return prev;
      });
    }
  }, [chatUserId, getChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user || !chatUserId) return;

    sendChatMessage(chatUserId, messageText.trim());

    const newMessage: ChatMessageType = {
      fromUserId: user.id,
      toUserId: chatUserId,
      content: messageText.trim(),
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  if (authLoading || loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent"></div>
        <p className="mt-4 text-green-700 dark:text-green-300">Loading...</p>
      </div>
    </div>
  );

  if (!user || !profile) return null;

  const photoUrl = profile.photo0
    ? getPhotoUrl(profile.photo0)
    : generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id);

  const isOnline = onlineUsers[chatUserId] || false;

  return (
    <div className="container mx-auto px-4 py-4 h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="mb-4">
          <Link
            href="/messages"
            className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Messages
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 border border-green-100 dark:border-green-900">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <AuthImage
                    src={photoUrl}
                    alt={profile.username}
                    width={48}
                    height={48}
                    className="object-cover"
                    unoptimized
                    fallbackSrc={generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id)}
                  />
                </div>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Circle className={`w-2 h-2 ${isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 dark:fill-gray-500 text-gray-400 dark:text-gray-500'}`} />
                  {isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
              {profile?.connectionStatus?.matched ? (
                <div className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
                  ❤️ Matched
                </div>
              ) : !isConnected ? (
                <div className="text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950 px-3 py-1 rounded-full">
                  Connecting...
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-green-100 dark:border-green-900 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <>
                {hasMoreHistory && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setSkipno(prev => prev + 50);
                        loadChatHistoryFromAPI();
                      }}
                      disabled={loadingHistory}
                      className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingHistory ? 'Loading older messages...' : 'Load Older Messages'}
                    </button>
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isFromMe = msg.fromUserId === user.id;
                  return (
                    <div
                      key={idx}
                      className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isFromMe
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isFromMe ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-gray-100 dark:border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!messageText.trim() || !isConnected}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}