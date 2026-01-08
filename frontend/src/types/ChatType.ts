import type { MessageType } from "./MessageType";

export interface ChatType {
    _id: string;
    title: string;
    thread: string;
    messages: MessageType[];
    createdAt: Date;
    updatedAt: Date;
}