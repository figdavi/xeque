import { AppError } from '@domain/errors/app.error';

interface StudentProps {
    name: string;
    email: string;
    lichessUser: string; // Acoplamento?
}

export class Student {
    private props: StudentProps;
    private _id: string;

    constructor(props: StudentProps) {
        this.validate(props);
        this._id = crypto.randomUUID();
        this.props = props;
    }

    update(changes: Partial<StudentProps>): void {
        const next: StudentProps = {
            name: changes.name ?? this.props.name,
            email: changes.email ?? this.props.email,
            lichessUser: changes.lichessUser ?? this.props.lichessUser,
        };
        this.validate(next);
        this.props = next;
    }

    private validate(props: StudentProps): void {
        if (!props.name) {
            throw new AppError('Nome do estudante é obrigatório.', 400);
        }
        if (!props.email) {
            throw new AppError('E-mail do estudante é obrigatório.', 400);
        }
        if (!props.lichessUser) {
            throw new AppError('Usuário do Lichess é obrigatório.', 400);
        }
    }

    get id() {
        return this._id;
    }

    get name() {
        return this.props.name;
    }

    get email() {
        return this.props.email;
    }

    get lichessUser() {
        return this.props.lichessUser;
    }
}
