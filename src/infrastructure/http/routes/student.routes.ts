import { Router } from 'express';
import { makeStudentController } from '@main/factories/make-student-controller.factory';
import { validate } from '@infrastructure/http/middlewares/validate';
import {
    createStudentBody,
    idParams,
    updateStudentBody,
} from '@infrastructure/http/validation/schemas';

export const studentRoutes = Router();
const studentController = makeStudentController();

studentRoutes.post('/', validate({ body: createStudentBody }), (req, res) => {
    return studentController.create(req, res);
});

studentRoutes.get('/', (req, res) => {
    return studentController.list(req, res);
});

studentRoutes.get('/:id', validate({ params: idParams }), (req, res) => {
    return studentController.getById(req, res);
});

studentRoutes.put(
    '/:id',
    validate({ params: idParams, body: updateStudentBody }),
    (req, res) => {
        return studentController.update(req, res);
    },
);

studentRoutes.delete('/:id', validate({ params: idParams }), (req, res) => {
    return studentController.delete(req, res);
});
