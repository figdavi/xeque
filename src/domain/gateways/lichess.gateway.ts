import { Color } from '@domain/chess/line';

// Contrato com o Lichess. O domínio define O QUE precisa; a implementação
// (HTTP, cache) fica em infrastructure/providers.

export interface GameCounts {
    white: number;
    draws: number;
    black: number;
    total: number;
}

export interface PositionStats {
    opening: { eco: string; name: string } | null;
    games: GameCounts;
    topMoves: {
        san: string;
        uci: string;
        averageRating: number;
        games: GameCounts;
    }[];
}

export interface LichessUser {
    username: string;
    ratings: {
        blitz: number | null;
        rapid: number | null;
        classical: number | null;
    };
}

// Placar do jogador do ponto de vista dele (jogando com a cor da linha)
export interface PlayerLineStats {
    wins: number;
    draws: number;
    losses: number;
    total: number;
    partial: boolean; // true se o Lichess ainda estava indexando as partidas
}

export interface ILichessGateway {
    getPositionStats(uci: string[]): Promise<PositionStats>;
    getUser(username: string): Promise<LichessUser | null>;
    getPlayerStats(
        username: string,
        color: Color,
        uci: string[],
    ): Promise<PlayerLineStats>;
}
