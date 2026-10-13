import { Repertoire } from '@domain/entities/repertoire';
import { AppError } from '@domain/errors/app.error';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';
import { IStudentRepository } from '@domain/repositories/student.repository';

export class ListStudentRepertoireUseCase {
    constructor(
        private repertoireRepository: IRepertoireRepository,
        private studentRepository: IStudentRepository,
    ) {}

    async execute(studentId: string): Promise<Repertoire[]> {
        const student = await this.studentRepository.findById(studentId);
        if (!student) {
            throw new AppError('Estudante não encontrado.', 404);
        }

        return await this.repertoireRepository.findByStudentId(studentId);
    }
}
