import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

// Recebe a URL por parâmetro: quem lê o ambiente é o main (composition root)
export function createPrismaClient(connectionString: string): PrismaClient {
    return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export type { PrismaClient };
