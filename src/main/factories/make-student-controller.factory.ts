import { ListStudentsUseCase } from '@application/use-cases/list-students';
import { CreateStudentUseCase } from '@application/use-cases/create-student';
import { GetStudentUseCase } from '@application/use-cases/get-student';
import { UpdateStudentUseCase } from '@application/use-cases/update-student';
import { DeleteStudentUseCase } from '@application/use-cases/delete-student';
import { StudentController } from '@infrastructure/http/controllers/student.controller';
import { studentRepository } from '@main/factories/repositories';

export function makeStudentController(): StudentController {
    const listStudentsUseCase = new ListStudentsUseCase(studentRepository);
    const createStudentUseCase = new CreateStudentUseCase(studentRepository);
    const getStudentUseCase = new GetStudentUseCase(studentRepository);
    const updateStudentUseCase = new UpdateStudentUseCase(studentRepository);
    const deleteStudentUseCase = new DeleteStudentUseCase(studentRepository);

    return new StudentController(
        listStudentsUseCase,
        createStudentUseCase,
        getStudentUseCase,
        updateStudentUseCase,
        deleteStudentUseCase,
    );
}
