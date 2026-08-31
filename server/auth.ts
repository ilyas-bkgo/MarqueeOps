import jwt from 'jsonwebtoken';
import { CurrentSessionUser, Role } from './types';
import { config } from './config';

const JWT_EXPIRES_IN = '7d';

function getJwtSecret(): string {
  if (!config.JWT_SECRET) {
    throw new Error('JWT authentication is not configured. Set JWT_SECRET before enabling authenticated access.');
  }
  return config.JWT_SECRET;
}

export function generateSessionToken(user: CurrentSessionUser): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifySessionToken(token: string): CurrentSessionUser | null {
  try {
    return jwt.verify(token, getJwtSecret()) as CurrentSessionUser;
  } catch {
    return null;
  }
}
