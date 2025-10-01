import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "changeme";

export type TokenPayload = { id: string; role?: string; iat?: number; exp?: number };

export const createToken = (userId: string, role?: string) =>
  jwt.sign({ id: userId, role }, SECRET, { expiresIn: "1h" });

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, SECRET) as TokenPayload;
};
