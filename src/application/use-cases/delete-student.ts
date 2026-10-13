import { AppError } from '@domain/errors/app.error';
import { IStudentRepository } from '@domain/repositories/student.repository';

export class DeleteStudentUseCase {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(id: string): Promise<void> {
        const existingStudent = await this.studentRepository.findById(id);

        if (!existingStudent) {
            throw new AppError('Estudante não encontrado.', 404);
        }

        await this.studentRepository.delete(id);
    }
}
