import { env } from '@main/config/env';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { studentRoutes } from '@infrastructure/http/routes/student.routes';
import { openingRoutes } from '@infrastructure/http/routes/opening.routes';
import { explorerRoutes } from '@infrastructure/http/routes/explorer.routes';
import { repertoireRoutes } from '@infrastructure/http/routes/repertoire.routes';
import { repertoireLineRoutes } from '@infrastructure/http/routes/repertoire-line.routes';
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
app.use(
    '/api/v1/students/:studentId/repertoires/:repertoireId/lines',
    repertoireLineRoutes,
);
app.use('/api/v1/students/:studentId/repertoires', repertoireRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/openings', openingRoutes);
app.use('/api/v1/explorer', explorerRoutes);
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(
        `🚀 [server]: Servidor rodando em http://localhost:${env.PORT}`,
    );
});
