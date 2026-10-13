import { Router } from 'express';
import { makeRepertoireController } from '@main/factories/make-repertoire-controller.factory';

// mergeParams expõe o :studentId definido no ponto de montagem (server.ts)
export const repertoireRoutes = Router({ mergeParams: true });
const repertoireController = makeRepertoireController();

repertoireRoutes.post('/', (req, res) => {
    return repertoireController.create(req, res);
});

repertoireRoutes.get('/', (req, res) => {
    return repertoireController.list(req, res);
});

repertoireRoutes.put('/:openingId', (req, res) => {
    return repertoireController.update(req, res);
});

repertoireRoutes.delete('/:openingId', (req, res) => {
    return repertoireController.delete(req, res);
});
