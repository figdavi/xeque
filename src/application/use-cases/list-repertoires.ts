import { Repertoire } from '@domain/entities/repertoire';
import { NotFoundError } from '@domain/errors/app.error';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';
import { IStudentRepository } from '@domain/repositories/student.repository';

export class ListRepertoiresUseCase {
    constructor(
        private repertoireRepository: IRepertoireRepository,
        private studentRepository: IStudentRepository,
    ) {}

    async execute(studentId: string): Promise<Repertoire[]> {
        const student = await this.studentRepository.findById(studentId);
        if (!student) {
            throw new NotFoundError('Estudante não encontrado.');
        }

        return await this.repertoireRepository.findByStudent(studentId);
    }
}
