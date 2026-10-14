// Abertura do catálogo oficial do Lichess (lichess-org/chess-openings).
// É somente leitura: o catálogo é mantido pelo script de sincronização.
interface OpeningProps {
    eco: string; // código ECO, ex.: B90
    name: string; // ex.: "Sicilian Defense: Najdorf Variation"
    pgn: string; // lances em SAN, ex.: "1. e4 c5 2. Nf3"
    uci: string[]; // mesmos lances em UCI, ex.: ['e2e4', 'c7c5', 'g1f3']
}

export class Opening {
    private props: OpeningProps;
    private _id: string;

    constructor(props: OpeningProps, id?: string) {
        this.props = props;
        this._id = id ?? crypto.randomUUID();
    }

    get id() {
        return this._id;
    }

    get eco() {
        return this.props.eco;
    }

    get name() {
        return this.props.name;
    }

    get pgn() {
        return this.props.pgn;
    }

    get uci() {
        return this.props.uci;
    }
}
