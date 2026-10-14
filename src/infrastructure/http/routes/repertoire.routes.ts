import { Router } from 'express';
import { makeRepertoireController } from '@main/factories/make-repertoire-controller.factory';
import { validate } from '@infrastructure/http/middlewares/validate';
import {
    createRepertoireBody,
    repertoireParams,
    studentParams,
    updateRepertoireBody,
} from '@infrastructure/http/validation/schemas';

// mergeParams expõe o :studentId definido no ponto de montagem (server.ts)
export const repertoireRoutes = Router({ mergeParams: true });
const repertoireController = makeRepertoireController();

repertoireRoutes.post(
    '/',
    validate({ params: studentParams, body: createRepertoireBody }),
    (req, res) => {
        return repertoireController.create(req, res);
    },
);

repertoireRoutes.get('/', validate({ params: studentParams }), (req, res) => {
    return repertoireController.list(req, res);
});

repertoireRoutes.get(
    '/:repertoireId',
    validate({ params: repertoireParams }),
    (req, res) => {
        return repertoireController.getById(req, res);
    },
);

repertoireRoutes.put(
    '/:repertoireId',
    validate({ params: repertoireParams, body: updateRepertoireBody }),
    (req, res) => {
        return repertoireController.update(req, res);
    },
);

repertoireRoutes.delete(
    '/:repertoireId',
    validate({ params: repertoireParams }),
    (req, res) => {
        return repertoireController.delete(req, res);
    },
);
