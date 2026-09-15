interface RepertoireEntryProps {
    id: string;
    openingName: string;
    color: 'white' | 'black';
    moves: string[];
    assignedAt: Date;
}

export class RepertoireEntry {
    private props: RepertoireEntryProps;

    constructor(props: RepertoireEntryProps) {
        this.props = props;
    }

    get id() {
        return this.props.id;
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

    get assignedAt() {
        return this.props.assignedAt;
    }
}
