import { Color, formatLine, parseLine } from '@domain/chess/line';
import { RepertoireLine } from '@domain/entities/repertoire-line';
import { BusinessRuleError } from '@domain/errors/app.error';

// Regra: dentro de UM repertório, cada posição em que é a vez do estudante
// só pode ter uma resposta. Os lances do adversário podem ramificar à vontade.
// Para ter outra resposta na mesma posição, o estudante cria outro repertório.
//
// Ex. (repertório de pretas com "1. e4 c5"):
//   "1. e4 c5 2. Nf3 d6" -> ok (estende a linha)
//   "1. e4 c5 2. c3 Nf6" -> ok (o adversário é quem desviou)
//   "1. d4 Nf6"          -> ok (outra posição)
//   "1. e4 e5"           -> conflito (após 1. e4, responderia c5 E e5)
//
// A comparação é por posição do tabuleiro, então transposições contam:
// "1. Nf3 d5 2. d4" e "1. d4 d5 2. Nf3" chegam à mesma posição.

export class RepertoireConflictError extends BusinessRuleError {}

export function assertConsistent(
    color: Color,
    newMoves: string[],
    existingLines: RepertoireLine[],
): void {
    // posição -> índice do lance do estudante na nova linha
    const newLine = parseLine(newMoves);
    const newAnswers = new Map<string, number>();
    newLine.positions.forEach((position, index) => {
        if (position.sideToMove === color) {
            newAnswers.set(position.epd, index);
        }
    });

    for (const line of existingLines) {
        const existing = parseLine(line.moves);

        for (const position of existing.positions) {
            const newIndex = newAnswers.get(position.epd);
            if (newIndex === undefined) continue;

            const newMove = newLine.san[newIndex];
            if (newMove === position.san) continue;

            const reachedBy =
                formatLine(newLine.san.slice(0, newIndex)) ||
                'a posição inicial';

            throw new RepertoireConflictError(
                `Conflito com a linha "${formatLine(line.moves)}": após ${reachedBy}, ` +
                    `este repertório já responde ${position.san}, e a nova linha responde ${newMove}. ` +
                    'Para estudar as duas respostas, use outro repertório.',
                {
                    conflictingLineId: line.id,
                    position: reachedBy,
                    existingMove: position.san,
                    newMove,
                },
            );
        }
    }
}
