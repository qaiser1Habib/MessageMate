import { useState } from 'react';
import Sidebar from './components/sidebar';
import ChatArea from './components/ChatArea';
import type { ChatType } from './types/ChatType';

export default function ChatBotUI() {
  const [chats, setChats] = useState<ChatType[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      messages: [
        {
          id: 'm1',
          content: 'Hello! How can I help you today?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ]);
  const [activeChat, setActiveChat] = useState<string>('1');
  const [input, setInput] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState('');

  const currentChat = chats.find((c) => c.id === activeChat);

  return (
    <main className="flex h-screen bg-gray-100">
      <Sidebar
        chats={chats}
        setChats={setChats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        editingChatId={editingChatId}
        setEditingChatId={setEditingChatId}
        editingChatTitle={editingChatTitle}
        setEditingChatTitle={setEditingChatTitle}
      />

      <ChatArea
        chats={chats}
        setChats={setChats}
        activeChat={activeChat}
        currentChat={currentChat}
        input={input}
        setInput={setInput}
        editingMessageId={editingMessageId}
        setEditingMessageId={setEditingMessageId}
        editingMessageContent={editingMessageContent}
        setEditingMessageContent={setEditingMessageContent}
      />
    </main>
  );
}
