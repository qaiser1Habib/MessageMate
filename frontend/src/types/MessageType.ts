
export interface MessageType {
    _id: string;
    message: string;
    reply: string | null;
    createdAt?: Date;
}