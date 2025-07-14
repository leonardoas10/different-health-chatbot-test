import { HttpService } from './Http.service';

export interface ChatbotRequest {
  input: string;
  sessionId: string;
  userId: string;
}

export interface ChatbotResponse {
  output: string;
}

export class ChatbotService {
  private static readonly BASE_URL = '/v1/chatbot';

  static async sendMessage(data: ChatbotRequest): Promise<string> {
    try {
      const response = await HttpService.post<ChatbotResponse>(
        `${this.BASE_URL}/chat`,
        data
      );
      return response.output;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw new Error('Failed to send message');
    }
  }
}