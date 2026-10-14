import { ValidationError } from '@domain/errors/app.error';

// Uma linha de um repertório, ex.: 1. e4 c5 2. Nf3 d6
interface RepertoireLineProps {
    repertoireId: string;
    moves: string[]; // SAN
    uci: string[]; // mesmos lances em UCI
    openingId: string | null; // abertura do catálogo que melhor descreve a linha
    notes: string;
}

export class RepertoireLine {
    private props: RepertoireLineProps;
    private _id: string;

    constructor(props: RepertoireLineProps, id?: string) {
        this.validate(props);
        this.props = props;
        this._id = id ?? crypto.randomUUID();
    }

    // repertório e lances identificam a linha e não são alteráveis
    update(changes: { notes: string }): void {
        this.props = {
            repertoireId: this.props.repertoireId,
            moves: this.props.moves,
            uci: this.props.uci,
            openingId: this.props.openingId,
            notes: changes.notes,
        };
    }

    private validate(props: RepertoireLineProps): void {
        if (!props.repertoireId) {
            throw new ValidationError('ID do repertório é obrigatório.');
        }
        if (props.moves.length === 0) {
            throw new ValidationError('A linha precisa de ao menos um lance.');
        }
    }

    get id() {
        return this._id;
    }

    get repertoireId() {
        return this.props.repertoireId;
    }

    get moves() {
        return this.props.moves;
    }

    get uci() {
        return this.props.uci;
    }

    get openingId() {
        return this.props.openingId;
    }

    get notes() {
        return this.props.notes;
    }
}
