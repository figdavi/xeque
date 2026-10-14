import {
    findRepertoireLine,
    findStudentRepertoire,
} from '@application/helpers/ownership';
import { NotFoundError } from '@domain/errors/app.error';
import {
    ILichessGateway,
    PlayerLineStats,
} from '@domain/gateways/lichess.gateway';
import { IRepertoireLineRepository } from '@domain/repositories/repertoire-line.repository';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';
import { IStudentRepository } from '@domain/repositories/student.repository';

interface GetRepertoireLineStatsDTO {
    studentId: string;
    repertoireId: string;
    lineId: string;
}

// Placar do estudante nas partidas que ele já jogou no Lichess com esta linha
export class GetRepertoireLineStatsUseCase {
    constructor(
        private studentRepository: IStudentRepository,
        private repertoireRepository: IRepertoireRepository,
        private lineRepository: IRepertoireLineRepository,
        private lichessGateway: ILichessGateway,
    ) {}

    async execute(data: GetRepertoireLineStatsDTO): Promise<PlayerLineStats> {
        const student = await this.studentRepository.findById(data.studentId);
        if (!student) {
            throw new NotFoundError('Estudante não encontrado.');
        }

        const repertoire = await findStudentRepertoire(
            this.repertoireRepository,
            student.id,
            data.repertoireId,
        );
        const line = await findRepertoireLine(
            this.lineRepository,
            repertoire.id,
            data.lineId,
        );

        return this.lichessGateway.getPlayerStats(
            student.lichessUser,
            repertoire.color,
            line.uci,
        );
    }
}
