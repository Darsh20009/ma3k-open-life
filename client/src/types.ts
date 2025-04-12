export interface Message {
  id: number;
  chatId: number;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export interface Chat {
  id: number;
  title: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
}
