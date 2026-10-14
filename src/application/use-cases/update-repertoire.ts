import { findStudentRepertoire } from '@application/helpers/ownership';
import { Repertoire } from '@domain/entities/repertoire';
import { ConflictError } from '@domain/errors/app.error';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

interface UpdateRepertoireDTO {
    studentId: string; // Usado apenas para busca
    repertoireId: string; // Usado apenas para busca
    name: string;
}

export class UpdateRepertoireUseCase {
    constructor(private repertoireRepository: IRepertoireRepository) {}

    async execute(data: UpdateRepertoireDTO): Promise<Repertoire> {
        const repertoire = await findStudentRepertoire(
            this.repertoireRepository,
            data.studentId,
            data.repertoireId,
        );

        const nameTaken = await this.repertoireRepository.findByStudentAndName(
            data.studentId,
            data.name,
        );
        if (nameTaken && nameTaken.id !== repertoire.id) {
            throw new ConflictError(
                'Este estudante já tem um repertório com esse nome.',
            );
        }

        repertoire.update({ name: data.name });

        return await this.repertoireRepository.update(repertoire);
    }
}
