import { Repertoire } from '@domain/entities/repertoire';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';
import { PrismaClient } from './prisma/client';
import { Repertoire as RepertoireRow } from './prisma/generated/client';

function toDomain(row: RepertoireRow): Repertoire {
    return new Repertoire(
        { studentId: row.studentId, name: row.name, color: row.color },
        row.id,
    );
}

export class PrismaRepertoireRepository implements IRepertoireRepository {
    constructor(private prisma: PrismaClient) {}

    async create(repertoire: Repertoire): Promise<void> {
        await this.prisma.repertoire.create({
            data: {
                id: repertoire.id,
                studentId: repertoire.studentId,
                name: repertoire.name,
                color: repertoire.color,
            },
        });
    }

    async findById(id: string): Promise<Repertoire | null> {
        const row = await this.prisma.repertoire.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }

    async findByStudent(studentId: string): Promise<Repertoire[]> {
        const rows = await this.prisma.repertoire.findMany({
            where: { studentId },
            orderBy: { createdAt: 'asc' },
        });
        return rows.map(toDomain);
    }

    async findByStudentAndName(
        studentId: string,
        name: string,
    ): Promise<Repertoire | null> {
        const row = await this.prisma.repertoire.findUnique({
            where: { studentId_name: { studentId, name } },
        });
        return row ? toDomain(row) : null;
    }

    async update(repertoire: Repertoire): Promise<Repertoire> {
        const row = await this.prisma.repertoire.update({
            where: { id: repertoire.id },
            data: { name: repertoire.name },
        });
        return toDomain(row);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.repertoire.delete({ where: { id } });
    }
}
