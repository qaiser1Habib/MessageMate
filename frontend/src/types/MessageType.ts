
export interface MessageType {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}