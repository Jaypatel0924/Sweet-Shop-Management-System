import jwt, { JwtPayload } from 'jsonwebtoken';

export interface DecodedToken extends JwtPayload {
  userId: string;
  isAdmin: boolean;
}

const generateToken = (userId: string, isAdmin: boolean): string => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  const expiry = process.env.JWT_EXPIRY || '7d';
  
  return jwt.sign(
    { userId, isAdmin },
    secret,
    { expiresIn: expiry }
  );
};

const verifyToken = (token: string): DecodedToken => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  return jwt.verify(token, secret) as DecodedToken;
};

export { generateToken, verifyToken };
