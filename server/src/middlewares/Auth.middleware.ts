import jwt from 'jsonwebtoken';

export const AuthMiddleware = async (request, reply) => {
  const { authorization } = request.headers;

  // if (!authorization) {
  //   reply.code(401).send({ message: 'Unauthorized', isKO: true });
  //   return;
  // }

  const [, token] = authorization?.split(' ') || [];

  try {
    // For development purposes, create a mock user
    // TODO: Replace with actual JWT verification
    request.user = {
      _id: '66955bbf8b55fd3b498af3ad', // Mock user ID from examples
      email: 'test@example.com'
    };

    return;
  } catch (error) {
    reply.code(401).send({ message: 'Unauthorized' });
  }
};
