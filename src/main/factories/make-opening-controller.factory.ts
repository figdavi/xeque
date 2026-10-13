import { CreateOpeningUseCase } from '@application/use-cases/create-opening';
import { ListOpeningsUseCase } from '@application/use-cases/list-openings';
import { GetOpeningUseCase } from '@application/use-cases/get-opening';
import { UpdateOpeningUseCase } from '@application/use-cases/update-opening';
import { DeleteOpeningUseCase } from '@application/use-cases/delete-opening';
import { OpeningController } from '@infrastructure/http/controllers/opening.controller';
import { openingRepository } from '@main/factories/repositories';

export function makeOpeningController(): OpeningController {
    const createOpeningUseCase = new CreateOpeningUseCase(openingRepository);
    const listOpeningsUseCase = new ListOpeningsUseCase(openingRepository);
    const getOpeningUseCase = new GetOpeningUseCase(openingRepository);
    const updateOpeningUseCase = new UpdateOpeningUseCase(openingRepository);
    const deleteOpeningUseCase = new DeleteOpeningUseCase(openingRepository);

    return new OpeningController(
        createOpeningUseCase,
        listOpeningsUseCase,
        getOpeningUseCase,
        updateOpeningUseCase,
        deleteOpeningUseCase,
    );
}
