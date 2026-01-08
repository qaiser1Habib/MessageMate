import { MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react';
import type { Chat } from '../../types/ChatType';

interface SidebarProps {
  chats: Chat[];
  activeChat: string;
  setActiveChat: (id: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  setActiveChat,
  onDeleteChat,
  onNewChat,
  isLoading,
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-3 md:p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
        >
          <Plus size={18} className="md:w-5 md:h-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                activeChat === chat._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div onClick={() => setActiveChat(chat._id)} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-gray-400 shrink-0" />
                    <span className="font-medium text-xs md:text-sm truncate">
                      {chat.title?.replace(/"/g, '') || 'New Chat'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{chat.messages.length} messages</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat._id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Sidebar;
