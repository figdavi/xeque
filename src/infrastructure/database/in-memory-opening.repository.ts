import { Opening } from '@domain/entities/opening';
import {
    IOpeningRepository,
    OpeningFilter,
} from '@domain/repositories/opening.repository';

export class InMemoryOpeningRepository implements IOpeningRepository {
    public items: Opening[] = [];

    async create(opening: Opening): Promise<void> {
        this.items.push(opening);
    }

    async findById(id: string): Promise<Opening | null> {
        const opening = this.items.find((item) => item.id === id);
        if (!opening) return null;
        return opening;
    }

    async findAll(filter: OpeningFilter = {}): Promise<Opening[]> {
        const name = filter.name?.toLowerCase();

        return this.items.filter(
            (item) =>
                (!filter.color || item.color === filter.color) &&
                (!name || item.openingName.toLowerCase().includes(name)),
        );
    }

    async update(opening: Opening): Promise<Opening> {
        const index = this.items.findIndex((item) => item.id === opening.id);
        if (index === -1) {
            throw new Error('Opening not found');
        }
        this.items[index] = opening;
        return opening;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) {
            throw new Error('Opening not found');
        }
        this.items.splice(index, 1);
    }
}
