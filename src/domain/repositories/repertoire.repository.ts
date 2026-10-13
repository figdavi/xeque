import { Repertoire } from '@domain/entities/repertoire';

export interface IRepertoireRepository {
    create(repertoire: Repertoire): Promise<void>;
    findById(id: string): Promise<Repertoire | null>;
    findByStudentId(studentId: string): Promise<Repertoire[]>;
    findByStudentAndOpening(
        studentId: string,
        openingId: string,
    ): Promise<Repertoire | null>;
    findAll(): Promise<Repertoire[]>;
    update(repertoire: Repertoire): Promise<Repertoire>;
    delete(id: string): Promise<void>;
}
