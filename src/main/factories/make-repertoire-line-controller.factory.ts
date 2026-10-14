import { AddRepertoireLineUseCase } from '@application/use-cases/add-repertoire-line';
import { UpdateRepertoireLineUseCase } from '@application/use-cases/update-repertoire-line';
import { DeleteRepertoireLineUseCase } from '@application/use-cases/delete-repertoire-line';
import { GetRepertoireLineStatsUseCase } from '@application/use-cases/get-repertoire-line-stats';
import { RepertoireLineController } from '@infrastructure/http/controllers/repertoire-line.controller';
import {
    lichessGateway,
    openingRepository,
    repertoireLineRepository,
    repertoireRepository,
    studentRepository,
} from '@main/factories/repositories';

export function makeRepertoireLineController(): RepertoireLineController {
    const addRepertoireLineUseCase = new AddRepertoireLineUseCase(
        repertoireRepository,
        repertoireLineRepository,
        openingRepository,
    );
    const updateRepertoireLineUseCase = new UpdateRepertoireLineUseCase(
        repertoireRepository,
        repertoireLineRepository,
        openingRepository,
    );
    const deleteRepertoireLineUseCase = new DeleteRepertoireLineUseCase(
        repertoireRepository,
        repertoireLineRepository,
    );
    const getRepertoireLineStatsUseCase = new GetRepertoireLineStatsUseCase(
        studentRepository,
        repertoireRepository,
        repertoireLineRepository,
        lichessGateway,
    );

    return new RepertoireLineController(
        addRepertoireLineUseCase,
        updateRepertoireLineUseCase,
        deleteRepertoireLineUseCase,
        getRepertoireLineStatsUseCase,
    );
}
