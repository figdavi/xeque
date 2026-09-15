import express from 'express';
import { studentRoutes } from '@infrastructure/http/routes/student.routes';
import { errorHandler } from '@infrastructure/http/middlewares/error-handler';

const app = express();

app.use(express.json());

app.use('/api/v1/students', studentRoutes);
app.use(errorHandler);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`🚀 [server]: Servidor rodando em http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    return res.json({ message: 'Bem-vindo à API de Estudantes!' });
});
