import { Student } from '@domain/entities/student';
import { BusinessRuleError, ConflictError } from '@domain/errors/app.error';
import { ILichessGateway } from '@domain/gateways/lichess.gateway';
import { IStudentRepository } from '@domain/repositories/student.repository';

interface CreateStudentDTO {
    name: string;
    email: string;
    lichessUser: string;
}

export class CreateStudentUseCase {
    constructor(
        private studentRepository: IStudentRepository,
        private lichessGateway: ILichessGateway,
    ) {}

    async execute(data: CreateStudentDTO): Promise<Student> {
        const studentAlreadyExists = await this.studentRepository.findByEmail(
            data.email,
        );

        if (studentAlreadyExists) {
            throw new ConflictError(
                'Estudante com este e-mail já está cadastrado.',
            );
        }

        const lichessUser = await this.lichessGateway.getUser(data.lichessUser);
        if (!lichessUser) {
            throw new BusinessRuleError(
                `Usuário "${data.lichessUser}" não existe no Lichess.`,
            );
        }

        const student = new Student(data);
        await this.studentRepository.create(student);
        return student;
    }
}
