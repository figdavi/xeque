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

    async findAll(): Promise<Student[]> {
        return this.items;
    }
}
