import { Color } from '@domain/chess/line';
import { Repertoire } from '@domain/entities/repertoire';
import { ConflictError, NotFoundError } from '@domain/errors/app.error';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';
import { IStudentRepository } from '@domain/repositories/student.repository';

interface CreateRepertoireDTO {
    studentId: string;
    name: string;
    color: Color;
}

export class CreateRepertoireUseCase {
    constructor(
        private repertoireRepository: IRepertoireRepository,
        private studentRepository: IStudentRepository,
    ) {}

    async execute(data: CreateRepertoireDTO): Promise<Repertoire> {
        const student = await this.studentRepository.findById(data.studentId);
        if (!student) {
            throw new NotFoundError('Estudante não encontrado.');
        }

        const nameTaken = await this.repertoireRepository.findByStudentAndName(
            data.studentId,
            data.name,
        );
        if (nameTaken) {
            throw new ConflictError(
                'Este estudante já tem um repertório com esse nome.',
            );
        }

        const repertoire = new Repertoire(data);
        await this.repertoireRepository.create(repertoire);
        return repertoire;
    }
}
