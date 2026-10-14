import { Student } from '@domain/entities/student';
import { IStudentRepository } from '@domain/repositories/student.repository';

export class InMemoryStudentRepository implements IStudentRepository {
    public items: Student[] = [];

    async create(student: Student): Promise<void> {
        this.items.push(student);
    }

    async findByEmail(email: string): Promise<Student | null> {
        const student = this.items.find((item) => item.email === email);
        if (!student) return null;
        return student;
    }

    async findById(id: string): Promise<Student | null> {
        const student = this.items.find((item) => item.id === id);
        if (!student) return null;
        return student;
    }

    async findAll(): Promise<Student[]> {
        return this.items;
    }

    async update(student: Student): Promise<Student> {
        const index = this.items.findIndex((item) => item.id === student.id);
        if (index === -1) {
            throw new Error('Estudante não encontrado.');
        }
        this.items[index] = student;
        return student;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) {
            throw new Error('Estudante não encontrado.');
        }
        this.items.splice(index, 1);
    }
}
