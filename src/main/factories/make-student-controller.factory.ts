import { ListStudentsUseCase } from '@application/use-cases/list-students';
import { CreateStudentUseCase } from '@application/use-cases/create-student';
import { StudentController } from '@infrastructure/http/controllers/student.controller';
import { InMemoryStudentRepository } from '@infrastructure/database/in-memory-student.repository';

// Repositório compartilhado (Singleton em memória durante o runtime)
const studentRepository = new InMemoryStudentRepository();

export function makeStudentController(): StudentController {
    const listStudentsUseCase = new ListStudentsUseCase(studentRepository);
    const createStudentUseCase = new CreateStudentUseCase(studentRepository);

    return new StudentController(listStudentsUseCase, createStudentUseCase);
}
