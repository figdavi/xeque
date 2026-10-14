import { Opening } from '@domain/entities/opening';
import { Repertoire } from '@domain/entities/repertoire';
import { RepertoireLine } from '@domain/entities/repertoire-line';
import { NotFoundError } from '@domain/errors/app.error';
import { IOpeningRepository } from '@domain/repositories/opening.repository';
import { IRepertoireLineRepository } from '@domain/repositories/repertoire-line.repository';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

// As rotas são aninhadas (/students/:studentId/repertoires/:repertoireId/lines/:lineId).
// Estas funções garantem que cada id pertence ao "pai" da URL; senão, 404.

export async function findStudentRepertoire(
    repertoireRepository: IRepertoireRepository,
    studentId: string,
    repertoireId: string,
): Promise<Repertoire> {
    const repertoire = await repertoireRepository.findById(repertoireId);

    if (!repertoire || repertoire.studentId !== studentId) {
        throw new NotFoundError('Repertório não encontrado.');
    }

    return repertoire;
}

export async function findRepertoireLine(
    lineRepository: IRepertoireLineRepository,
    repertoireId: string,
    lineId: string,
): Promise<RepertoireLine> {
    const line = await lineRepository.findById(lineId);

    if (!line || line.repertoireId !== repertoireId) {
        throw new NotFoundError('Linha não encontrada neste repertório.');
    }

    return line;
}

export interface LineWithOpening {
    line: RepertoireLine;
    opening: Opening | null;
}

export async function withOpening(
    openingRepository: IOpeningRepository,
    line: RepertoireLine,
): Promise<LineWithOpening> {
    const opening = line.openingId
        ? await openingRepository.findById(line.openingId)
        : null;
    return { line, opening };
}
