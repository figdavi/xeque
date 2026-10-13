import { Router } from 'express';
import { makeStudentController } from '@main/factories/make-student-controller.factory';

export const studentRoutes = Router();
const studentController = makeStudentController();

studentRoutes.post('/', (req, res) => {
    return studentController.create(req, res);
});

studentRoutes.get('/', (req, res) => {
    return studentController.list(req, res);
});

studentRoutes.get('/:id', (req, res) => {
    return studentController.getById(req, res);
});

studentRoutes.put('/:id', (req, res) => {
    return studentController.update(req, res);
});

studentRoutes.delete('/:id', (req, res) => {
    return studentController.delete(req, res);
});
