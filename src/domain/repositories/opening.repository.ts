import { Opening, OpeningColor } from '@domain/entities/opening';

export interface OpeningFilter {
    color?: OpeningColor;
    name?: string;
}

export interface IOpeningRepository {
    create(opening: Opening): Promise<void>;
    findById(id: string): Promise<Opening | null>;
    findAll(filter?: OpeningFilter): Promise<Opening[]>;
    update(opening: Opening): Promise<Opening>; // Add partial for patch later
    delete(id: string): Promise<void>;
}
