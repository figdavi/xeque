import { RepertoireLine } from '@domain/entities/repertoire-line';

export interface IRepertoireLineRepository {
    create(line: RepertoireLine): Promise<void>;
    findById(id: string): Promise<RepertoireLine | null>;
    findByRepertoire(repertoireId: string): Promise<RepertoireLine[]>;
    update(line: RepertoireLine): Promise<RepertoireLine>;
    delete(id: string): Promise<void>;
}
