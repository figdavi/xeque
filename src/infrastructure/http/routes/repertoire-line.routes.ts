import { Router } from 'express';
import { makeRepertoireLineController } from '@main/factories/make-repertoire-line-controller.factory';
import { validate } from '@infrastructure/http/middlewares/validate';
import {
    addLineBody,
    lineParams,
    repertoireParams,
    updateLineBody,
} from '@infrastructure/http/validation/schemas';

// mergeParams expõe :studentId e :repertoireId definidos em server.ts
export const repertoireLineRoutes = Router({ mergeParams: true });
const repertoireLineController = makeRepertoireLineController();

repertoireLineRoutes.post(
    '/',
    validate({ params: repertoireParams, body: addLineBody }),
    (req, res) => {
        return repertoireLineController.add(req, res);
    },
);

repertoireLineRoutes.put(
    '/:lineId',
    validate({ params: lineParams, body: updateLineBody }),
    (req, res) => {
        return repertoireLineController.update(req, res);
    },
);

repertoireLineRoutes.delete(
    '/:lineId',
    validate({ params: lineParams }),
    (req, res) => {
        return repertoireLineController.delete(req, res);
    },
);

repertoireLineRoutes.get(
    '/:lineId/stats',
    validate({ params: lineParams }),
    (req, res) => {
        return repertoireLineController.stats(req, res);
    },
);
