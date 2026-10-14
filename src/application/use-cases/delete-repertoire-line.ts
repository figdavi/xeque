import {
    findRepertoireLine,
    findStudentRepertoire,
} from '@application/helpers/ownership';
import { IRepertoireLineRepository } from '@domain/repositories/repertoire-line.repository';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

interface DeleteRepertoireLineDTO {
    studentId: string;
    repertoireId: string;
    lineId: string;
}

export class DeleteRepertoireLineUseCase {
    constructor(
        private repertoireRepository: IRepertoireRepository,
        private lineRepository: IRepertoireLineRepository,
    ) {}

    async execute(data: DeleteRepertoireLineDTO): Promise<void> {
        const repertoire = await findStudentRepertoire(
            this.repertoireRepository,
            data.studentId,
            data.repertoireId,
        );
        const line = await findRepertoireLine(
            this.lineRepository,
            repertoire.id,
            data.lineId,
        );

        await this.lineRepository.delete(line.id);
    }
}
