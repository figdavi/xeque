import { Chess } from 'chess.js';
import { ValidationError } from '@domain/errors/app.error';

// O chess.js é uma biblioteca pura (sem I/O, sem framework). Por isso ela
// pode ser usada no domínio sem quebrar a regra de dependência.

export const COLORS = ['white', 'black'] as const;
export type Color = (typeof COLORS)[number];

export interface LinePosition {
    epd: string; // posição sem os contadores de lance (identifica transposições)
    sideToMove: Color;
    san: string; // lance jogado a partir desta posição
}

export interface ParsedLine {
    san: string[];
    uci: string[];
    positions: LinePosition[];
}

// "1. e4 c5 2.Nf3" -> ['e4', 'c5', 'Nf3']
export function tokenizeMoves(text: string): string[] {
    return text
        .split(/\s+/)
        .map((token) => token.replace(/^\d+\.+/, ''))
        .filter((token) => token.length > 0);
}

export function parseLine(moves: string[]): ParsedLine {
    const chess = new Chess();
    const san: string[] = [];
    const uci: string[] = [];
    const positions: LinePosition[] = [];

    moves.forEach((move, index) => {
        const epd = chess.fen().split(' ').slice(0, 4).join(' ');
        const sideToMove: Color = chess.turn() === 'w' ? 'white' : 'black';

        let played;
        try {
            played = chess.move(move);
        } catch {
            throw new ValidationError(
                `Lance ilegal: ${move} (${formatMoveNumber(index)}).`,
            );
        }

        san.push(played.san);
        uci.push(played.lan);
        positions.push({ epd, sideToMove, san: played.san });
    });

    return { san, uci, positions };
}

// Formata ['e4', 'c5', 'Nf3'] como "1. e4 c5 2. Nf3"
export function formatLine(san: string[]): string {
    return san
        .map((move, index) =>
            index % 2 === 0 ? `${index / 2 + 1}. ${move}` : move,
        )
        .join(' ');
}

// Índice 0 -> "lance 1 das brancas", índice 1 -> "lance 1 das pretas"
function formatMoveNumber(index: number): string {
    const number = Math.floor(index / 2) + 1;
    const side = index % 2 === 0 ? 'brancas' : 'pretas';
    return `lance ${number} das ${side}`;
}
