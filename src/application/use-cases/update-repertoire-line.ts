import {
    findRepertoireLine,
    findStudentRepertoire,
    LineWithOpening,
    withOpening,
} from '@application/helpers/ownership';
import { IOpeningRepository } from '@domain/repositories/opening.repository';
import { IRepertoireLineRepository } from '@domain/repositories/repertoire-line.repository';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

interface UpdateRepertoireLineDTO {
    studentId: string; // Usado apenas para busca
    repertoireId: string; // Usado apenas para busca
    lineId: string; // Usado apenas para busca
    notes: string;
    // Mudar notes para opcional se novos atributos forem adicionados
}

export class UpdateRepertoireLineUseCase {
    constructor(
        private repertoireRepository: IRepertoireRepository,
        private lineRepository: IRepertoireLineRepository,
        private openingRepository: IOpeningRepository,
    ) {}

    async execute(data: UpdateRepertoireLineDTO): Promise<LineWithOpening> {
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

        line.update({ notes: data.notes });

        const updated = await this.lineRepository.update(line);
        return withOpening(this.openingRepository, updated);
    }
}
