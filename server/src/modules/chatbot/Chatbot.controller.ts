import { FastifyReply } from 'fastify';

import { AskRequest } from '@/modules/chatbot/Chatbot.interface';
import { ChatbotService } from '@/modules/chatbot/Chatbot.service';

export const ask = async (request: AskRequest, reply: FastifyReply) => {
  try {
    const { input } = request.body;

    const result = await ChatbotService.invoke({
      input,
      userId: request.user._id.toString(),
      sessionId: '123', //TODO: change to a random string
    });

    reply.send({ output: result.output });
  } catch (error) {
    console.error('Error in chatbot controller:', error);
    reply.status(500).send({ error: 'Failed to get response' });
  }
};

export const ChatbotController = { ask };
