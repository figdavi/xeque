import { isOpeningColor, Opening } from '@domain/entities/opening';
import { AppError } from '@domain/errors/app.error';
import {
    IOpeningRepository,
    OpeningFilter,
} from '@domain/repositories/opening.repository';

interface ListOpeningsDTO {
    color?: string;
    name?: string;
}

export class ListOpeningsUseCase {
    constructor(private openingRepository: IOpeningRepository) {}

    async execute(data: ListOpeningsDTO = {}): Promise<Opening[]> {
        const filter: OpeningFilter = {};

        if (data.color !== undefined) {
            if (!isOpeningColor(data.color)) {
                throw new AppError(
                    "Filtro 'color' deve ser 'white' ou 'black'.",
                    400,
                );
            }
            filter.color = data.color;
        }

        if (data.name) {
            filter.name = data.name;
        }

        return this.openingRepository.findAll(filter);
    }
}
