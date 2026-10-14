import { Opening } from '@domain/entities/opening';
import {
    IOpeningRepository,
    OpeningFilter,
    Page,
} from '@domain/repositories/opening.repository';
import { PrismaClient } from './prisma/client';
import { Opening as OpeningRow, Prisma } from './prisma/generated/client';

function toDomain(row: OpeningRow): Opening {
    return new Opening(
        {
            eco: row.eco,
            name: row.name,
            pgn: row.pgn,
            uci: row.uci.split(' '),
        },
        row.id,
    );
}

export class PrismaOpeningRepository implements IOpeningRepository {
    constructor(private prisma: PrismaClient) {}

    async findById(id: string): Promise<Opening | null> {
        const row = await this.prisma.opening.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }

    async search(
        filter: OpeningFilter,
        page: Page,
    ): Promise<{ items: Opening[]; total: number }> {
        const where: Prisma.OpeningWhereInput = {};

        if (filter.name) {
            where.name = { contains: filter.name, mode: 'insensitive' };
        }
        if (filter.eco) {
            where.eco = filter.eco.toUpperCase();
        }
        if (filter.uciPrefix) {
            // "e2e4 c7c5" deve achar "e2e4 c7c5" e "e2e4 c7c5 g1f3 ...",
            // mas não "e2e4 c7c5x": por isso o OR com o espaço no final
            const prefix = filter.uciPrefix.join(' ');
            where.OR = [{ uci: prefix }, { uci: { startsWith: `${prefix} ` } }];
        }

        const [rows, total] = await Promise.all([
            this.prisma.opening.findMany({
                where,
                orderBy: [{ eco: 'asc' }, { name: 'asc' }],
                take: page.limit,
                skip: page.offset,
            }),
            this.prisma.opening.count({ where }),
        ]);

        return { items: rows.map(toDomain), total };
    }

    async findLongestPrefix(uci: string[]): Promise<Opening | null> {
        // todos os prefixos da linha: "e2e4", "e2e4 c7c5", "e2e4 c7c5 g1f3"...
        const prefixes = uci.map((_, index) =>
            uci.slice(0, index + 1).join(' '),
        );

        const rows = await this.prisma.opening.findMany({
            where: { uci: { in: prefixes } },
        });
        if (rows.length === 0) return null;

        const longest = rows.reduce((best, row) =>
            row.uci.length > best.uci.length ? row : best,
        );
        return toDomain(longest);
    }
}
