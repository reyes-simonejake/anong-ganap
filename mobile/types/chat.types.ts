export interface ChatMessage {
    id: number;
    type: 'user' | 'ai';
    text: string;
}

export type QuickSuggestion = string;
