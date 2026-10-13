import { AppError } from '@domain/errors/app.error';

interface RepertoireProps {
    studentId: string;
    openingId: string;
    notes: string;
}

export class Repertoire {
    private props: RepertoireProps;
    private _id: string;

    constructor(props: RepertoireProps) {
        this.validate(props);
        this.props = props;
        this._id = crypto.randomUUID();
    }

    // studentId e openingId identificam o repertório e não são alteráveis
    update(changes: { notes: string }): void {
        this.props = {
            studentId: this.props.studentId,
            openingId: this.props.openingId,
            notes: changes.notes,
        };
    }

    private validate(props: RepertoireProps): void {
        if (!props.studentId) {
            throw new AppError('ID do estudante é obrigatório.', 400);
        }
        if (!props.openingId) {
            throw new AppError('ID da abertura é obrigatório.', 400);
        }
    }

    get id() {
        return this._id;
    }

    get studentId() {
        return this.props.studentId;
    }

    get openingId() {
        return this.props.openingId;
    }

    get notes() {
        return this.props.notes;
    }
}
