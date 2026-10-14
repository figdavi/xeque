import { Router } from 'express';
import { makeExplorerController } from '@main/factories/make-explorer-controller.factory';
import { validate } from '@infrastructure/http/middlewares/validate';
import { explorerQuery } from '@infrastructure/http/validation/schemas';

export const explorerRoutes = Router();
const explorerController = makeExplorerController();

explorerRoutes.get('/', validate({ query: explorerQuery }), (req, res) => {
    return explorerController.getPositionStats(req, res);
});
