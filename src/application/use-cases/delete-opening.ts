import { AppError } from '@domain/errors/app.error';
import { IOpeningRepository } from '@domain/repositories/opening.repository';

export class DeleteOpeningUseCase {
    constructor(private openingRepository: IOpeningRepository) {}

    async execute(id: string): Promise<void> {
        const existingOpening = await this.openingRepository.findById(id);

        if (!existingOpening) {
            throw new AppError('Abertura não encontrada.', 404);
        }

        await this.openingRepository.delete(id);
    }
}
