import jwt from "jsonwebtoken";

export type TokenPayload = { id: string; role?: string; iat?: number; exp?: number };

const SECRET = process.env.JWT_SECRET || "changeme";

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, SECRET) as TokenPayload;
};
