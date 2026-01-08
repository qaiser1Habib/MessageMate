import ScrollToBottom from 'react-scroll-to-bottom';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2 } from 'lucide-react';
import type { Chat } from '../../types/ChatType';
import type { Message } from '../../types/MessageType';

interface ChatAreaProps {
  currentChat: Chat | undefined;
  chatMessages: Message[];
  onSendMessage: (e: React.FormEvent) => void;
  message: string;
  setMessage: (msg: string) => void;
  isCreatingThread: boolean;
  isSendingMessage: boolean;
  messageIDToGenerateResponse: string | null;
}

interface ChatFormProps {
  onSendMessage: (e: React.FormEvent) => void;
  message: string;
  setMessage: (msg: string) => void;
  isSendingMessage: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  currentChat,
  chatMessages,
  isCreatingThread,
  messageIDToGenerateResponse,
  onSendMessage,
  message,
  setMessage,
  isSendingMessage,
}) => {
  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      {currentChat && chatMessages.length > 0 ? (
        <>
          <div className="bg-white border-b border-gray-200 p-3 md:p-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
              {currentChat.title?.replace(/"/g, '') || 'New Chat'}
            </h2>
          </div>

          <ScrollToBottom className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg._id} className="w-full space-y-3 md:space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[85%] md:max-w-2xl py-2 px-3 md:px-4 bg-blue-600 text-white rounded-t-xl rounded-bl-xl">
                    <h3 className="text-xs md:text-sm font-bold mb-1">You</h3>
                    <p className="text-xs md:text-sm warp-break-word">{msg.message}</p>
                    <time className="text-xs opacity-75 mt-1 block">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>

                <div className="flex">
                  <div className="max-w-[85%] md:max-w-2xl py-2 px-3 md:px-4 bg-gray-100 border border-gray-200 rounded-t-xl rounded-br-xl">
                    <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1">Assistant</h3>

                    {msg.reply ? (
                      <div className="prose max-w-full text-xs md:text-sm wrap-break-word">
                        <ReactMarkdown>{msg.reply}</ReactMarkdown>
                      </div>
                    ) : isSendingMessage && messageIDToGenerateResponse === msg._id ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-2 bg-gray-300 rounded w-full" />
                        <div className="h-2 bg-gray-300 rounded w-2/3" />
                        <div className="h-2 bg-gray-300 rounded w-1/2" />
                      </div>
                    ) : null}

                    <time className="text-xs text-gray-500 mt-1 block">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </ScrollToBottom>

          <div className="bg-white border-t border-gray-200 p-3 md:p-4">
            {isCreatingThread ? (
              <div className="py-2 md:py-3 px-3 md:px-4 bg-white border border-gray-300 flex items-center gap-2 rounded-xl">
                <Loader2 className="animate-spin text-blue-600" size={18} />
                <p className="text-xs md:text-sm text-blue-600">Creating Chat...</p>
              </div>
            ) : (
              <ChatForm
                onSendMessage={onSendMessage}
                message={message}
                setMessage={setMessage}
                isSendingMessage={isSendingMessage}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
          <h4 className="text-2xl md:text-4xl font-medium mb-2">Hi there</h4>
          <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">
            Use a quick prompt or type your own message to start
          </p>
          <div className="w-full md:w-2xl">
            <ChatForm
              onSendMessage={onSendMessage}
              message={message}
              setMessage={setMessage}
              isSendingMessage={isSendingMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ChatForm = ({ onSendMessage, message, setMessage, isSendingMessage }: ChatFormProps) => {
  return (
    <form onSubmit={onSendMessage} className="w-full flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isSendingMessage}
        className="flex-1 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isSendingMessage || !message?.trim()}
        className="px-4 py-2 md:px-6 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSendingMessage ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        <span className="hidden sm:inline text-sm md:text-base">Send</span>
      </button>
    </form>
  );
};

export default ChatArea;
