import { Repertoire } from '@domain/entities/repertoire';

export interface IRepertoireRepository {
    create(repertoire: Repertoire): Promise<void>;
    findById(id: string): Promise<Repertoire | null>;
    findByStudent(studentId: string): Promise<Repertoire[]>;
    findByStudentAndName(
        studentId: string,
        name: string,
    ): Promise<Repertoire | null>;
    update(repertoire: Repertoire): Promise<Repertoire>;
    delete(id: string): Promise<void>;
}
