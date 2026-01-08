import { API_BASE_URL } from '../App';
import type { Chat } from '../types/ChatType';

interface ApiResponse<T> {
  httpCode: number;
  status: boolean;
  message: string;
  payload: T;
}

export const fetchChats = async (chatIds: string[]): Promise<Chat[]> => {
  if (!chatIds.length) return [];
  const response = await fetch(`${API_BASE_URL}?chatIds=${JSON.stringify(chatIds)}`);
  const data: ApiResponse<Chat[]> = await response.json();
  if (!data.status) throw new Error(data.message);
  return data.payload;
};

export const createChatThread = async (payload: {
  message: string;
  thread?: string;
}): Promise<Chat> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<Chat> = await response.json();
  if (data.httpCode !== 200) throw new Error(data.message);
  return data.payload;
};

export const deleteChat = async (chatId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}?chatID=${chatId}`, {
    method: 'DELETE',
  });
  const data: ApiResponse<Chat> = await response.json();
  if (!data.status) throw new Error(data.message);
};

export const sendMessageInThread = async (
  messageID: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageID }),
  });

  if (!response.ok || !response.body) {
    throw new Error('Streaming failed');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
};
