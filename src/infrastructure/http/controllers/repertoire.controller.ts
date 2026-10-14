import { LineWithOpening } from '@application/helpers/ownership';
import { CreateRepertoireUseCase } from '@application/use-cases/create-repertoire';
import { DeleteRepertoireUseCase } from '@application/use-cases/delete-repertoire';
import { GetRepertoireUseCase } from '@application/use-cases/get-repertoire';
import { ListRepertoiresUseCase } from '@application/use-cases/list-repertoires';
import { UpdateRepertoireUseCase } from '@application/use-cases/update-repertoire';
import { formatLine } from '@domain/chess/line';
import { Repertoire } from '@domain/entities/repertoire';
import {
    CreateRepertoireBody,
    UpdateRepertoireBody,
} from '@infrastructure/http/validation/schemas';
import { Request, Response } from 'express';

function toResponse(repertoire: Repertoire) {
    return {
        id: repertoire.id,
        name: repertoire.name,
        color: repertoire.color,
    };
}

export function lineToResponse({ line, opening }: LineWithOpening) {
    return {
        id: line.id,
        moves: line.moves,
        pgn: formatLine(line.moves),
        notes: line.notes,
        opening: opening
            ? { id: opening.id, eco: opening.eco, name: opening.name }
            : null,
    };
}

export class RepertoireController {
    constructor(
        private createRepertoireUseCase: CreateRepertoireUseCase,
        private listRepertoiresUseCase: ListRepertoiresUseCase,
        private getRepertoireUseCase: GetRepertoireUseCase,
        private updateRepertoireUseCase: UpdateRepertoireUseCase,
        private deleteRepertoireUseCase: DeleteRepertoireUseCase,
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const { name, color } = req.body as CreateRepertoireBody;

        const repertoire = await this.createRepertoireUseCase.execute({
            studentId,
            name,
            color,
        });

        return res.status(201).json({
            message: 'Repertório criado com sucesso!',
            data: toResponse(repertoire),
        });
    }

    async list(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);

        const repertoires =
            await this.listRepertoiresUseCase.execute(studentId);

        return res.status(200).json({ data: repertoires.map(toResponse) });
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const repertoireId = String(req.params.repertoireId);

        const { repertoire, lines } = await this.getRepertoireUseCase.execute({
            studentId,
            repertoireId,
        });

        return res.status(200).json({
            data: {
                ...toResponse(repertoire),
                lines: lines.map(lineToResponse),
            },
        });
    }

    async update(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const repertoireId = String(req.params.repertoireId);
        const { name } = req.body as UpdateRepertoireBody;

        const repertoire = await this.updateRepertoireUseCase.execute({
            studentId,
            repertoireId,
            name,
        });

        return res.status(200).json({
            message: 'Repertório atualizado com sucesso!',
            data: toResponse(repertoire),
        });
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const repertoireId = String(req.params.repertoireId);

        await this.deleteRepertoireUseCase.execute({ studentId, repertoireId });

        return res.status(204).send();
    }
}
