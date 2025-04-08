import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here_change_this_in_production';

export function signToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    console.log('verifyToken - Verifying token');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('verifyToken - Token verified:', decoded);
    return decoded;
  } catch (error) {
    console.error('verifyToken - Error verifying token:', error);
    return null;
  }
}
