import type { MessageType } from "./MessageType";

export interface ChatType {
    id: string;
    title: string;
    messages: MessageType[];
    createdAt: Date;
}