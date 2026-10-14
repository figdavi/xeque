import { Color } from '@domain/chess/line';
import {
    ILichessGateway,
    LichessUser,
    PlayerLineStats,
    PositionStats,
} from '@domain/gateways/lichess.gateway';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// Decorator: implementa a MESMA interface do gateway real e o "embrulha",
// guardando as respostas por um tempo. Os use cases recebem um
// ILichessGateway e não sabem se há cache ou não; quem decide é a factory.
//
// O cache vive na memória do processo (um Map). Para várias instâncias do
// servidor, o próximo passo seria um cache compartilhado, como Redis.
export class CachedLichessGateway implements ILichessGateway {
    private cache = new Map<string, { value: unknown; expiresAt: number }>();

    constructor(private gateway: ILichessGateway) {}

    getPositionStats(uci: string[]): Promise<PositionStats> {
        return this.cached(`position:${uci.join(',')}`, 24 * HOUR, () =>
            this.gateway.getPositionStats(uci),
        );
    }

    getUser(username: string): Promise<LichessUser | null> {
        return this.cached(`user:${username.toLowerCase()}`, 10 * MINUTE, () =>
            this.gateway.getUser(username),
        );
    }

    async getPlayerStats(
        username: string,
        color: Color,
        uci: string[],
    ): Promise<PlayerLineStats> {
        const key = `player:${username.toLowerCase()}:${color}:${uci.join(',')}`;
        const stats = await this.cached(key, HOUR, () =>
            this.gateway.getPlayerStats(username, color, uci),
        );
        // Resultado parcial (Lichess ainda indexando) fica só 1 minuto no cache:
        // o Lichess indexa partidas novas no máximo uma vez por minuto.
        const hit = this.cache.get(key);
        if (stats.partial && hit && hit.expiresAt > Date.now() + MINUTE) {
            hit.expiresAt = Date.now() + MINUTE;
        }
        return stats;
    }

    private async cached<T>(
        key: string,
        ttl: number,
        load: () => Promise<T>,
    ): Promise<T> {
        const hit = this.cache.get(key);
        if (hit && hit.expiresAt > Date.now()) {
            return hit.value as T;
        }

        // erros não são guardados: a próxima chamada tenta de novo
        const value = await load();
        this.cache.set(key, { value, expiresAt: Date.now() + ttl });
        return value;
    }
}
