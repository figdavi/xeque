import { Request, Response } from 'express';
import { ListStudentsUseCase } from '@application/use-cases/list-students';
import { CreateStudentUseCase } from '@application/use-cases/create-student';

export class StudentController {
    constructor(
        private listStudentsUseCase: ListStudentsUseCase,
        private createStudentUseCase: CreateStudentUseCase,
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        const { id, name, email, lichessUser } = req.body;
        const student = await this.createStudentUseCase.execute({
            id,
            name,
            email,
            lichessUser,
        });

        return res.status(201).json({
            message: 'Estudante criado com sucesso!',
            data: {
                id: student.id,
                name: student.name,
                email: student.email,
                lichessUser: student.lichessUser,
            },
        });
    }

    async list(req: Request, res: Response): Promise<Response> {
        const students = await this.listStudentsUseCase.execute();

        const formattedStudents = students.map((student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            lichessUser: student.lichessUser,
        }));

        return res.status(200).json({ data: formattedStudents });
    }
}
