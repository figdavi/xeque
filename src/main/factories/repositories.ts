import { env } from '@main/config/env';
import { createPrismaClient } from '@infrastructure/database/prisma/client';
import { PrismaStudentRepository } from '@infrastructure/database/prisma-student.repository';
import { PrismaOpeningRepository } from '@infrastructure/database/prisma-opening.repository';
import { PrismaRepertoireRepository } from '@infrastructure/database/prisma-repertoire.repository';
import { PrismaRepertoireLineRepository } from '@infrastructure/database/prisma-repertoire-line.repository';
import { LichessGateway } from '@infrastructure/providers/lichess.gateway';
import { CachedLichessGateway } from '@infrastructure/providers/cached-lichess.gateway';

// Repositórios compartilhados (uma instância de cada durante o runtime).
// Ficam num único módulo para que todas as factories usem as mesmas instâncias.
// Mudei para aqui porque repertoire usa student e opening.
//
// Trocar o banco é mudar só este arquivo: na Entrega 1 eram os
// InMemory*Repository; agora são os Prisma*Repository.
export const prisma = createPrismaClient(env.DATABASE_URL);

export const studentRepository = new PrismaStudentRepository(prisma);
export const openingRepository = new PrismaOpeningRepository(prisma);
export const repertoireRepository = new PrismaRepertoireRepository(prisma);
export const repertoireLineRepository = new PrismaRepertoireLineRepository(
    prisma,
);

// Gateway real "embrulhado" pelo cache (padrão decorator)
export const lichessGateway = new CachedLichessGateway(
    new LichessGateway(env.LICHESS_TOKEN),
);
