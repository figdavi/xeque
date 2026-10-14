import { Opening } from '@domain/entities/opening';
import {
    IOpeningRepository,
    OpeningFilter,
    Page,
} from '@domain/repositories/opening.repository';

export class InMemoryOpeningRepository implements IOpeningRepository {
    public items: Opening[] = [];

    async findById(id: string): Promise<Opening | null> {
        const opening = this.items.find((item) => item.id === id);
        if (!opening) return null;
        return opening;
    }

    async search(
        filter: OpeningFilter,
        page: Page,
    ): Promise<{ items: Opening[]; total: number }> {
        const name = filter.name?.toLowerCase();
        const prefix = filter.uciPrefix;

        const matches = this.items.filter(
            (item) =>
                (!name || item.name.toLowerCase().includes(name)) &&
                (!filter.eco || item.eco === filter.eco.toUpperCase()) &&
                (!prefix ||
                    prefix.every((move, index) => item.uci[index] === move)),
        );

        return {
            items: matches.slice(page.offset, page.offset + page.limit),
            total: matches.length,
        };
    }

    async findLongestPrefix(uci: string[]): Promise<Opening | null> {
        const prefixes = this.items.filter(
            (item) =>
                item.uci.length <= uci.length &&
                item.uci.every((move, index) => uci[index] === move),
        );
        if (prefixes.length === 0) return null;

        return prefixes.reduce((best, item) =>
            item.uci.length > best.uci.length ? item : best,
        );
    }
}
