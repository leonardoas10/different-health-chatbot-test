import { AuthRequest } from '../../interfaces/AuthRequest.interface';

export type AskRequest = AuthRequest<{
  Body: {
    input?: string;
    sessionId?: string;
    userId?: string;
  };
}>;
