import { Repertoire } from '@domain/entities/repertoire';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

export class InMemoryRepertoireRepository implements IRepertoireRepository {
    public items: Repertoire[] = [];

    async create(repertoire: Repertoire): Promise<void> {
        this.items.push(repertoire);
    }

    async findById(id: string): Promise<Repertoire | null> {
        const repertoire = this.items.find((item) => item.id === id);
        if (!repertoire) return null;
        return repertoire;
    }

    async findByStudent(studentId: string): Promise<Repertoire[]> {
        return this.items.filter((item) => item.studentId === studentId);
    }

    async findByStudentAndName(
        studentId: string,
        name: string,
    ): Promise<Repertoire | null> {
        const repertoire = this.items.find(
            (item) => item.studentId === studentId && item.name === name,
        );
        if (!repertoire) return null;
        return repertoire;
    }

    async update(repertoire: Repertoire): Promise<Repertoire> {
        const index = this.items.findIndex((item) => item.id === repertoire.id);
        if (index === -1) {
            throw new Error('Repertório não encontrado.');
        }
        this.items[index] = repertoire;
        return repertoire;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) {
            throw new Error('Repertório não encontrado.');
        }
        this.items.splice(index, 1);
    }
}
