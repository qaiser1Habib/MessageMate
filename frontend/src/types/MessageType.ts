export interface Message {
    _id: string;
    message: string;
    reply: string | null;
    createdAt?: string;
}