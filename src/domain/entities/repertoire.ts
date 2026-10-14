import { Color, COLORS } from '@domain/chess/line';
import { ValidationError } from '@domain/errors/app.error';

// Um repertório nomeado do estudante para uma cor, ex.: "Pretas – principal".
// Um estudante pode ter vários repertórios da mesma cor.
interface RepertoireProps {
    studentId: string;
    name: string;
    color: Color;
}

export class Repertoire {
    private props: RepertoireProps;
    private _id: string;

    constructor(props: RepertoireProps, id?: string) {
        this.validate(props);
        this.props = props;
        this._id = id ?? crypto.randomUUID();
    }

    // estudante e cor não são alteráveis: as linhas dependem da cor
    update(changes: { name: string }): void {
        const next: RepertoireProps = {
            studentId: this.props.studentId,
            name: changes.name,
            color: this.props.color,
        };
        this.validate(next);
        this.props = next;
    }

    private validate(props: RepertoireProps): void {
        if (!props.studentId) {
            throw new ValidationError('ID do estudante é obrigatório.');
        }
        if (!props.name) {
            throw new ValidationError('Nome do repertório é obrigatório.');
        }
        if (!COLORS.includes(props.color)) {
            throw new ValidationError(
                "Cor do repertório deve ser 'white' ou 'black'.",
            );
        }
    }

    get id() {
        return this._id;
    }

    get studentId() {
        return this.props.studentId;
    }

    get name() {
        return this.props.name;
    }

    get color() {
        return this.props.color;
    }
}
