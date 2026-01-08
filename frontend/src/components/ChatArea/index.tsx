import { Loader2, MessageSquare, Send } from 'lucide-react';
import type { ChatType } from '../../types/ChatType';
import React, { useState } from 'react';

interface ChatAreaProps {
  currentChat: ChatType | undefined;
  onSendMessage: (content: string) => void;
  isSending: boolean;
  streamingResponse: string;
}
const ChatArea: React.FC<ChatAreaProps> = ({
  currentChat,
  onSendMessage,
  isSending,
  streamingResponse,
}) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col">
      {currentChat ? (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentChat.title || 'New Chat'}
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChat.messages.map((msg, idx) => (
              <React.Fragment key={msg._id}>
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="group relative max-w-xl ml-12">
                    <div className="rounded-lg px-4 py-2 bg-blue-600 text-white">
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs mt-1 text-blue-100">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bot Reply */}
                {(msg.reply || (idx === currentChat.messages.length - 1 && streamingResponse)) && (
                  <div className="flex justify-start">
                    <div className="group relative max-w-xl mr-12">
                      <div className="rounded-lg px-4 py-2 bg-white border border-gray-200 text-gray-800">
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.reply || streamingResponse}
                          {idx === currentChat.messages.length - 1 && isSending && !msg.reply && (
                            <span className="inline-block ml-1 w-2 h-4 bg-gray-400 animate-pulse" />
                          )}
                        </p>
                        {msg.reply && (
                          <p className="text-xs mt-1 text-gray-400">
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSend()}
                placeholder="Type your message..."
                disabled={isSending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isSending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
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
