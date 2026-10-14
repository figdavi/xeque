import { Color } from '@domain/chess/line';
import { ExternalServiceError } from '@domain/errors/app.error';
import {
    GameCounts,
    ILichessGateway,
    LichessUser,
    PlayerLineStats,
    PositionStats,
} from '@domain/gateways/lichess.gateway';

const LICHESS_URL = 'https://lichess.org';
const EXPLORER_URL = 'https://explorer.lichess.org';

// Formato bruto das respostas do Lichess (só os campos usados)
interface ExplorerCounts {
    white: number;
    draws: number;
    black: number;
}

interface ExplorerResponse extends ExplorerCounts {
    opening: { eco: string; name: string } | null;
    moves: (ExplorerCounts & {
        uci: string;
        san: string;
        averageRating?: number;
    })[];
}

interface UserResponse {
    username: string;
    disabled?: boolean;
    perfs?: Record<string, { rating: number } | undefined>;
}

function toCounts(data: ExplorerCounts): GameCounts {
    return {
        white: data.white,
        draws: data.draws,
        black: data.black,
        total: data.white + data.draws + data.black,
    };
}

export class LichessGateway implements ILichessGateway {
    constructor(private token: string) {}

    async getPositionStats(uci: string[]): Promise<PositionStats> {
        const url = new URL('/lichess', EXPLORER_URL);
        url.searchParams.set('play', uci.join(','));
        url.searchParams.set('moves', '5');
        url.searchParams.set('topGames', '0');
        url.searchParams.set('recentGames', '0');

        const response = await this.request(url, { auth: true });
        const data = (await response.json()) as ExplorerResponse;

        return {
            opening: data.opening,
            games: toCounts(data),
            topMoves: data.moves.map((move) => ({
                san: move.san,
                uci: move.uci,
                averageRating: move.averageRating ?? 0,
                games: toCounts(move),
            })),
        };
    }

    async getUser(username: string): Promise<LichessUser | null> {
        const url = new URL(
            `/api/user/${encodeURIComponent(username)}`,
            LICHESS_URL,
        );

        const response = await this.request(url, { auth: false });
        if (response.status === 404) return null;

        const data = (await response.json()) as UserResponse;
        if (data.disabled) return null;

        return {
            username: data.username,
            ratings: {
                blitz: data.perfs?.blitz?.rating ?? null,
                rapid: data.perfs?.rapid?.rating ?? null,
                classical: data.perfs?.classical?.rating ?? null,
            },
        };
    }

    async getPlayerStats(
        username: string,
        color: Color,
        uci: string[],
    ): Promise<PlayerLineStats> {
        const url = new URL('/player', EXPLORER_URL);
        url.searchParams.set('player', username);
        url.searchParams.set('color', color);
        url.searchParams.set('play', uci.join(','));
        url.searchParams.set('moves', '0');
        url.searchParams.set('recentGames', '0');

        // O /player responde em stream (NDJSON): manda o resultado atual na
        // hora e mantém a conexão aberta enquanto indexa partidas novas (o que
        // pode levar minutos). Lemos por no máximo 5s e ficamos com a última
        // linha recebida; se o prazo acabar, o resultado é marcado como parcial.
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5_000);
        let lastLine: string | null = null;
        let partial = false;

        try {
            const response = await this.request(url, {
                auth: true,
                signal: controller.signal,
            });
            const decoder = new TextDecoder();
            let buffer = '';

            try {
                for await (const chunk of response.body ?? []) {
                    buffer += decoder.decode(chunk, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';
                    for (const line of lines) {
                        if (line.trim()) lastLine = line;
                    }
                }
                if (buffer.trim()) lastLine = buffer;
            } catch (error) {
                if (!controller.signal.aborted) throw error;
                partial = true; // prazo acabou: usa o que chegou até agora
            }
        } finally {
            clearTimeout(timeout);
        }

        if (!lastLine) {
            throw new ExternalServiceError(
                'O Lichess não retornou estatísticas a tempo. Tente novamente.',
            );
        }

        const data = JSON.parse(lastLine) as ExplorerCounts;
        const wins = color === 'white' ? data.white : data.black;
        const losses = color === 'white' ? data.black : data.white;

        return {
            wins,
            draws: data.draws,
            losses,
            total: wins + data.draws + losses,
            partial,
        };
    }

    private async request(
        url: URL,
        options: { auth: boolean; signal?: AbortSignal },
    ): Promise<Response> {
        let response: Response;
        try {
            response = await fetch(url, {
                headers: options.auth
                    ? { Authorization: `Bearer ${this.token}` }
                    : {},
                signal: options.signal ?? AbortSignal.timeout(5_000),
            });
        } catch {
            throw new ExternalServiceError(
                'Não foi possível conectar ao Lichess.',
            );
        }

        if (response.status === 401) {
            throw new ExternalServiceError(
                'Token do Lichess inválido ou expirado.',
            );
        }
        if (response.status === 429) {
            throw new ExternalServiceError(
                'Limite de requisições do Lichess atingido. Tente em instantes.',
            );
        }
        if (!response.ok && response.status !== 404) {
            throw new ExternalServiceError(
                `Lichess respondeu com erro ${response.status}.`,
            );
        }

        return response;
    }
}
