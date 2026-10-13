import { Student } from '@domain/entities/student';
import { IStudentRepository } from '@domain/repositories/student.repository';

export class ListStudentsUseCase {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(): Promise<Student[]> {
        return await this.studentRepository.findAll();
    }
}
