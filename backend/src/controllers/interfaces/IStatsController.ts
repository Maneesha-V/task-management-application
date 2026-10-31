import { Request, Response, NextFunction } from "express";

export interface IStatsController {
    getTaskStats (req: Request, res: Response, next: NextFunction): Promise<void>;
}