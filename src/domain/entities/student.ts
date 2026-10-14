import { ValidationError } from '@domain/errors/app.error';

interface StudentProps {
    name: string;
    email: string;
    lichessUser: string; // Acoplamento?
}

export class Student {
    private props: StudentProps;
    private _id: string;

    // id só é passado ao reconstruir um estudante que já existe (ex.: lido do banco)
    constructor(props: StudentProps, id?: string) {
        this.validate(props);
        this._id = id ?? crypto.randomUUID();
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
            throw new ValidationError('Nome do estudante é obrigatório.');
        }
        if (!props.email) {
            throw new ValidationError('E-mail do estudante é obrigatório.');
        }
        if (!props.lichessUser) {
            throw new ValidationError('Usuário do Lichess é obrigatório.');
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
