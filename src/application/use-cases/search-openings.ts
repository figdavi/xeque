import { parseLine } from '@domain/chess/line';
import { Opening } from '@domain/entities/opening';
import {
    IOpeningRepository,
    OpeningFilter,
} from '@domain/repositories/opening.repository';

interface SearchOpeningsDTO {
    name?: string;
    eco?: string;
    moves?: string[]; // SAN
    limit: number;
    offset: number;
}

export class SearchOpeningsUseCase {
    constructor(private openingRepository: IOpeningRepository) {}

    async execute(
        data: SearchOpeningsDTO,
    ): Promise<{ items: Opening[]; total: number }> {
        const filter: OpeningFilter = {
            name: data.name,
            eco: data.eco,
        };

        if (data.moves && data.moves.length > 0) {
            // valida os lances e converte para UCI, formato guardado no catálogo
            filter.uciPrefix = parseLine(data.moves).uci;
        }

        return this.openingRepository.search(filter, {
            limit: data.limit,
            offset: data.offset,
        });
    }
}
