import {
    findStudentRepertoire,
    LineWithOpening,
} from '@application/helpers/ownership';
import { formatLine, parseLine } from '@domain/chess/line';
import { RepertoireLine } from '@domain/entities/repertoire-line';
import { ConflictError } from '@domain/errors/app.error';
import { IOpeningRepository } from '@domain/repositories/opening.repository';
import { IRepertoireLineRepository } from '@domain/repositories/repertoire-line.repository';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';
import { assertConsistent } from '@domain/services/repertoire-consistency';

interface AddRepertoireLineDTO {
    studentId: string;
    repertoireId: string;
    moves: string[]; // SAN
    notes?: string;
}

export class AddRepertoireLineUseCase {
    constructor(
        private repertoireRepository: IRepertoireRepository,
        private lineRepository: IRepertoireLineRepository,
        private openingRepository: IOpeningRepository,
    ) {}

    async execute(data: AddRepertoireLineDTO): Promise<LineWithOpening> {
        const repertoire = await findStudentRepertoire(
            this.repertoireRepository,
            data.studentId,
            data.repertoireId,
        );

        // 1. Lances legais? (lança ValidationError com o lance ilegal)
        const parsed = parseLine(data.moves);

        // 2. Linha repetida?
        const existingLines = await this.lineRepository.findByRepertoire(
            repertoire.id,
        );
        const uciKey = parsed.uci.join(' ');
        if (existingLines.some((line) => line.uci.join(' ') === uciKey)) {
            throw new ConflictError(
                `A linha "${formatLine(parsed.san)}" já está neste repertório.`,
            );
        }

        // 3. Regra de negócio: uma resposta por posição dentro do repertório
        assertConsistent(repertoire.color, parsed.san, existingLines);

        // 4. Abertura do catálogo que melhor descreve a linha
        const opening = await this.openingRepository.findLongestPrefix(
            parsed.uci,
        );

        const line = new RepertoireLine({
            repertoireId: repertoire.id,
            moves: parsed.san,
            uci: parsed.uci,
            openingId: opening?.id ?? null,
            notes: data.notes ?? '',
        });

        await this.lineRepository.create(line);
        return { line, opening };
    }
}
