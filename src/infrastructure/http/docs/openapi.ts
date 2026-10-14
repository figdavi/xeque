import { COLORS } from '@domain/chess/line';

// ---------- helpers ----------

const uuidPathParam = (name: string) => ({
    name,
    in: 'path',
    required: true,
    schema: { type: 'string', format: 'uuid' },
});

const queryParam = (
    name: string,
    description: string,
    schema: Record<string, unknown> = { type: 'string' },
) => ({ name, in: 'query', required: false, description, schema });

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

const errorResponse = (description: string) => ({
    description,
    content: { 'application/json': { schema: ref('Error') } },
});

const dataResponse = (
    description: string,
    schema: Record<string, unknown>,
    extra: Record<string, unknown> = {},
) => ({
    description,
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    data: schema,
                    ...extra,
                },
            },
        },
    },
});

const arrayOf = (schema: Record<string, unknown>) => ({
    type: 'array',
    items: schema,
});

const jsonBody = (schemaName: string) => ({
    required: true,
    content: { 'application/json': { schema: ref(schemaName) } },
});

const invalid = errorResponse('Dados inválidos (Zod) ou lance ilegal');
const lichessDown = errorResponse('Lichess indisponível ou recusou a chamada');

const studentParam = uuidPathParam('studentId');
const repertoireParam = uuidPathParam('repertoireId');
const lineParam = uuidPathParam('lineId');

// ---------- documento ----------

