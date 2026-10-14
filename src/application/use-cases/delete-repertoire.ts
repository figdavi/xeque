import { findStudentRepertoire } from '@application/helpers/ownership';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

interface DeleteRepertoireDTO {
    studentId: string;
    repertoireId: string;
}

export class DeleteRepertoireUseCase {
    constructor(private repertoireRepository: IRepertoireRepository) {}

    async execute(data: DeleteRepertoireDTO): Promise<void> {
        const repertoire = await findStudentRepertoire(
            this.repertoireRepository,
            data.studentId,
            data.repertoireId,
        );

        // As linhas do repertório são removidas em cascata pelo banco
        await this.repertoireRepository.delete(repertoire.id);
    }
}
