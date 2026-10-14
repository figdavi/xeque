import { Opening } from '@domain/entities/opening';
import { NotFoundError } from '@domain/errors/app.error';
import { IOpeningRepository } from '@domain/repositories/opening.repository';

export class GetOpeningUseCase {
    constructor(private openingRepository: IOpeningRepository) {}

    async execute(id: string): Promise<Opening> {
        const opening = await this.openingRepository.findById(id);

        if (!opening) {
            throw new NotFoundError('Abertura não encontrada.');
        }

        return opening;
    }
}
