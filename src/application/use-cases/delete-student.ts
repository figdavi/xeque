import { NotFoundError } from '@domain/errors/app.error';
import { IStudentRepository } from '@domain/repositories/student.repository';

export class DeleteStudentUseCase {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(id: string): Promise<void> {
        const existingStudent = await this.studentRepository.findById(id);

        if (!existingStudent) {
            throw new NotFoundError('Estudante não encontrado.');
        }

        // Repertórios e linhas do estudante são removidos em cascata pelo banco
        await this.studentRepository.delete(id);
    }
}
