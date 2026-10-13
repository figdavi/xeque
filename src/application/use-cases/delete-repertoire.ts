import { AppError } from '@domain/errors/app.error';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

interface DeleteRepertoireDTO {
    studentId: string;
    openingId: string;
}

export class DeleteRepertoireUseCase {
    constructor(private repertoireRepository: IRepertoireRepository) {}

    async execute(data: DeleteRepertoireDTO): Promise<void> {
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

        await this.repertoireRepository.delete(existingRepertoire.id);
    }
}
