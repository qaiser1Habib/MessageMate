import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Chat } from './types/ChatType';
import ChatArea from './components/ChatArea';
import type { Message } from './types/MessageType';
import Sidebar from './components/sidebar';
import { createChatThread, deleteChat, fetchChats, sendMessageInThread } from './quries/useChats';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const CHAT_IDS_KEY = 'chatIDs';

export default function ChatBotUI() {
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState<string>('');
  const [chatIds, setChatIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(CHAT_IDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [message, setMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isAnyNewChatCreated, setIsAnyNewChatCreated] = useState(false);
  const [messageIDToGenerateResponse, setMessageIDToGenerateResponse] = useState<string | null>(
    null
  );
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [currentActiveThread, setCurrentActiveThread] = useState<Chat | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Save chat IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_IDS_KEY, JSON.stringify(chatIds));
    } catch (error) {
      console.error('Failed to save chat IDs:', error);
    }
  }, [chatIds]);

  // Fetch chats query
  const {
    data: chatThreads = [],
    isLoading: isChatThreadsFetching,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ['chats', chatIds],
    queryFn: () => fetchChats(chatIds),
    enabled: chatIds.length > 0,
  });

  // Create chat mutation
  const createChatMutation = useMutation({
    mutationFn: createChatThread,
  });

  // Delete chat mutation
  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: (_, deletedId) => {
      setChatIds((prev) => prev.filter((id) => id !== deletedId));
      if (activeChat === deletedId) {
        const remaining = chatThreads.filter((c) => c._id !== deletedId);
        setActiveChat(remaining.length > 0 ? remaining[0]._id : '');
      }
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  // Set current active thread when activeChat changes
  useEffect(() => {
    if (chatThreads?.length && activeChat) {
      const found = chatThreads.find((chat) => chat._id === activeChat);
      setCurrentActiveThread(found || null);
    } else {
      setCurrentActiveThread(null);
    }
  }, [activeChat, chatThreads]);

  // Redirect to first chat after new chat is created
  useEffect(() => {
    if (isAnyNewChatCreated && chatThreads?.length) {
      setActiveChat(chatThreads[0]._id);
      setIsAnyNewChatCreated(false);
    }
  }, [isAnyNewChatCreated, chatThreads]);

  // Update chat messages when current thread changes
  useEffect(() => {
    if (currentActiveThread?._id && chatThreads?.length) {
      const found = chatThreads.find((chat) => chat._id === currentActiveThread._id);
      setChatMessages(found?.messages || []);
    } else {
      setChatMessages([]);
    }
  }, [chatThreads, currentActiveThread]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setIsSendingMessage(true);

      const response = await createChatMutation.mutateAsync({
        message,
        thread: currentActiveThread?.thread,
      });

      setMessage('');

      if (!currentActiveThread?._id) {
        setIsAnyNewChatCreated(true);
      }

      const lastMessage = response.messages[response.messages.length - 1];

      setChatMessages((prev) => [...prev, lastMessage]);
      setMessageIDToGenerateResponse(lastMessage._id);

      if (response._id && !chatIds.includes(response._id)) {
        setChatIds((prev) => [...prev, response._id]);
      }

      let accumulatedResponse = '';

      await sendMessageInThread(lastMessage._id, (chunk) => {
        accumulatedResponse += chunk;

        setChatMessages((prev) =>
          prev.map((msg) =>
            msg._id === lastMessage._id ? { ...msg, reply: accumulatedResponse } : msg
          )
        );
      });

      await refetchChats();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingMessage(false);
      setMessageIDToGenerateResponse(null);
    }
  };

  const handleNewChat = () => {
    setActiveChat('');
    setCurrentActiveThread(null);
    setChatMessages([]);
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Mobile: Slide-in drawer, Desktop: Always visible */}
      <div className="hidden md:block md:w-64 bg-white border-r border-gray-200 shrink-0">
        <Sidebar
          chats={chatThreads}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onDeleteChat={(id) => deleteChatMutation.mutate(id)}
          onNewChat={handleNewChat}
          isLoading={isChatThreadsFetching}
        />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <MessageSquare size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Chats</h2>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <Sidebar
              chats={chatThreads}
              activeChat={activeChat}
              setActiveChat={(id) => {
                setActiveChat(id);
                setMobileSidebarOpen(false);
              }}
              onDeleteChat={(id) => deleteChatMutation.mutate(id)}
              onNewChat={() => {
                handleNewChat();
                setMobileSidebarOpen(false);
              }}
              isLoading={isChatThreadsFetching}
            />
          </div>
        </>
      )}

      <ChatArea
        currentChat={currentActiveThread || undefined}
        chatMessages={chatMessages}
        onSendMessage={handleSendMessage}
        message={message}
        setMessage={setMessage}
        isCreatingThread={createChatMutation.isPending}
        isSendingMessage={isSendingMessage}
        messageIDToGenerateResponse={messageIDToGenerateResponse}
      />
    </div>
  );
}
