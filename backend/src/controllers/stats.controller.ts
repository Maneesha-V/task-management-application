import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/types";
import { StatsService } from "../services/stats.service";

@injectable()
export class StatsController {
  constructor(
    @inject(TYPES.StatsService)
    private readonly statsService: StatsService,
  ) {}
getTaskStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
       const owner = req.user?.userId
      if(!owner) return res.status(401).json({ message: "Unauthorised access." });
    const stats = await this.statsService.getTaskStats(owner);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};
}

