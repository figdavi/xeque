import { AppError } from '@domain/errors/app.error';
import { RepertoireEntry } from './repertoire-entry';

interface StudentProps {
    id: string;
    name: string;
    email: string;
    lichessUser: string; // Acoplamento?
    repertoire?: RepertoireEntry[] | null;
}

export class Student {
    private props: StudentProps;

    constructor(props: StudentProps) {
        if (!props.repertoire) {
            props.repertoire = null;
        }

        if (!props.id || !props.name || !props.email || !props.lichessUser) {
            throw new AppError(
                'Todos os campos obrigatórios devem ser fornecidos.',
            );
        }

        this.props = props;
    }

    get id() {
        return this.props.id;
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
    get repertoire() {
        return this.props.repertoire;
    }
}
