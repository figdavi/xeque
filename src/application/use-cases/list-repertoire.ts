import { Repertoire } from '@domain/entities/repertoire';
import { IRepertoireRepository } from '@domain/repositories/repertoire.repository';

export class ListRepertoireUseCase {
    constructor(private repertoireRepository: IRepertoireRepository) {}

    async execute(): Promise<Repertoire[]> {
        return await this.repertoireRepository.findAll();
    }
}
