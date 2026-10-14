import {
    findStudentRepertoire,
    LineWithOpening,
    withOpening,
} from '@application/helpers/ownership';
import { Repertoire } from '@domain/entities/repertoire';
import { IOpeningRepository } from '@domain/repositories/opening.repository';
import { IRepertoireLineRepository } from '@domain/repositories/repertoire-line.repository';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

interface GetRepertoireDTO {
    studentId: string;
    repertoireId: string;
}

export class GetRepertoireUseCase {
    constructor(
        private repertoireRepository: IRepertoireRepository,
        private lineRepository: IRepertoireLineRepository,
        private openingRepository: IOpeningRepository,
    ) {}

    async execute(
        data: GetRepertoireDTO,
    ): Promise<{ repertoire: Repertoire; lines: LineWithOpening[] }> {
        const repertoire = await findStudentRepertoire(
            this.repertoireRepository,
            data.studentId,
            data.repertoireId,
        );

        const lines = await this.lineRepository.findByRepertoire(repertoire.id);

        return {
            repertoire,
            lines: await Promise.all(
                lines.map((line) => withOpening(this.openingRepository, line)),
            ),
        };
    }
}
