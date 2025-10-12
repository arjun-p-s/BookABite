import { Request, Response, NextFunction } from "express";
export type ReqUser = {
    id: string;
    role: "user" | "admin";
};
export interface AuthRequest extends Request {
    user?: ReqUser;
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireRestaurantAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authMiddleware.d.ts.map