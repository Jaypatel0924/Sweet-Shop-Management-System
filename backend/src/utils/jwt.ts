import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface DecodedToken extends JwtPayload {
  userId: string;
  isAdmin: boolean;
}

const generateToken = (userId: string, isAdmin: boolean): string => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  
  return jwt.sign(
    { userId, isAdmin },
    secret,
    { expiresIn: '7d' } as SignOptions
  );
};

const verifyToken = (token: string): DecodedToken => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  return jwt.verify(token, secret) as DecodedToken;
};

export { generateToken, verifyToken };
