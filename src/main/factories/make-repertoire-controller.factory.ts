import { CreateRepertoireUseCase } from '@application/use-cases/create-repertoire';
import { ListStudentRepertoireUseCase } from '@application/use-cases/list-student-repertoire';
import { UpdateRepertoireUseCase } from '@application/use-cases/update-repertoire';
import { DeleteRepertoireUseCase } from '@application/use-cases/delete-repertoire';
import { RepertoireController } from '@infrastructure/http/controllers/repertoire.controller';
import {
    openingRepository,
    repertoireRepository,
    studentRepository,
} from '@main/factories/repositories';

export function makeRepertoireController(): RepertoireController {
    const createRepertoireUseCase = new CreateRepertoireUseCase(
        repertoireRepository,
        studentRepository,
        openingRepository,
    );
    const listStudentRepertoireUseCase = new ListStudentRepertoireUseCase(
        repertoireRepository,
        studentRepository,
    );
    const updateRepertoireUseCase = new UpdateRepertoireUseCase(
        repertoireRepository,
    );
    const deleteRepertoireUseCase = new DeleteRepertoireUseCase(
        repertoireRepository,
    );

    return new RepertoireController(
        createRepertoireUseCase,
        listStudentRepertoireUseCase,
        updateRepertoireUseCase,
        deleteRepertoireUseCase,
    );
}
