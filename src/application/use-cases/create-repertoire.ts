import { Repertoire } from '@domain/entities/repertoire';
import { AppError } from '@domain/errors/app.error';
import { IOpeningRepository } from '@domain/repositories/opening.repository';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';
import { IStudentRepository } from '@domain/repositories/student.repository';

interface CreateRepertoireDTO {
    studentId: string;
    openingId: string;
    notes?: string;
}

export class CreateRepertoireUseCase {
    constructor(
        private repertoireRepository: IRepertoireRepository,
        private studentRepository: IStudentRepository,
        private openingRepository: IOpeningRepository,
    ) {}

    async execute(data: CreateRepertoireDTO): Promise<Repertoire> {
        const student = await this.studentRepository.findById(data.studentId);
        if (!student) {
            throw new AppError('Estudante não encontrado.', 404);
        }

        if (!data.openingId) {
            throw new AppError('ID da abertura é obrigatório.', 400);
        }

        const opening = await this.openingRepository.findById(data.openingId);
        if (!opening) {
            throw new AppError('Abertura não encontrada.', 404);
        }

        const alreadyExists =
            await this.repertoireRepository.findByStudentAndOpening(
                data.studentId,
                data.openingId,
            );

        if (alreadyExists) {
            throw new AppError(
                'Este estudante já possui um repertório para esta abertura.',
                400,
            );
        }

        const repertoire = new Repertoire({
            studentId: data.studentId,
            openingId: data.openingId,
            notes: data.notes ?? '',
        });

        await this.repertoireRepository.create(repertoire);
        return repertoire;
    }
}
