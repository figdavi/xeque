import { OPENING_COLORS } from '@domain/entities/opening';

const uuidPathParam = (name: string) => ({
    name,
    in: 'path',
    required: true,
    schema: { type: 'string', format: 'uuid' },
});

const idParam = uuidPathParam('id');

const errorResponse = (description: string) => ({
    description,
    content: {
        'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
        },
    },
});

const dataResponse = (description: string, ref: string, isArray = false) => ({
    description,
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    data: isArray
                        ? { type: 'array', items: { $ref: ref } }
                        : { $ref: ref },
                },
            },
        },
    },
});

const jsonBody = (ref: string) => ({
    required: true,
    content: { 'application/json': { schema: { $ref: ref } } },
});

export const openApiDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Xeque API',
        version: '1.0.0',
        description:
            'API REST para gerenciar estudantes de xadrez, o catálogo de aberturas e o repertório de cada estudante (armazenamento em memória).',
    },
    servers: [{ url: '/api/v1' }],
    tags: [{ name: 'Students' }, { name: 'Openings' }, { name: 'Repertoire' }],
    paths: {
        '/students': {
            get: {
                tags: ['Students'],
                summary: 'Lista estudantes',
                responses: {
                    200: dataResponse(
                        'Lista de estudantes',
                        '#/components/schemas/Student',
                        true,
                    ),
                },
            },
            post: {
                tags: ['Students'],
                summary: 'Cadastra estudante',
                requestBody: jsonBody('#/components/schemas/StudentInput'),
                responses: {
                    201: dataResponse(
                        'Estudante criado',
                        '#/components/schemas/Student',
                    ),
                    400: errorResponse('Dados inválidos ou e-mail duplicado'),
                },
            },
        },
        '/students/{id}': {
            parameters: [idParam],
            get: {
                tags: ['Students'],
                summary: 'Busca estudante por ID',
                responses: {
                    200: dataResponse(
                        'Estudante encontrado',
                        '#/components/schemas/Student',
                    ),
                    404: errorResponse('Estudante não encontrado'),
                },
            },
            put: {
                tags: ['Students'],
                summary: 'Atualiza estudante (campos omitidos são mantidos)',
                requestBody: jsonBody('#/components/schemas/StudentUpdate'),
                responses: {
                    200: dataResponse(
                        'Estudante atualizado',
                        '#/components/schemas/Student',
                    ),
                    400: errorResponse('Dados inválidos ou e-mail em uso'),
                    404: errorResponse('Estudante não encontrado'),
                },
            },
            delete: {
                tags: ['Students'],
                summary: 'Remove estudante',
                responses: {
                    204: { description: 'Estudante removido' },
                    404: errorResponse('Estudante não encontrado'),
                },
            },
        },
        '/openings': {
            get: {
                tags: ['Openings'],
                summary: 'Lista aberturas do catálogo',
                parameters: [
                    {
                        name: 'color',
                        in: 'query',
                        required: false,
                        description: 'Filtra pela cor que joga a abertura',
                        schema: { type: 'string', enum: OPENING_COLORS },
                    },
                    {
                        name: 'name',
                        in: 'query',
                        required: false,
                        description:
                            'Filtra por trecho do nome (sem diferenciar maiúsculas)',
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: dataResponse(
                        'Lista de aberturas',
                        '#/components/schemas/Opening',
                        true,
                    ),
                    400: errorResponse('Filtro inválido'),
                },
            },
            post: {
                tags: ['Openings'],
                summary: 'Cadastra abertura no catálogo',
                requestBody: jsonBody('#/components/schemas/OpeningInput'),
                responses: {
                    201: dataResponse(
                        'Abertura criada',
                        '#/components/schemas/Opening',
                    ),
                    400: errorResponse('Dados inválidos'),
                },
            },
        },
        '/openings/{id}': {
            parameters: [idParam],
            get: {
                tags: ['Openings'],
                summary: 'Busca abertura por ID',
                responses: {
                    200: dataResponse(
                        'Abertura encontrada',
                        '#/components/schemas/Opening',
                    ),
                    404: errorResponse('Abertura não encontrada'),
                },
            },
            put: {
                tags: ['Openings'],
                summary: 'Atualiza abertura (campos omitidos são mantidos)',
                requestBody: jsonBody('#/components/schemas/OpeningUpdate'),
                responses: {
                    200: dataResponse(
                        'Abertura atualizada',
                        '#/components/schemas/Opening',
                    ),
                    400: errorResponse('Dados inválidos'),
                    404: errorResponse('Abertura não encontrada'),
                },
            },
            delete: {
                tags: ['Openings'],
                summary: 'Remove abertura do catálogo',
                responses: {
                    204: { description: 'Abertura removida' },
                    404: errorResponse('Abertura não encontrada'),
                },
            },
        },
        '/students/{studentId}/repertoire': {
            parameters: [uuidPathParam('studentId')],
            get: {
                tags: ['Repertoire'],
                summary: 'Lista o repertório do estudante',
                responses: {
                    200: dataResponse(
                        'Repertório do estudante',
                        '#/components/schemas/Repertoire',
                        true,
                    ),
                    404: errorResponse('Estudante não encontrado'),
                },
            },
            post: {
                tags: ['Repertoire'],
                summary: 'Adiciona abertura ao repertório do estudante',
                requestBody: jsonBody('#/components/schemas/RepertoireInput'),
                responses: {
                    201: dataResponse(
                        'Abertura adicionada ao repertório',
                        '#/components/schemas/Repertoire',
                    ),
                    400: errorResponse(
                        'Dados inválidos ou abertura já está no repertório',
                    ),
                    404: errorResponse('Estudante ou abertura não encontrados'),
                },
            },
        },
        '/students/{studentId}/repertoire/{openingId}': {
            parameters: [
                uuidPathParam('studentId'),
                uuidPathParam('openingId'),
            ],
            put: {
                tags: ['Repertoire'],
                summary: 'Atualiza as anotações de uma abertura do repertório',
                requestBody: jsonBody('#/components/schemas/RepertoireUpdate'),
                responses: {
                    200: dataResponse(
                        'Repertório atualizado',
                        '#/components/schemas/Repertoire',
                    ),
                    400: errorResponse('Anotações (notes) ausentes'),
                    404: errorResponse(
                        'Estudante não possui esta abertura no repertório',
                    ),
                },
            },
            delete: {
                tags: ['Repertoire'],
                summary: 'Remove abertura do repertório do estudante',
                responses: {
                    204: { description: 'Abertura removida do repertório' },
                    404: errorResponse(
                        'Estudante não possui esta abertura no repertório',
                    ),
                },
            },
        },
    },
    components: {
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error' },
                    statusCode: { type: 'integer', example: 404 },
                    message: { type: 'string' },
                },
            },
            StudentUpdate: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Ana Teste' },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'ana@example.com',
                    },
                    lichessUser: { type: 'string', example: 'ana_teste' },
                },
            },
            StudentInput: {
                allOf: [
                    { $ref: '#/components/schemas/StudentUpdate' },
                    { required: ['name', 'email', 'lichessUser'] },
                ],
            },
            Student: {
                allOf: [
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                        },
                    },
                    { $ref: '#/components/schemas/StudentInput' },
                ],
            },
            OpeningUpdate: {
                type: 'object',
                properties: {
                    openingName: {
                        type: 'string',
                        example: 'Defesa Siciliana',
                    },
                    color: {
                        type: 'string',
                        enum: OPENING_COLORS,
                        example: 'black',
                    },
                    moves: {
                        type: 'array',
                        items: { type: 'string' },
                        minItems: 1,
                        example: ['e4', 'c5'],
                    },
                },
            },
            OpeningInput: {
                allOf: [
                    { $ref: '#/components/schemas/OpeningUpdate' },
                    { required: ['openingName', 'color', 'moves'] },
                ],
            },
            Opening: {
                allOf: [
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                        },
                    },
                    { $ref: '#/components/schemas/OpeningInput' },
                ],
            },
            RepertoireUpdate: {
                type: 'object',
                required: ['notes'],
                properties: {
                    notes: {
                        type: 'string',
                        example: 'Estudar a linha Najdorf com 6.Bg5.',
                    },
                },
            },
            RepertoireInput: {
                type: 'object',
                required: ['openingId'],
                properties: {
                    openingId: { type: 'string', format: 'uuid' },
                    notes: {
                        type: 'string',
                        description: 'Opcional; padrão é string vazia',
                        example: 'Estudar a linha Najdorf com 6.Bg5.',
                    },
                },
            },
            Repertoire: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    studentId: { type: 'string', format: 'uuid' },
                    openingId: { type: 'string', format: 'uuid' },
                    notes: { type: 'string' },
                },
            },
        },
    },
};
