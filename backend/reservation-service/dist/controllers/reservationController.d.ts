import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
export declare const addReservation: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listReservation: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addTimeslot: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listTimeslots: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTimeslot: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=reservationController.d.ts.map