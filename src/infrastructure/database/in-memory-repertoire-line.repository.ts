import { RepertoireLine } from '@domain/entities/repertoire-line';
import { IRepertoireLineRepository } from '@domain/repositories/repertoire-line.repository';

export class InMemoryRepertoireLineRepository implements IRepertoireLineRepository {
    public items: RepertoireLine[] = [];

    async create(line: RepertoireLine): Promise<void> {
        this.items.push(line);
    }

    async findById(id: string): Promise<RepertoireLine | null> {
        const line = this.items.find((item) => item.id === id);
        if (!line) return null;
        return line;
    }

    async findByRepertoire(repertoireId: string): Promise<RepertoireLine[]> {
        return this.items.filter((item) => item.repertoireId === repertoireId);
    }

    async update(line: RepertoireLine): Promise<RepertoireLine> {
        const index = this.items.findIndex((item) => item.id === line.id);
        if (index === -1) {
            throw new Error('Linha não encontrada.');
        }
        this.items[index] = line;
        return line;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) {
            throw new Error('Linha não encontrada.');
        }
        this.items.splice(index, 1);
    }
}
