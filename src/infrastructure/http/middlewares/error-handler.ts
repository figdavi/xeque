import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
    AppError,
    BusinessRuleError,
    ConflictError,
    ExternalServiceError,
    NotFoundError,
    ValidationError,
} from '@domain/errors/app.error';
import { Prisma } from '@infrastructure/database/prisma/generated/client';

// Cada erro do domínio vira um status HTTP. É aqui, e só aqui, que o
// domínio "encontra" o HTTP.
function statusFor(error: AppError): number {
    if (error instanceof ValidationError) return 400;
    if (error instanceof NotFoundError) return 404;
    if (error instanceof ConflictError) return 409;
    if (error instanceof BusinessRuleError) return 422;
    if (error instanceof ExternalServiceError) return 502;
    return 400;
}

function sendError(
    res: Response,
    statusCode: number,
    message: string,
    extra: Record<string, unknown> = {},
) {
    return res
        .status(statusCode)
        .json({ status: 'error', statusCode, message, ...extra });
}

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) {
    // 1. Payload inválido (Zod)
    if (error instanceof ZodError) {
        return sendError(res, 400, 'Dados da requisição inválidos.', {
            issues: error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }

    // 2. Erros conhecidos do domínio
    if (error instanceof AppError) {
        const details =
            error instanceof BusinessRuleError && error.details
                ? { details: error.details }
                : {};
        return sendError(res, statusFor(error), error.message, details);
    }

    // 3. JSON malformado no corpo (lançado pelo express.json())
    if (
        error instanceof SyntaxError &&
        (error as { type?: string }).type === 'entity.parse.failed'
    ) {
        return sendError(res, 400, 'JSON inválido no corpo da requisição.');
    }

    // 4. Violação de unicidade no banco que escapou das checagens dos use cases
    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
    ) {
        return sendError(res, 409, 'Registro duplicado.');
    }

    // 5. Log interno para erros não mapeados (Crashes/Bugs de runtime)
    console.error('💥 [Uncaught Exception]:', error);

    // 6. Resposta genérica para o cliente em caso de erro 500
    return sendError(res, 500, 'Erro interno no servidor.');
}
