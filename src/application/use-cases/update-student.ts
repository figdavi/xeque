import { Student } from '@domain/entities/student';
import {
    BusinessRuleError,
    ConflictError,
    NotFoundError,
} from '@domain/errors/app.error';
import { ILichessGateway } from '@domain/gateways/lichess.gateway';
import { IStudentRepository } from '@domain/repositories/student.repository';

interface UpdateStudentDTO {
    id: string; // Usado apenas para busca
    name?: string;
    email?: string;
    lichessUser?: string;
}

export class UpdateStudentUseCase {
    constructor(
        private studentRepository: IStudentRepository,
        private lichessGateway: ILichessGateway,
    ) {}

    async execute(data: UpdateStudentDTO): Promise<Student> {
        const existingStudent = await this.studentRepository.findById(data.id);
        if (!existingStudent) {
            throw new NotFoundError('Estudante não encontrado.');
        }

        if (data.email && data.email !== existingStudent.email) {
            const emailTaken = await this.studentRepository.findByEmail(
                data.email,
            );
            if (emailTaken) {
                throw new ConflictError(
                    'E-mail já está em uso por outro estudante.',
                );
            }
        }

        if (
            data.lichessUser &&
            data.lichessUser !== existingStudent.lichessUser
        ) {
            const lichessUser = await this.lichessGateway.getUser(
                data.lichessUser,
            );
            if (!lichessUser) {
                throw new BusinessRuleError(
                    `Usuário "${data.lichessUser}" não existe no Lichess.`,
                );
            }
        }

        existingStudent.update({
            name: data.name,
            email: data.email,
            lichessUser: data.lichessUser,
        });

        return await this.studentRepository.update(existingStudent);
    }
}
