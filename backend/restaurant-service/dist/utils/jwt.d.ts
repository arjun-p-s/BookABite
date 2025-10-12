export type TokenPayload = {
    id: string;
    role?: string;
    iat?: number;
    exp?: number;
};
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=jwt.d.ts.map