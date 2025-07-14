import { FastifyInstance, FastifyReply } from 'fastify';

import { AuthMiddleware } from '@/middlewares/Auth.middleware';
import { CHATBOT_ROUTE_PREFIX } from '@/modules/chatbot/Chatbot.config';
import { ChatbotController } from '@/modules/chatbot/Chatbot.controller';
import { AskRequest } from '@/modules/chatbot/Chatbot.interface';

export default function ChatbotRoute(fastify: FastifyInstance, options: any, done: (err?: Error) => void) {
  fastify.post(
    `${CHATBOT_ROUTE_PREFIX}/chat`,
    {
      preHandler: [AuthMiddleware],
    },
    async (request: AskRequest, reply: FastifyReply) => {
      return await ChatbotController.ask(request, reply);
    },
  );

  done();
}
