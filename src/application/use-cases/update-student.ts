import { Student } from '@domain/entities/student';
import { AppError } from '@domain/errors/app.error';
import { IStudentRepository } from '@domain/repositories/student.repository';

interface UpdateStudentDTO {
    id: string; // Usado apenas para busca
    name?: string;
    email?: string;
    lichessUser?: string;
}

export class UpdateStudentUseCase {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(data: UpdateStudentDTO): Promise<Student> {
        const existingStudent = await this.studentRepository.findById(data.id);
        if (!existingStudent) {
            throw new AppError('Estudante não encontrado.', 404);
        }

        if (data.email && data.email !== existingStudent.email) {
            const emailTaken = await this.studentRepository.findByEmail(
                data.email,
            );
            if (emailTaken) {
                throw new AppError(
                    'E-mail já está em uso por outro estudante.',
                    400,
                );
            }
        }

        existingStudent.update({
            name: data.name,
            email: data.email,
            lichessUser: data.lichessUser,
        });

        return await this.studentRepository.update(existingStudent);
    }
}
