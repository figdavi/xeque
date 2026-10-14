import { AddRepertoireLineUseCase } from '@application/use-cases/add-repertoire-line';
import { DeleteRepertoireLineUseCase } from '@application/use-cases/delete-repertoire-line';
import { GetRepertoireLineStatsUseCase } from '@application/use-cases/get-repertoire-line-stats';
import { UpdateRepertoireLineUseCase } from '@application/use-cases/update-repertoire-line';
import { lineToResponse } from '@infrastructure/http/controllers/repertoire.controller';
import {
    AddLineBody,
    UpdateLineBody,
} from '@infrastructure/http/validation/schemas';
import { Request, Response } from 'express';

export class RepertoireLineController {
    constructor(
        private addRepertoireLineUseCase: AddRepertoireLineUseCase,
        private updateRepertoireLineUseCase: UpdateRepertoireLineUseCase,
        private deleteRepertoireLineUseCase: DeleteRepertoireLineUseCase,
        private getRepertoireLineStatsUseCase: GetRepertoireLineStatsUseCase,
    ) {}

    async add(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const repertoireId = String(req.params.repertoireId);
        const { moves, notes } = req.body as AddLineBody;

        const result = await this.addRepertoireLineUseCase.execute({
            studentId,
            repertoireId,
            moves,
            notes,
        });

        return res.status(201).json({
            message: 'Linha adicionada ao repertório com sucesso!',
            data: lineToResponse(result),
        });
    }

    async update(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const repertoireId = String(req.params.repertoireId);
        const lineId = String(req.params.lineId);
        const { notes } = req.body as UpdateLineBody;

        const result = await this.updateRepertoireLineUseCase.execute({
            studentId,
            repertoireId,
            lineId,
            notes,
        });

        return res.status(200).json({
            message: 'Linha atualizada com sucesso!',
            data: lineToResponse(result),
        });
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const repertoireId = String(req.params.repertoireId);
        const lineId = String(req.params.lineId);

        await this.deleteRepertoireLineUseCase.execute({
            studentId,
            repertoireId,
            lineId,
        });

        return res.status(204).send();
    }

    async stats(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const repertoireId = String(req.params.repertoireId);
        const lineId = String(req.params.lineId);

        const stats = await this.getRepertoireLineStatsUseCase.execute({
            studentId,
            repertoireId,
            lineId,
        });

        return res.status(200).json({ data: stats });
    }
}
