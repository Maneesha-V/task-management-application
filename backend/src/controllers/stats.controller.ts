import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import { IStatsController } from "./interfaces/IStatsController";
import { IStatsService } from "../services/interfaces/IStatsService";
import { ApiError } from "../utils/ApiError";

@injectable()
export class StatsController implements IStatsController {
  constructor(
    @inject(TYPES.StatsService)
    private readonly statsService: IStatsService,
  ) {}
  getTaskStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const owner = req.user?.userId;
      if (!owner) throw new ApiError(401, "Unauthorised access.");
      const stats = await this.statsService.getTaskStats(owner);
      console.log("stats",stats);
      
      res.json(stats);
    } catch (err) {
      next(err);
    }
  };
}