export const openApiDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Xeque API',
        version: '2.0.0',
        description:
            'Caderno de estudo de aberturas de xadrez. Estudantes montam repertórios ' +
            'nomeados com linhas de aberturas, ligadas ao catálogo oficial do Lichess, ' +
            'e consultam estatísticas ao vivo no Opening Explorer.\n\n' +
            '**Regra de negócio:** dentro de um repertório, cada posição em que é a vez ' +
            'do estudante só pode ter uma resposta. Para estudar outra resposta na mesma ' +
            'posição, use outro repertório.\n\n' +
            'Lances em SAN, separados por espaço: `e4 c5 Nf3` ou `1. e4 c5 2. Nf3`.',
    },
    servers: [{ url: '/api/v1' }],
    tags: [
        { name: 'Students' },
        { name: 'Openings', description: 'Catálogo oficial (somente leitura)' },
        { name: 'Explorer', description: 'Estatísticas ao vivo do Lichess' },
        { name: 'Repertoires' },
        { name: 'Repertoire lines' },
    ],
    paths: {
        '/students': {
            get: {
                tags: ['Students'],
                summary: 'Lista estudantes',
                responses: {
                    200: dataResponse('Estudantes', arrayOf(ref('Student'))),
                },
            },
            post: {
                tags: ['Students'],
                summary: 'Cadastra estudante',
                description: 'Confere no Lichess se o `lichessUser` existe.',
                requestBody: jsonBody('StudentInput'),
                responses: {
                    201: dataResponse('Estudante criado', ref('Student')),
                    400: invalid,
                    409: errorResponse('E-mail já cadastrado'),
                    422: errorResponse('Usuário não existe no Lichess'),
                    502: lichessDown,
                },
            },
        },
        '/students/{id}': {
            parameters: [uuidPathParam('id')],
            get: {
                tags: ['Students'],
                summary: 'Busca estudante por ID, com ratings do Lichess',
                description:
                    '`ratings` vem `null` se o Lichess estiver indisponível.',
                responses: {
                    200: dataResponse(
                        'Estudante encontrado',
                        ref('StudentWithRatings'),
                    ),
                    400: invalid,
                    404: errorResponse('Estudante não encontrado'),
                },
            },
            put: {
                tags: ['Students'],
                summary: 'Atualiza estudante (campos omitidos são mantidos)',
                requestBody: jsonBody('StudentUpdate'),
                responses: {
                    200: dataResponse('Estudante atualizado', ref('Student')),
                    400: invalid,
                    404: errorResponse('Estudante não encontrado'),
                    409: errorResponse('E-mail em uso por outro estudante'),
                    422: errorResponse('Usuário não existe no Lichess'),
                    502: lichessDown,
                },
            },
            delete: {
                tags: ['Students'],
                summary: 'Remove estudante (e seus repertórios)',
                responses: {
                    204: { description: 'Estudante removido' },
                    400: invalid,
                    404: errorResponse('Estudante não encontrado'),
                },
            },
        },
        '/openings': {
            get: {
                tags: ['Openings'],
                summary: 'Busca no catálogo de aberturas',
                parameters: [
                    queryParam(
                        'name',
                        'Trecho do nome, sem diferenciar maiúsculas (ex.: najdorf)',
                    ),
                    queryParam('eco', 'Código ECO exato (ex.: B90)'),
                    queryParam(
                        'moves',
                        'Aberturas que começam com estes lances (ex.: e4 c5)',
                    ),
                    queryParam('limit', 'Itens por página (1 a 100)', {
                        type: 'integer',
                        default: 20,
                    }),
                    queryParam('offset', 'Quantos itens pular', {
                        type: 'integer',
                        default: 0,
                    }),
                ],
                responses: {
                    200: dataResponse('Aberturas', arrayOf(ref('Opening')), {
                        pagination: ref('Pagination'),
                    }),
                    400: invalid,
                },
            },
        },
        '/openings/{id}': {
            parameters: [uuidPathParam('id')],
            get: {
                tags: ['Openings'],
                summary: 'Busca abertura por ID',
                responses: {
                    200: dataResponse('Abertura', ref('Opening')),
                    400: invalid,
                    404: errorResponse('Abertura não encontrada'),
                },
            },
        },
        '/explorer': {
            get: {
                tags: ['Explorer'],
                summary: 'Estatísticas de uma posição no Lichess',
                description:
                    'Consulta o Opening Explorer do Lichess (partidas rated de todos os ' +
                    'jogadores). Resposta guardada em cache por 24h.',
                parameters: [
                    queryParam(
                        'moves',
                        'Lances até a posição; vazio = posição inicial (ex.: e4 c5)',
                    ),
                ],
                responses: {
                    200: dataResponse('Estatísticas', ref('PositionStats')),
                    400: invalid,
                    502: lichessDown,
                },
            },
        },
        '/students/{studentId}/repertoires': {
            parameters: [studentParam],
            get: {
                tags: ['Repertoires'],
                summary: 'Lista os repertórios do estudante',
                responses: {
                    200: dataResponse(
                        'Repertórios',
                        arrayOf(ref('Repertoire')),
                    ),
                    400: invalid,
                    404: errorResponse('Estudante não encontrado'),
                },
            },
            post: {
                tags: ['Repertoires'],
                summary: 'Cria repertório',
                requestBody: jsonBody('RepertoireInput'),
                responses: {
                    201: dataResponse('Repertório criado', ref('Repertoire')),
                    400: invalid,
                    404: errorResponse('Estudante não encontrado'),
                    409: errorResponse(
                        'Estudante já tem repertório com esse nome',
                    ),
                },
            },
        },
        '/students/{studentId}/repertoires/{repertoireId}': {
            parameters: [studentParam, repertoireParam],
            get: {
                tags: ['Repertoires'],
                summary: 'Detalhe do repertório, com as linhas',
                responses: {
                    200: dataResponse('Repertório', ref('RepertoireWithLines')),
                    400: invalid,
                    404: errorResponse('Repertório não encontrado'),
                },
            },
            put: {
                tags: ['Repertoires'],
                summary: 'Renomeia repertório (a cor não muda)',
                requestBody: jsonBody('RepertoireUpdate'),
                responses: {
                    200: dataResponse(
                        'Repertório atualizado',
                        ref('Repertoire'),
                    ),
                    400: invalid,
                    404: errorResponse('Repertório não encontrado'),
                    409: errorResponse(
                        'Estudante já tem repertório com esse nome',
                    ),
                },
            },
            delete: {
                tags: ['Repertoires'],
                summary: 'Remove repertório (e suas linhas)',
                responses: {
                    204: { description: 'Repertório removido' },
                    400: invalid,
                    404: errorResponse('Repertório não encontrado'),
                },
            },
        },
        '/students/{studentId}/repertoires/{repertoireId}/lines': {
            parameters: [studentParam, repertoireParam],
            post: {
                tags: ['Repertoire lines'],
                summary: 'Adiciona linha ao repertório',
                description:
                    'Valida os lances, aplica a regra "uma resposta por posição" e liga a ' +
                    'linha à abertura mais específica do catálogo.',
                requestBody: jsonBody('LineInput'),
                responses: {
                    201: dataResponse('Linha adicionada', ref('Line')),
                    400: invalid,
                    404: errorResponse('Repertório não encontrado'),
                    409: errorResponse('Linha já está no repertório'),
                    422: errorResponse(
                        'Conflito: o repertório já tem outra resposta para uma posição da linha',
                    ),
                },
            },
        },
        '/students/{studentId}/repertoires/{repertoireId}/lines/{lineId}': {
            parameters: [studentParam, repertoireParam, lineParam],
            put: {
                tags: ['Repertoire lines'],
                summary: 'Atualiza as anotações da linha',
                requestBody: jsonBody('LineUpdate'),
                responses: {
                    200: dataResponse('Linha atualizada', ref('Line')),
                    400: invalid,
                    404: errorResponse('Linha não encontrada'),
                },
            },
            delete: {
                tags: ['Repertoire lines'],
                summary: 'Remove linha do repertório',
                responses: {
                    204: { description: 'Linha removida' },
                    400: invalid,
                    404: errorResponse('Linha não encontrada'),
                },
            },
        },
        '/students/{studentId}/repertoires/{repertoireId}/lines/{lineId}/stats':
            {
                parameters: [studentParam, repertoireParam, lineParam],
                get: {
                    tags: ['Repertoire lines'],
                    summary:
                        'Placar do estudante nesta linha (partidas no Lichess)',
                    description:
                        'Na primeira consulta o Lichess pode ainda estar indexando as ' +
                        'partidas do jogador; nesse caso `partial` vem `true`.',
                    responses: {
                        200: dataResponse('Placar', ref('PlayerLineStats')),
                        400: invalid,
                        404: errorResponse('Linha não encontrada'),
                        502: lichessDown,
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
                    statusCode: { type: 'integer', example: 422 },
                    message: { type: 'string' },
                    issues: {
                        description: 'Presente em erros de validação (400)',
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                path: { type: 'string' },
                                message: { type: 'string' },
                            },
                        },
                    },
                    details: {
                        description:
                            'Presente em erros de regra de negócio (422)',
                        type: 'object',
                    },
                },
            },
            Pagination: {
                type: 'object',
                properties: {
                    total: { type: 'integer' },
                    limit: { type: 'integer' },
                    offset: { type: 'integer' },
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
                    lichessUser: {
                        type: 'string',
                        description: 'Usuário existente no Lichess',
                        example: 'lichess',
                    },
                },
            },
            StudentInput: {
                allOf: [
                    ref('StudentUpdate'),
                    { required: ['name', 'email', 'lichessUser'] },
                ],
            },
            Student: {
                allOf: [
                    {
                        type: 'object',
                        properties: { id: { type: 'string', format: 'uuid' } },
                    },
                    ref('StudentInput'),
                ],
            },
            StudentWithRatings: {
                allOf: [
                    ref('Student'),
                    {
                        type: 'object',
                        properties: {
                            ratings: {
                                type: 'object',
                                nullable: true,
                                properties: {
                                    blitz: { type: 'integer', nullable: true },
                                    rapid: { type: 'integer', nullable: true },
                                    classical: {
                                        type: 'integer',
                                        nullable: true,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            Opening: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    eco: { type: 'string', example: 'B90' },
                    name: {
                        type: 'string',
                        example: 'Sicilian Defense: Najdorf Variation',
                    },
                    pgn: {
                        type: 'string',
                        example:
                            '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6',
                    },
                },
            },
            GameCounts: {
                type: 'object',
                properties: {
                    white: { type: 'integer' },
                    draws: { type: 'integer' },
                    black: { type: 'integer' },
                    total: { type: 'integer' },
                },
            },
            PositionStats: {
                type: 'object',
                properties: {
                    opening: {
                        type: 'object',
                        nullable: true,
                        properties: {
                            eco: { type: 'string', example: 'B20' },
                            name: {
                                type: 'string',
                                example: 'Sicilian Defense',
                            },
                        },
                    },
                    games: ref('GameCounts'),
                    topMoves: arrayOf({
                        type: 'object',
                        properties: {
                            san: { type: 'string', example: 'Nf3' },
                            uci: { type: 'string', example: 'g1f3' },
                            averageRating: { type: 'integer' },
                            games: ref('GameCounts'),
                        },
                    }),
                },
            },
            RepertoireUpdate: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string', example: 'Pretas – principal' },
                },
            },
            RepertoireInput: {
                type: 'object',
                required: ['name', 'color'],
                properties: {
                    name: { type: 'string', example: 'Pretas – principal' },
                    color: { type: 'string', enum: COLORS, example: 'black' },
                },
            },
            Repertoire: {
                allOf: [
                    {
                        type: 'object',
                        properties: { id: { type: 'string', format: 'uuid' } },
                    },
                    ref('RepertoireInput'),
                ],
            },
            RepertoireWithLines: {
                allOf: [
                    ref('Repertoire'),
                    {
                        type: 'object',
                        properties: { lines: arrayOf(ref('Line')) },
                    },
                ],
            },
            LineInput: {
                type: 'object',
                required: ['moves'],
                properties: {
                    moves: {
                        type: 'string',
                        description: 'Lances em SAN separados por espaço',
                        example: 'e4 c5 Nf3 d6',
                    },
                    notes: {
                        type: 'string',
                        example: 'Contra 3.Bb5+ jogar 3...Bd7',
                    },
                },
            },
            LineUpdate: {
                type: 'object',
                required: ['notes'],
                properties: {
                    notes: {
                        type: 'string',
                        example: 'Revisar a ideia ...g6 contra 6.Be2',
                    },
                },
            },
            Line: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    moves: arrayOf({ type: 'string' }),
                    pgn: { type: 'string', example: '1. e4 c5 2. Nf3 d6' },
                    notes: { type: 'string' },
                    opening: {
                        type: 'object',
                        nullable: true,
                        description:
                            'Abertura mais específica do catálogo que é prefixo da linha',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            eco: { type: 'string', example: 'B50' },
                            name: {
                                type: 'string',
                                example: 'Sicilian Defense: Modern Variations',
                            },
                        },
                    },
                },
            },
            PlayerLineStats: {
                type: 'object',
                properties: {
                    wins: { type: 'integer' },
                    draws: { type: 'integer' },
                    losses: { type: 'integer' },
                    total: { type: 'integer' },
                    partial: { type: 'boolean' },
                },
            },
        },
    },
};
