import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { studentRoutes } from '@infrastructure/http/routes/student.routes';
import { openingRoutes } from '@infrastructure/http/routes/opening.routes';
import { repertoireRoutes } from '@infrastructure/http/routes/repertoire.routes';
import { errorHandler } from '@infrastructure/http/middlewares/error-handler';
import { openApiDocument } from '@infrastructure/http/docs/openapi';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        message: 'Bem-vindo à API Xeque!',
        docs: '/api/docs',
    });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api/v1/students/:studentId/repertoire', repertoireRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/openings', openingRoutes);
app.use(errorHandler);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`🚀 [server]: Servidor rodando em http://localhost:${PORT}`);
});
