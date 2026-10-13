import { CreateOpeningUseCase } from '@application/use-cases/create-opening';
import { GetOpeningUseCase } from '@application/use-cases/get-opening';
import { ListOpeningsUseCase } from '@application/use-cases/list-openings';
import { UpdateOpeningUseCase } from '@application/use-cases/update-opening';
import { DeleteOpeningUseCase } from '@application/use-cases/delete-opening';
import { Opening } from '@domain/entities/opening';
import { Request, Response } from 'express';

function toResponse(opening: Opening) {
    return {
        id: opening.id,
        openingName: opening.openingName,
        color: opening.color,
        moves: opening.moves,
    };
}

function queryString(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
}

export class OpeningController {
    constructor(
        private createOpeningUseCase: CreateOpeningUseCase,
        private listOpeningUseCase: ListOpeningsUseCase,
        private getOpeningUseCase: GetOpeningUseCase,
        private updateOpeningUseCase: UpdateOpeningUseCase,
        private deleteOpeningUseCase: DeleteOpeningUseCase,
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        const { openingName, color, moves } = req.body;

        const opening = await this.createOpeningUseCase.execute({
            openingName,
            color,
            moves,
        });

        return res.status(201).json({
            message: 'Abertura criada com sucesso!',
            data: toResponse(opening),
        });
    }

    async list(req: Request, res: Response): Promise<Response> {
        const openings = await this.listOpeningUseCase.execute({
            color: queryString(req.query.color),
            name: queryString(req.query.name),
        });

        return res.status(200).json({ data: openings.map(toResponse) });
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const id = String(req.params.id);

        const opening = await this.getOpeningUseCase.execute(id);

        return res.status(200).json({ data: toResponse(opening) });
    }

    async update(req: Request, res: Response): Promise<Response> {
        const id = String(req.params.id);
        const { openingName, color, moves } = req.body;

        const updatedOpening = await this.updateOpeningUseCase.execute({
            id,
            openingName,
            color,
            moves,
        });

        return res.status(200).json({
            message: 'Abertura atualizada com sucesso!',
            data: toResponse(updatedOpening),
        });
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const id = String(req.params.id);

        await this.deleteOpeningUseCase.execute(id);

        return res.status(204).send();
    }
}
