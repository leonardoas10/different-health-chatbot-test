import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test';

export const AuthMiddleware = async (request, reply) => {
  const { authorization } = request.headers;

  if (!authorization) {
    reply.code(401).send({ message: 'Token requerido', isKO: true });
    return;
  }

  const [, token] = authorization.split(' ') || [];

  if (!token) {
    reply.code(401).send({ message: 'Token inválido', isKO: true });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    request.user = decoded;
    return;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    reply.code(401).send({ message: 'Token expirado o inválido', isKO: true });
  }
};
