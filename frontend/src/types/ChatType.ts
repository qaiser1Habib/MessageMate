import type { Message } from "./MessageType";


export interface Chat {
    _id: string;
    title: string;
    thread: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
}