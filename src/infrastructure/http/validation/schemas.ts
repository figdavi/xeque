import { z } from 'zod';
import { COLORS, tokenizeMoves } from '@domain/chess/line';

// Mensagens padrão do Zod em português
z.config(z.locales.ptBR());

// Schemas de cada requisição. O Zod confere FORMATO (tipos, tamanhos, uuid);
// a legalidade dos lances e as regras de negócio ficam no domínio.

// "1. e4 c5 2. Nf3" ou "e4 c5 Nf3" -> ['e4', 'c5', 'Nf3']
const movesText = z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .transform(tokenizeMoves)
    .pipe(z.array(z.string()).min(1).max(80));

const name = z.string().trim().min(1).max(100);

// --- params ---
export const idParams = z.object({ id: z.uuid() });
export const studentParams = z.object({ studentId: z.uuid() });
export const repertoireParams = studentParams.extend({
    repertoireId: z.uuid(),
});
export const lineParams = repertoireParams.extend({ lineId: z.uuid() });

// --- students ---
export const createStudentBody = z.object({
    name,
    email: z.email(),
    lichessUser: z
        .string()
        .trim()
        .regex(
            /^[A-Za-z0-9_-]{2,30}$/,
            'Usuário do Lichess deve ter de 2 a 30 caracteres (letras, números, _ ou -).',
        ),
});

export const updateStudentBody = createStudentBody
    .partial()
    .refine((body) => Object.values(body).some((v) => v !== undefined), {
        message: 'Informe ao menos um campo para atualizar.',
    });

// --- openings ---
export const searchOpeningsQuery = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    eco: z
        .string()
        .regex(/^[A-Ea-e]\d{2}$/, 'Código ECO inválido (ex.: B90).')
        .optional(),
    moves: movesText.optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
});

// --- explorer ---
export const explorerQuery = z.object({
    // vazio ou ausente = posição inicial
    moves: z
        .string()
        .trim()
        .max(1000)
        .optional()
        .transform((text) => (text ? tokenizeMoves(text) : [])),
});

// --- repertoires ---
export const createRepertoireBody = z.object({
    name,
    color: z.enum(COLORS),
});

export const updateRepertoireBody = z.object({ name });

// --- repertoire lines ---
export const addLineBody = z.object({
    moves: movesText,
    notes: z.string().max(2000).optional(),
});

export const updateLineBody = z.object({
    notes: z.string().max(2000),
});

export type CreateStudentBody = z.infer<typeof createStudentBody>;
export type UpdateStudentBody = z.infer<typeof updateStudentBody>;
export type SearchOpeningsQuery = z.infer<typeof searchOpeningsQuery>;
export type ExplorerQuery = z.infer<typeof explorerQuery>;
export type CreateRepertoireBody = z.infer<typeof createRepertoireBody>;
export type UpdateRepertoireBody = z.infer<typeof updateRepertoireBody>;
export type AddLineBody = z.infer<typeof addLineBody>;
export type UpdateLineBody = z.infer<typeof updateLineBody>;
