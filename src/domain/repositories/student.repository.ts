import { Student } from '@domain/entities/student';

export interface IStudentRepository {
    create(student: Student): Promise<void>;
    findByEmail(email: string): Promise<Student | null>;
    findById(id: string): Promise<Student | null>;
    findAll(): Promise<Student[]>;
    update(student: Student): Promise<Student>;
    delete(id: string): Promise<void>;
}
