import { Opening } from '@domain/entities/opening';
import { AppError } from '@domain/errors/app.error';
import { IOpeningRepository } from '@domain/repositories/opening.repository';

interface UpdateOpeningDTO {
    id: string;
    openingName?: string;
    color?: 'white' | 'black';
    moves?: string[];
}

export class UpdateOpeningUseCase {
    constructor(private openingRepository: IOpeningRepository) {}

    async execute(data: UpdateOpeningDTO): Promise<Opening> {
        const existingOpening = await this.openingRepository.findById(data.id);

        if (!existingOpening) {
            throw new AppError('Abertura não encontrada.', 404);
        }

        existingOpening.update({
            openingName: data.openingName,
            color: data.color,
            moves: data.moves,
        });

        return await this.openingRepository.update(existingOpening);
    }
}
