import { Loader2, MessageSquare, Plus, Trash2 } from 'lucide-react';
import type { ChatType } from '../../types/ChatType';

interface SidebarProps {
  chats: ChatType[];
  activeChat: string;
  setActiveChat: (id: string) => void;
  onDeleteChat: (chatId: string) => void;
  onCreateChat: () => void;
  isCreating: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  setActiveChat,
  onDeleteChat,
  onCreateChat,
  isCreating,
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onCreateChat}
          disabled={isCreating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
              activeChat === chat._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div onClick={() => setActiveChat(chat._id)} className="flex-1">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-gray-400" />
                  <span className="font-medium text-sm truncate">{chat.title || 'New Chat'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{chat.messages.length} messages</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat._id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
