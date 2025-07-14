export interface ChatbotMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatbotGadgetProps {
  onSendMessage: (message: string) => Promise<string>;
}