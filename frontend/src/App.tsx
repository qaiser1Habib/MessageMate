import { useEffect, useState } from 'react';
import Sidebar from './components/sidebar';
import ChatArea from './components/ChatArea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createChat, deleteChat, fetchChats, sendMessageInThread } from './quries/useChats';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const CHAT_IDS_KEY = 'chatbot_chat_ids';

export default function ChatBotUI() {
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState<string>('');
  const [chatIds, setChatIds] = useState<string[]>(() => {
    // Load chat IDs from localStorage on initial render
    try {
      const stored = localStorage.getItem(CHAT_IDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Save chat IDs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_IDS_KEY, JSON.stringify(chatIds));
    } catch (error) {
      console.error('Failed to save chat IDs to localStorage:', error);
    }
  }, [chatIds]);

  // Fetch chats query
  const { data: chats = [] } = useQuery({
    queryKey: ['chats', chatIds],
    queryFn: () => fetchChats(chatIds),
    enabled: chatIds.length > 0,
  });

  // Set active chat to the first chat when chats are loaded
  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0]._id);
    }
  }, [chats, activeChat]);

  // Create chat mutation
  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: (newChat) => {
      // Add new chat ID to the list and save to localStorage
      setChatIds((prev) => {
        const updated = [...prev, newChat._id];
        return updated;
      });
      setActiveChat(newChat._id);
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  // Delete chat mutation
  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: (_, deletedId) => {
      // Remove chat ID from list and update localStorage
      setChatIds((prev) => {
        const updated = prev.filter((id) => id !== deletedId);
        return updated;
      });

      // Update active chat if the deleted one was active
      if (activeChat === deletedId) {
        const remainingChats = chats.filter((c) => c._id !== deletedId);
        setActiveChat(remainingChats.length > 0 ? remainingChats[0]._id : '');
      }

      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  const handleCreateChat = () => {
    createChatMutation.mutate('Hello! I need assistance.');
  };

  const handleSendMessage = async (content: string) => {
    const currentChat = chats.find((c) => c._id === activeChat);
    if (!currentChat) return;

    setIsSending(true);
    setStreamingResponse('');

    try {
      // Add message to thread
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          thread: currentChat.thread,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      // Get the messageID from the last message
      const messageID = data.data.messages[data.data.messages.length - 1]._id;

      // Stream the response
      const stream = await sendMessageInThread(messageID);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        setStreamingResponse(accumulatedResponse);
      }

      // Refresh chats after streaming completes
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
      setStreamingResponse('');
    }
  };

  const currentChat = chats.find((c) => c._id === activeChat);

  return (
    <main className="flex h-screen bg-gray-100">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onDeleteChat={(id) => deleteChatMutation.mutate(id)}
        onCreateChat={handleCreateChat}
        isCreating={createChatMutation.isPending}
      />

      <ChatArea
        currentChat={currentChat}
        onSendMessage={handleSendMessage}
        isSending={isSending}
        streamingResponse={streamingResponse}
      />
    </main>
  );
}
