import { SearchOpeningsUseCase } from '@application/use-cases/search-openings';
import { GetOpeningUseCase } from '@application/use-cases/get-opening';
import { OpeningController } from '@infrastructure/http/controllers/opening.controller';
import { openingRepository } from '@main/factories/repositories';

export function makeOpeningController(): OpeningController {
    const searchOpeningsUseCase = new SearchOpeningsUseCase(openingRepository);
    const getOpeningUseCase = new GetOpeningUseCase(openingRepository);

    return new OpeningController(searchOpeningsUseCase, getOpeningUseCase);
}
