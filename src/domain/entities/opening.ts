import { AppError } from '@domain/errors/app.error';

export const OPENING_COLORS = ['white', 'black'] as const;
export type OpeningColor = (typeof OPENING_COLORS)[number];

export function isOpeningColor(value: unknown): value is OpeningColor {
    return OPENING_COLORS.includes(value as OpeningColor);
}

interface OpeningProps {
    openingName: string;
    color: OpeningColor;
    moves: string[];
}

export class Opening {
    private props: OpeningProps;
    private _id: string;

    constructor(props: OpeningProps) {
        this.validate(props);
        this.props = props;
        this._id = crypto.randomUUID();
    }

    update(changes: Partial<OpeningProps>): void {
        const next: OpeningProps = {
            openingName: changes.openingName ?? this.props.openingName,
            color: changes.color ?? this.props.color,
            moves: changes.moves ?? this.props.moves,
        };
        this.validate(next);
        this.props = next;
    }

    private validate(props: OpeningProps): void {
        if (!props.openingName) {
            throw new AppError('Nome da abertura é obrigatório.', 400);
        }
        if (!props.color) {
            throw new AppError('Cor da abertura é obrigatória.', 400);
        }
        if (!isOpeningColor(props.color)) {
            throw new AppError(
                "Cor da abertura deve ser 'white' ou 'black'.",
                400,
            );
        }
        if (!props.moves || props.moves.length === 0) {
            throw new AppError('Movimentos da abertura são obrigatórios.', 400);
        }
    }

    get id() {
        return this._id;
    }

    get openingName() {
        return this.props.openingName;
    }

    get color() {
        return this.props.color;
    }

    get moves() {
        return this.props.moves;
    }
}
