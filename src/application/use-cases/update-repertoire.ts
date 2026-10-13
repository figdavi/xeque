import { Repertoire } from '@domain/entities/repertoire';
import { AppError } from '@domain/errors/app.error';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

interface UpdateRepertoireDTO {
    studentId: string; // Usado apenas para busca
    openingId: string; // Usado apenas para busca
    notes: string;
    // Mudar notes para opcional se novos atributos forem adicionados
}

export class UpdateRepertoireUseCase {
    constructor(private repertoireRepository: IRepertoireRepository) {}

    async execute(data: UpdateRepertoireDTO): Promise<Repertoire> {
        if (typeof data.notes !== 'string') {
            throw new AppError('Anotações (notes) são obrigatórias.', 400);
        }

        const existingRepertoire =
            await this.repertoireRepository.findByStudentAndOpening(
                data.studentId,
                data.openingId,
            );

        if (!existingRepertoire) {
            throw new AppError(
                'Este estudante não possui um repertório para esta abertura.',
                404,
            );
        }

        existingRepertoire.update({ notes: data.notes });

        return await this.repertoireRepository.update(existingRepertoire);
    }
}
