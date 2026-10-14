import { RepertoireLine } from '@domain/entities/repertoire-line';
import { IRepertoireLineRepository } from '@domain/repositories/repertoire-line.repository';
import { PrismaClient } from './prisma/client';
import { RepertoireLine as RepertoireLineRow } from './prisma/generated/client';

function toDomain(row: RepertoireLineRow): RepertoireLine {
    return new RepertoireLine(
        {
            repertoireId: row.repertoireId,
            moves: row.moves,
            uci: row.uci.split(' '),
            openingId: row.openingId,
            notes: row.notes,
        },
        row.id,
    );
}

export class PrismaRepertoireLineRepository implements IRepertoireLineRepository {
    constructor(private prisma: PrismaClient) {}

    async create(line: RepertoireLine): Promise<void> {
        await this.prisma.repertoireLine.create({
            data: {
                id: line.id,
                repertoireId: line.repertoireId,
                moves: line.moves,
                uci: line.uci.join(' '),
                openingId: line.openingId,
                notes: line.notes,
            },
        });
    }

    async findById(id: string): Promise<RepertoireLine | null> {
        const row = await this.prisma.repertoireLine.findUnique({
            where: { id },
        });
        return row ? toDomain(row) : null;
    }

    async findByRepertoire(repertoireId: string): Promise<RepertoireLine[]> {
        const rows = await this.prisma.repertoireLine.findMany({
            where: { repertoireId },
            orderBy: { uci: 'asc' },
        });
        return rows.map(toDomain);
    }

    async update(line: RepertoireLine): Promise<RepertoireLine> {
        const row = await this.prisma.repertoireLine.update({
            where: { id: line.id },
            data: { notes: line.notes },
        });
        return toDomain(row);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.repertoireLine.delete({ where: { id } });
    }
}
