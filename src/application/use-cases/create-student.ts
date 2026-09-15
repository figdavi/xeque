import { Student } from '@domain/entities/student';
import { IStudentRepository } from '@domain/repositories/student.repository';
import { AppError } from '@domain/errors/app.error';

interface CreateStudentDTO {
    id: string;
    name: string;
    email: string;
    lichessUser: string;
}

export class CreateStudentUseCase {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(data: CreateStudentDTO): Promise<Student> {
        const studentAlreadyExists = await this.studentRepository.findByEmail(
            data.email,
        );

        if (studentAlreadyExists) {
            throw new AppError(
                'Estudante com este e-mail já está cadastrado.',
                400,
            );
        }

        const student = new Student(data);
        await this.studentRepository.create(student);
        return student;
    }
}
