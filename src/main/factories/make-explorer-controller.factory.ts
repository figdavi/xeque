import { GetPositionStatsUseCase } from '@application/use-cases/get-position-stats';
import { ExplorerController } from '@infrastructure/http/controllers/explorer.controller';
import { lichessGateway } from '@main/factories/repositories';

export function makeExplorerController(): ExplorerController {
    const getPositionStatsUseCase = new GetPositionStatsUseCase(lichessGateway);

    return new ExplorerController(getPositionStatsUseCase);
}
