import { FastifyInstance } from 'fastify';
import { AuthController } from './Auth.controller';

export default function AuthRoute(fastify: FastifyInstance, options: any, done: (err?: Error) => void) {
  fastify.get('/auth/mock-login', async (request, reply) => {
    return await AuthController.mockLogin(request, reply);
  });

  done();
}