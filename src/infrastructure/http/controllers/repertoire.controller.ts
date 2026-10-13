import { CreateRepertoireUseCase } from '@application/use-cases/create-repertoire';
import { ListStudentRepertoireUseCase } from '@application/use-cases/list-student-repertoire';
import { UpdateRepertoireUseCase } from '@application/use-cases/update-repertoire';
import { DeleteRepertoireUseCase } from '@application/use-cases/delete-repertoire';
import { Repertoire } from '@domain/entities/repertoire';
import { Request, Response } from 'express';

function toResponse(repertoire: Repertoire) {
    return {
        id: repertoire.id,
        studentId: repertoire.studentId,
        openingId: repertoire.openingId,
        notes: repertoire.notes,
    };
}

export class RepertoireController {
    constructor(
        private createRepertoireUseCase: CreateRepertoireUseCase,
        private listStudentRepertoireUseCase: ListStudentRepertoireUseCase,
        private updateRepertoireUseCase: UpdateRepertoireUseCase,
        private deleteRepertoireUseCase: DeleteRepertoireUseCase,
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const { openingId, notes } = req.body;

        const repertoire = await this.createRepertoireUseCase.execute({
            studentId,
            openingId,
            notes,
        });

        return res.status(201).json({
            message: 'Abertura adicionada ao repertório com sucesso!',
            data: toResponse(repertoire),
        });
    }

    async list(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);

        const repertoire =
            await this.listStudentRepertoireUseCase.execute(studentId);

        return res.status(200).json({ data: repertoire.map(toResponse) });
    }

    async update(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const openingId = String(req.params.openingId);
        const { notes } = req.body;

        const repertoire = await this.updateRepertoireUseCase.execute({
            studentId,
            openingId,
            notes,
        });

        return res.status(200).json({
            message: 'Repertório atualizado com sucesso!',
            data: toResponse(repertoire),
        });
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const studentId = String(req.params.studentId);
        const openingId = String(req.params.openingId);

        await this.deleteRepertoireUseCase.execute({ studentId, openingId });

        return res.status(204).send();
    }
}
