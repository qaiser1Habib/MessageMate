import { API_BASE_URL } from "../App";
import type { ChatType } from "../types/ChatType";


interface ApiResponse<T> {
    httpCode: number;
    status: boolean;
    message: string;
    payload: T;
}

// API Functions
export const fetchChats = async (chatIds: string[]): Promise<ChatType[]> => {
    if (!chatIds.length) return [];
    const response = await fetch(`${API_BASE_URL}?chatIds=${JSON.stringify(chatIds)}`);
    const data: ApiResponse<ChatType[]> = await response.json();
    if (!data.status) throw new Error(data.message);
    return data.payload;
};

export const createChat = async (message: string): Promise<ChatType> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });
    const data: ApiResponse<ChatType> = await response.json();
    if (!data.status) throw new Error(data.message);
    return data.payload;
};

export const deleteChat = async (chatId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}?chatID=${chatId}`, {
        method: 'DELETE',
    });
    const data: ApiResponse<ChatType> = await response.json();
    if (!data.status) throw new Error(data.message);
};

export const sendMessageInThread = async (messageID: string): Promise<ReadableStream> => {
    const response = await fetch(`${API_BASE_URL}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageID }),
    });

    if (!response.ok) throw new Error('Failed to send message');
    return response.body!;
};

