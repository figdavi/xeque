import { Request, Response } from 'express';
import { ListStudentsUseCase } from '@application/use-cases/list-students';
import { CreateStudentUseCase } from '@application/use-cases/create-student';
import { GetStudentUseCase } from '@application/use-cases/get-student';
import { UpdateStudentUseCase } from '@application/use-cases/update-student';
import { DeleteStudentUseCase } from '@application/use-cases/delete-student';
import { Student } from '@domain/entities/student';

function toResponse(student: Student) {
    return {
        id: student.id,
        name: student.name,
        email: student.email,
        lichessUser: student.lichessUser,
    };
}

export class StudentController {
    constructor(
        private listStudentsUseCase: ListStudentsUseCase,
        private createStudentUseCase: CreateStudentUseCase,
        private getStudentUseCase: GetStudentUseCase,
        private updateStudentUseCase: UpdateStudentUseCase,
        private deleteStudentUseCase: DeleteStudentUseCase,
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        const { name, email, lichessUser } = req.body;
        const student = await this.createStudentUseCase.execute({
            name,
            email,
            lichessUser,
        });

        return res.status(201).json({
            message: 'Estudante criado com sucesso!',
            data: toResponse(student),
        });
    }

    async list(req: Request, res: Response): Promise<Response> {
        const students = await this.listStudentsUseCase.execute();

        return res.status(200).json({ data: students.map(toResponse) });
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const id = String(req.params.id);
        const { student, ratings } = await this.getStudentUseCase.execute(id);

        return res
            .status(200)
            .json({ data: { ...toResponse(student), ratings } });
    }

    async update(req: Request, res: Response): Promise<Response> {
        const id = String(req.params.id);
        const { name, email, lichessUser } = req.body;

        const updatedStudent = await this.updateStudentUseCase.execute({
            id,
            name,
            email,
            lichessUser,
        });

        return res.status(200).json({
            message: 'Estudante atualizado com sucesso!',
            data: toResponse(updatedStudent),
        });
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const id = String(req.params.id);
        await this.deleteStudentUseCase.execute(id);
        return res.status(204).send();
    }
}
