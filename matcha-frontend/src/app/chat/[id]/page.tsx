'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Send, Heart } from 'lucide-react';
import Link from 'next/link';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/lib/api';
import { ProfileShort, ChatMessage as ChatMessageType } from '@/types';
import { sanitizeInput } from '@/lib/security';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const chatUserId = params?.id as string;

  const { sendChatMessage, getChatHistory, onlineUsers, checkOnlineStatus, isConnected, chatMessages } = useWebSocket();
  const [profile, setProfile] = useState<ProfileShort | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [skipno, setSkipno] = useState(0);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isUserAtBottomRef = useRef(true);
  const hasLoadedInitialHistoryRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/login');
    } else if (!user.profileComplete) {
      router.replace('/profile/setup');
    }
  }, [user, authLoading, router]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getShortProfile(chatUserId);
      setProfile(response || null);
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [chatUserId]);

  const loadChatHistoryFromAPI = useCallback(async () => {
    if (!chatUserId || isBlocked) return;

    setLoadingHistory(true);
    setError('');

    try {
      const response = await api.getChatHistory(chatUserId, 50, skipno);
      const historyMessages: ChatMessageType[] = Array.isArray(response)
        ? response
        : (response as any).data?.data || (response as any).data || [];

      if (skipno === 0) {
        const webSocketMessages = getChatHistory(chatUserId);

        const combinedMessages: ChatMessageType[] = [...historyMessages, ...webSocketMessages];

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
      const errorMsg = err instanceof Error ? err.message : 'Failed to load chat history';
      if (!errorMsg.includes('blocked') && !errorMsg.includes('blocking')) {
        setError(errorMsg);
        addToast('Could not load chat history. Showing recent messages.', 'warning', 3000);
      }

      if (skipno === 0) {
        const webSocketMessages = getChatHistory(chatUserId);
        setMessages(webSocketMessages);
      }
    } finally {
      setLoadingHistory(false);
    }
  }, [chatUserId, skipno, getChatHistory, addToast, isBlocked]);

  useEffect(() => {
    if (!chatUserId || hasLoadedInitialHistoryRef.current === chatUserId) {
      return;
    }

    hasLoadedInitialHistoryRef.current = chatUserId;
    setMessages([]);
    setSkipno(0);

    (async () => {
      let profileBlocked = false;

      try {
        setLoading(true);
        setError('');
        setIsBlocked(false);
        const response = await api.getShortProfile(chatUserId);
        setProfile(response || null);
      } catch (err) {
        setProfile(null);
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (errorMsg.includes('blocked') || errorMsg.includes('blocking')) {
          profileBlocked = true;
          setIsBlocked(true);
          setError('This conversation is no longer available. You have been blocked or you have blocked this user.');
        } else {
          setError('Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }

      if (!profileBlocked) {
        checkOnlineStatus([chatUserId]);
        setLoadingHistory(true);

        try {
          const response = await api.getChatHistory(chatUserId, 50, 0);
          const historyMessages: ChatMessageType[] = Array.isArray(response)
            ? response
            : (response as any).data?.data || (response as any).data || [];

          const webSocketMessages = getChatHistory(chatUserId);
          const combinedMessages: ChatMessageType[] = [...historyMessages, ...webSocketMessages];

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
          setHasMoreHistory(historyMessages.length === 50);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Failed to load chat history';
          if (!errorMsg.includes('blocked') && !errorMsg.includes('blocking')) {
            addToast('Could not load chat history. Showing recent messages.', 'warning', 3000);
          }

          const webSocketMessages = getChatHistory(chatUserId);
          setMessages(webSocketMessages);
        } finally {
          setLoadingHistory(false);
        }
      }
    })();
  }, [chatUserId, checkOnlineStatus, getChatHistory, addToast]);

  const allMessages = useMemo(() => {
    const combined: ChatMessageType[] = [];
    const seen = new Set<string>();

    messages.forEach(m => {
      const key = `${m.timestamp}-${m.content}-${m.fromUserId}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(m);
      }
    });

    const wsMessages = chatMessages[chatUserId] || [];
    wsMessages.forEach(m => {
      const key = `${m.timestamp}-${m.content}-${m.fromUserId}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(m);
      }
    });

    return combined.sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, chatMessages, chatUserId]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      isUserAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isUserAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    isUserAtBottomRef.current = true;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !user || !chatUserId) return;

    sendChatMessage(chatUserId, messageText.trim());
    setMessageText('');
  };

  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : 'Loading...';
  const displayUsername = profile?.username || chatUserId;

  const isOnline = onlineUsers[chatUserId] || false;

  if (authLoading || !user || !user.profileComplete) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4 min-h-[calc(100vh-160px)]">
      <div className="max-w-4xl mx-auto flex flex-col">
        <div className="mb-4">
          <Link
            href="/messages"
            className="btn-secondary inline-flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Messages
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 border border-green-100 dark:border-green-900">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {displayUsername.charAt(0).toUpperCase()}
                  </span>
                </div>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                      {displayName}
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        @{displayUsername}
                      </div>
                      {isOnline && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          • Online
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
              {profile?.connectionStatus?.matched ? (
                <div className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-current" />
                  Matched
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

        {isBlocked ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-red-300 dark:border-red-700 overflow-hidden flex flex-col p-8">
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Conversation Unavailable
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This conversation is no longer available. You have been blocked or you have blocked this user.
              </p>
              <Link
                href="/messages"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Messages
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-green-100 dark:border-green-900 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 380px)' }}>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            {loadingHistory && allMessages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mb-3"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading chat history...</p>
              </div>
            ) : allMessages.length === 0 ? (
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
                {allMessages.map((msg) => {
                  const isFromMe = msg.fromUserId === user?.id;
                  return (
                    <div
                      key={`${msg.timestamp}-${msg.fromUserId}-${msg.content.substring(0, 50)}`}
                      className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${isFromMe
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                          }`}
                      >
                        <p className="break-words">{sanitizeInput(msg.content, 5000)}</p>
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
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={5000}
                    className={`w-full px-4 py-3 pr-16 border rounded-2xl focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition-all ${
                      messageText.length > 4500
                        ? 'border-red-400 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-500'
                        : messageText.length > 4000
                        ? 'border-yellow-400 dark:border-yellow-500 focus:ring-yellow-400 dark:focus:ring-yellow-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400'
                    }`}
                    disabled={!isConnected}
                  />
                  {messageText.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className={`text-xs font-medium transition-colors ${
                        messageText.length > 4500
                          ? 'text-red-600 dark:text-red-400'
                          : messageText.length > 4000
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {messageText.length}/5000
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim() || !isConnected}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  title={!isConnected ? 'Connecting...' : 'Send message'}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {messageText.length > 4000 && (
                <div className="px-2">
                  <div className="relative h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
                        messageText.length > 4500
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      }`}
                      style={{ width: `${(messageText.length / 5000) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 text-center font-medium ${
                    messageText.length > 4500
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {messageText.length > 4800 ? 'Character limit almost reached' : 'Approaching character limit'}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
}
