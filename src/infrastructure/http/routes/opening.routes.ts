import { Router } from 'express';
import { makeOpeningController } from '@main/factories/make-opening-controller.factory';
import { validate } from '@infrastructure/http/middlewares/validate';
import {
    idParams,
    searchOpeningsQuery,
} from '@infrastructure/http/validation/schemas';

// Catálogo somente leitura: mantido por `npm run openings:sync`
export const openingRoutes = Router();
const openingController = makeOpeningController();

openingRoutes.get('/', validate({ query: searchOpeningsQuery }), (req, res) => {
    return openingController.search(req, res);
});

openingRoutes.get('/:id', validate({ params: idParams }), (req, res) => {
    return openingController.getById(req, res);
});
