import { CreateRepertoireUseCase } from '@application/use-cases/create-repertoire';
import { ListRepertoiresUseCase } from '@application/use-cases/list-repertoires';
import { GetRepertoireUseCase } from '@application/use-cases/get-repertoire';
import { UpdateRepertoireUseCase } from '@application/use-cases/update-repertoire';
import { DeleteRepertoireUseCase } from '@application/use-cases/delete-repertoire';
import { RepertoireController } from '@infrastructure/http/controllers/repertoire.controller';
import {
    openingRepository,
    repertoireLineRepository,
    repertoireRepository,
    studentRepository,
} from '@main/factories/repositories';

export function makeRepertoireController(): RepertoireController {
    const createRepertoireUseCase = new CreateRepertoireUseCase(
        repertoireRepository,
        studentRepository,
    );
    const listRepertoiresUseCase = new ListRepertoiresUseCase(
        repertoireRepository,
        studentRepository,
    );
    const getRepertoireUseCase = new GetRepertoireUseCase(
        repertoireRepository,
        repertoireLineRepository,
        openingRepository,
    );
    const updateRepertoireUseCase = new UpdateRepertoireUseCase(
        repertoireRepository,
    );
    const deleteRepertoireUseCase = new DeleteRepertoireUseCase(
        repertoireRepository,
    );

    return new RepertoireController(
        createRepertoireUseCase,
        listRepertoiresUseCase,
        getRepertoireUseCase,
        updateRepertoireUseCase,
        deleteRepertoireUseCase,
    );
}
