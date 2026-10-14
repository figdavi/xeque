import { GetPositionStatsUseCase } from '@application/use-cases/get-position-stats';
import { ExplorerQuery } from '@infrastructure/http/validation/schemas';
import { Request, Response } from 'express';

export class ExplorerController {
    constructor(private getPositionStatsUseCase: GetPositionStatsUseCase) {}

    async getPositionStats(req: Request, res: Response): Promise<Response> {
        const { moves } = res.locals.query as ExplorerQuery;

        const stats = await this.getPositionStatsUseCase.execute(moves);

        return res.status(200).json({ data: stats });
    }
}
