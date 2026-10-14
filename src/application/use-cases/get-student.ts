import { Student } from '@domain/entities/student';
import { ExternalServiceError, NotFoundError } from '@domain/errors/app.error';
import { ILichessGateway, LichessUser } from '@domain/gateways/lichess.gateway';
import { IStudentRepository } from '@domain/repositories/student.repository';

interface GetStudentResult {
    student: Student;
    // null se o Lichess estiver fora do ar: a resposta não depende dele
    ratings: LichessUser['ratings'] | null;
}

export class GetStudentUseCase {
    constructor(
        private studentRepository: IStudentRepository,
        private lichessGateway: ILichessGateway,
    ) {}

    async execute(id: string): Promise<GetStudentResult> {
        const student = await this.studentRepository.findById(id);

        if (!student) {
            throw new NotFoundError('Estudante não encontrado.');
        }

        let ratings: LichessUser['ratings'] | null = null;
        try {
            const lichessUser = await this.lichessGateway.getUser(
                student.lichessUser,
            );
            ratings = lichessUser?.ratings ?? null;
        } catch (error) {
            if (!(error instanceof ExternalServiceError)) throw error;
        }

        return { student, ratings };
    }
}
