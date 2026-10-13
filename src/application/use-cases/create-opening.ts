import { Opening } from '@domain/entities/opening';
import { IOpeningRepository } from '@domain/repositories/opening.repository';

interface OpeningDTO {
    openingName: string;
    color: 'white' | 'black';
    moves: string[];
}

export class CreateOpeningUseCase {
    constructor(private openingRepository: IOpeningRepository) {}

    async execute(data: OpeningDTO): Promise<Opening> {
        const opening = new Opening(data);
        await this.openingRepository.create(opening);
        return opening;
    }
}
