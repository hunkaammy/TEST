
export type Role = 'user' | 'bot';

export interface ChatMessage {
  role: Role;
  text: string;
}
