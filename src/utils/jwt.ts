import jwt from 'jsonwebtoken';

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
}
