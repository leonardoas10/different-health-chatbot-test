import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test';

export interface User {
  _id: string;
  email: string;
  name: string;
}

export class AuthController {
  static async mockLogin(request: FastifyRequest, reply: FastifyReply) {
    const mockUser: User = {
      _id: '66955bbf8b55fd3b498af3ad',
      email: 'test@example.com',
      name: 'Joe'
    };

    const token = jwt.sign(mockUser, JWT_SECRET, { expiresIn: '24h' });

    reply.send({
      user: mockUser,
      token,
      isKO: false
    });
  }
}