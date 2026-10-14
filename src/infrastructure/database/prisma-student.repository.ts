import { Student } from '@domain/entities/student';
import { IStudentRepository } from '@domain/repositories/student.repository';
import { PrismaClient } from './prisma/client';
import { Student as StudentRow } from './prisma/generated/client';

function toDomain(row: StudentRow): Student {
    return new Student(
        { name: row.name, email: row.email, lichessUser: row.lichessUser },
        row.id,
    );
}

export class PrismaStudentRepository implements IStudentRepository {
    constructor(private prisma: PrismaClient) {}

    async create(student: Student): Promise<void> {
        await this.prisma.student.create({
            data: {
                id: student.id,
                name: student.name,
                email: student.email,
                lichessUser: student.lichessUser,
            },
        });
    }

    async findByEmail(email: string): Promise<Student | null> {
        const row = await this.prisma.student.findUnique({ where: { email } });
        return row ? toDomain(row) : null;
    }

    async findById(id: string): Promise<Student | null> {
        const row = await this.prisma.student.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }

    async findAll(): Promise<Student[]> {
        const rows = await this.prisma.student.findMany({
            orderBy: { createdAt: 'asc' },
        });
        return rows.map(toDomain);
    }

    async update(student: Student): Promise<Student> {
        const row = await this.prisma.student.update({
            where: { id: student.id },
            data: {
                name: student.name,
                email: student.email,
                lichessUser: student.lichessUser,
            },
        });
        return toDomain(row);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.student.delete({ where: { id } });
    }
}
