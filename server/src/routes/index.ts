import { FastifyInstance } from 'fastify';

import ChatbotRoute from '../modules/chatbot/Chatbot.route';
import AuthRoute from '../modules/auth/Auth.route';

async function routes(fastify: FastifyInstance) {
  fastify.register(ChatbotRoute);
  fastify.register(AuthRoute);

  fastify.setErrorHandler((error, request, reply) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'File too large. Maximum allowed size is 5MB.',
      });
    }

    if (error.code === 'FILE_TYPE_NOT_ALLOWED') {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.message,
      });
    }

    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: error.message || 'Something went wrong',
    });
  });
}

export default routes;
