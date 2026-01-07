import { MessageSquare, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import type { ChatType } from '../../types/ChatType';

interface SidebarProps {
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
  activeChat: string;
  setActiveChat: React.Dispatch<React.SetStateAction<string>>;
  editingChatId: string | null;
  setEditingChatId: React.Dispatch<React.SetStateAction<string | null>>;
  editingChatTitle: string;
  setEditingChatTitle: React.Dispatch<React.SetStateAction<string>>;
}
const Sidebar = ({
  chats,
  setChats,
  activeChat,
  editingChatId,
  setEditingChatId,
  editingChatTitle,
  setActiveChat,
  setEditingChatTitle,
}: SidebarProps) => {
  const createChat = () => {
    const newChat: ChatType = {
      id: Date.now().toString(),
      title: `Chat ${chats.length + 1}`,
      messages: [
        {
          id: `m${Date.now()}`,
          content: 'Hello! How can I help you?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    const filtered = chats.filter((c: ChatType) => c.id !== chatId);
    setChats(filtered);
    if (activeChat === chatId && filtered.length > 0) {
      setActiveChat(filtered[0].id);
    }
  };
  const startEditChat = (chat: ChatType) => {
    setEditingChatId(chat.id);
    setEditingChatTitle(chat.title);
  };

  const saveEditChat = () => {
    setChats(
      chats.map((c: ChatType) => (c.id === editingChatId ? { ...c, title: editingChatTitle } : c))
    );
    setEditingChatId(null);
  };
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={createChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat: ChatType) => (
          <div
            key={chat.id}
            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
              activeChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
          >
            {editingChatId === chat.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingChatTitle}
                  onChange={(e) => setEditingChatTitle(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  autoFocus
                />
                <button onClick={saveEditChat} className="text-green-600 hover:text-green-700">
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setEditingChatId(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div onClick={() => setActiveChat(chat.id)} className="flex-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" />
                    <span className="font-medium text-sm truncate">{chat.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{chat.messages.length} messages</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditChat(chat);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
