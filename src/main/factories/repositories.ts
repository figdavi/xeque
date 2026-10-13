import { InMemoryStudentRepository } from '@infrastructure/database/in-memory-student.repository';
import { InMemoryOpeningRepository } from '@infrastructure/database/in-memory-opening.repository';
import { InMemoryRepertoireRepository } from '@infrastructure/database/in-memory-repertoire.repository';

// Repositórios compartilhados (Singletons em memória durante o runtime).
// Ficam num único módulo para que todas as factories usem as mesmas instâncias.
// Mudei para aqui porque repertoire usa student e opening.
export const studentRepository = new InMemoryStudentRepository();
export const openingRepository = new InMemoryOpeningRepository();
export const repertoireRepository = new InMemoryRepertoireRepository();
