import { MessageSquare, Trash2, Edit2, Send } from 'lucide-react';
import type { ChatType } from '../../types/ChatType';
import type { MessageType } from '../../types/MessageType';

interface ChatAreaProps {
  chats: ChatType[];
  setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
  activeChat: string;
  currentChat: ChatType | undefined;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  editingMessageId: string | null;
  setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  editingMessageContent: string;
  setEditingMessageContent: React.Dispatch<React.SetStateAction<string>>;
}

const ChatArea = ({
  chats,
  setChats,
  activeChat,
  currentChat,
  input,
  setInput,
  editingMessageId,
  setEditingMessageId,
  editingMessageContent,
  setEditingMessageContent,
}: ChatAreaProps) => {
  const sendMessage = () => {
    if (!input.trim() || !currentChat) return;

    const userMsg: MessageType = {
      id: `m${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    const botMsg: MessageType = {
      id: `m${Date.now() + 1}`,
      content: 'Thanks for your message! This is a simulated response.',
      sender: 'bot',
      timestamp: new Date(),
    };

    setChats(
      chats.map((c) =>
        c.id === activeChat ? { ...c, messages: [...c.messages, userMsg, botMsg] } : c
      )
    );
    setInput('');
  };

  const deleteMessage = (messageId: string) => {
    setChats(
      chats.map((c) =>
        c.id === activeChat ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c
      )
    );
  };

  const startEditMessage = (message: MessageType) => {
    setEditingMessageId(message.id);
    setEditingMessageContent(message.content);
  };

  const saveEditMessage = () => {
    setChats(
      chats.map((c) =>
        c.id === activeChat
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === editingMessageId ? { ...m, content: editingMessageContent } : m
              ),
            }
          : c
      )
    );
    setEditingMessageId(null);
  };
  return (
    <div className="flex-1 flex flex-col">
      {currentChat ? (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800">{currentChat.title}</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`group relative max-w-xl ${msg.sender === 'user' ? 'ml-12' : 'mr-12'}`}
                >
                  {editingMessageId === msg.id ? (
                    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm">
                      <textarea
                        value={editingMessageContent}
                        onChange={(e) => setEditingMessageContent(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={saveEditMessage}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="px-3 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}
                        >
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="absolute -top-2 right-0 hidden group-hover:flex gap-1">
                        <button
                          onClick={() => startEditMessage(msg)}
                          className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
                        >
                          <Edit2 size={12} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-red-50"
                        >
                          <Trash2 size={12} className="text-red-600" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Send size={18} />
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select a chat or create a new one</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
