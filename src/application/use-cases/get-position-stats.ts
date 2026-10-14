import { parseLine } from '@domain/chess/line';
import {
    ILichessGateway,
    PositionStats,
} from '@domain/gateways/lichess.gateway';

export class GetPositionStatsUseCase {
    constructor(private lichessGateway: ILichessGateway) {}

    // moves vazio = posição inicial
    async execute(moves: string[]): Promise<PositionStats> {
        const line = parseLine(moves);
        return this.lichessGateway.getPositionStats(line.uci);
    }
}
