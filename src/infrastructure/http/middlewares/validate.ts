import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

interface RequestSchemas {
    params?: ZodType;
    body?: ZodType;
    query?: ZodType;
}

// Valida params, body e query com Zod antes de chegar ao controller.
// Se algo for inválido, o parse lança ZodError e o errorHandler responde 400.
//
// O resultado já convertido (ex.: "e4 c5" -> ['e4', 'c5'], "20" -> 20)
// substitui req.params e req.body. A query vai para res.locals.query,
// porque no Express 5 req.query é somente leitura.
export function validate(schemas: RequestSchemas) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (schemas.params) {
            req.params = schemas.params.parse(req.params) as Request['params'];
        }
        if (schemas.body) {
            req.body = schemas.body.parse(req.body ?? {});
        }
        if (schemas.query) {
            res.locals.query = schemas.query.parse(req.query);
        }
        next();
    };
}
