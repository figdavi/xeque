import { Router } from 'express';
import { makeOpeningController } from '@main/factories/make-opening-controller.factory';

export const openingRoutes = Router();
const openingController = makeOpeningController();

openingRoutes.post('/', (req, res) => {
    return openingController.create(req, res);
});

openingRoutes.get('/', (req, res) => {
    return openingController.list(req, res);
});

openingRoutes.get('/:id', (req, res) => {
    return openingController.getById(req, res);
});

openingRoutes.put('/:id', (req, res) => {
    return openingController.update(req, res);
});

openingRoutes.delete('/:id', (req, res) => {
    return openingController.delete(req, res);
});
