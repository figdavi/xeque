import { GetOpeningUseCase } from '@application/use-cases/get-opening';
import { SearchOpeningsUseCase } from '@application/use-cases/search-openings';
import { Opening } from '@domain/entities/opening';
import { SearchOpeningsQuery } from '@infrastructure/http/validation/schemas';
import { Request, Response } from 'express';

function toResponse(opening: Opening) {
    return {
        id: opening.id,
        eco: opening.eco,
        name: opening.name,
        pgn: opening.pgn,
    };
}

export class OpeningController {
    constructor(
        private searchOpeningsUseCase: SearchOpeningsUseCase,
        private getOpeningUseCase: GetOpeningUseCase,
    ) {}

    async search(req: Request, res: Response): Promise<Response> {
        const query = res.locals.query as SearchOpeningsQuery;

        const { items, total } =
            await this.searchOpeningsUseCase.execute(query);

        return res.status(200).json({
            data: items.map(toResponse),
            pagination: { total, limit: query.limit, offset: query.offset },
        });
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const id = String(req.params.id);

        const opening = await this.getOpeningUseCase.execute(id);

        return res.status(200).json({ data: toResponse(opening) });
    }
}
