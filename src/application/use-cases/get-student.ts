import { Student } from '@domain/entities/student';
import { AppError } from '@domain/errors/app.error';
import { IStudentRepository } from '@domain/repositories/student.repository';

export class GetStudentUseCase {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(id: string): Promise<Student> {
        const student = await this.studentRepository.findById(id);

        if (!student) {
            throw new AppError('Estudante não encontrado.', 404);
        }

        return student;
    }
}
