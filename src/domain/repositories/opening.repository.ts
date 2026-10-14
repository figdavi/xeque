import { Opening } from '@domain/entities/opening';

export interface OpeningFilter {
    name?: string; // trecho do nome, sem diferenciar maiúsculas
    eco?: string; // código exato, ex.: B90
    uciPrefix?: string[]; // aberturas que começam com estes lances
}

export interface Page {
    limit: number;
    offset: number;
}

export interface IOpeningRepository {
    findById(id: string): Promise<Opening | null>;
    search(
        filter: OpeningFilter,
        page: Page,
    ): Promise<{ items: Opening[]; total: number }>;
    // abertura mais longa do catálogo cujos lances são prefixo de `uci`
    findLongestPrefix(uci: string[]): Promise<Opening | null>;
}
