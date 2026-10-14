# Xeque

API REST para estudo de aberturas de xadrez, feita com Express 5, TypeScript, Prisma e PostgreSQL e organizada em **Clean Architecture**.

Estudantes montam **repertórios** nomeados, como "Pretas - principal", com as **linhas** de abertura que pretendem jogar. Cada linha é validada lance a lance, ligada ao catálogo oficial de aberturas do Lichess e pode ser comparada com dados reais:

- estatísticas da posição no Opening Explorer do Lichess, ou seja, o que se joga a partir dali e quem vence mais;
- o placar do próprio estudante nas partidas que ele já jogou no Lichess com aquela linha.

A API não simula partidas: ela é um caderno de estudo. As partidas continuam acontecendo no Lichess.

## Arquitetura

```
.
├── docker-compose.yml            # PostgreSQL 17 para desenvolvimento
├── prisma.config.ts              # configuração do Prisma 7 (lê DATABASE_URL)
├── prisma/
│   ├── schema.prisma             # modelos: Student, Opening, Repertoire, RepertoireLine
│   └── migrations/               # histórico de migrações SQL
└── src/
    ├── domain/                   # núcleo: não conhece Express, Prisma nem HTTP
    │   ├── chess/
    │   │   └── line.ts           # parse e validação de lances (SAN -> UCI, posições)
    │   ├── entities/             # Student, Opening, Repertoire, RepertoireLine
    │   ├── errors/
    │   │   └── app.error.ts      # AppError e subclasses (NotFound, Conflict, ...)
    │   ├── gateways/
    │   │   └── lichess.gateway.ts        # interface ILichessGateway
    │   ├── repositories/         # interfaces I*Repository
    │   └── services/
    │       └── repertoire-consistency.ts # regra "uma resposta por posição"
    │
    ├── application/              # casos de uso
    │   ├── helpers/
    │   │   └── ownership.ts      # garante que repertório/linha pertencem ao "pai" da URL
    │   └── use-cases/            # uma classe por ação (create-student, add-repertoire-line, ...)
    │
    ├── infrastructure/           # detalhes externos
    │   ├── database/
    │   │   ├── prisma/
    │   │   │   ├── client.ts     # cria o PrismaClient (adapter pg)
    │   │   │   └── generated/    # Prisma Client gerado (não versionado)
    │   │   ├── prisma-*.repository.ts     # implementações com PostgreSQL
    │   │   └── in-memory-*.repository.ts  # implementações em memória (Entrega 1, testes)
    │   ├── providers/
    │   │   ├── lichess.gateway.ts         # cliente HTTP do Lichess (fetch)
    │   │   └── cached-lichess.gateway.ts  # decorator de cache
    │   └── http/
    │       ├── controllers/      # traduzem HTTP <-> use cases
    │       ├── routes/           # routers do Express
    │       ├── middlewares/
    │       │   ├── validate.ts       # validação Zod de params, body e query
    │       │   └── error-handler.ts  # erro do domínio -> status HTTP
    │       ├── validation/
    │       │   └── schemas.ts    # schemas Zod de todas as requisições
    │       └── docs/
    │           └── openapi.ts    # especificação OpenAPI 3.0 (Swagger)
    │
    └── main/                     # composition root
        ├── config/
        │   └── env.ts            # lê e valida as variáveis de ambiente
        ├── factories/
        │   ├── repositories.ts   # instâncias compartilhadas (Prisma, gateway com cache)
        │   └── make-*-controller.factory.ts
        ├── scripts/
        │   └── sync-openings.ts  # importa o catálogo do Lichess
        └── server.ts             # ponto de entrada
```

---

## Setup e execução

### Requisitos

- Node.js 20.12 ou superior (testado com Node 25)
- Docker com Docker Compose
- Um token pessoal do Lichess, usado para o Opening Explorer

### 1. Instalar as dependências

```bash
npm install
```

O `postinstall` já gera o Prisma Client.

### 2. Configurar o ambiente

```bash
cp .env.example .env
```

Preencha o `.env`:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL do PostgreSQL. O valor do `.env.example` já aponta para o banco do `docker-compose.yml` |
| `LICHESS_TOKEN` | Token pessoal do Lichess. Gere em <https://lichess.org/account/oauth/token>; não precisa marcar nenhum escopo |
| `PORT` | Opcional; padrão `8000` |

O token é **da aplicação**: os estudantes não precisam fornecer token. Nunca faça commit do `.env`.

### 3. Subir o banco e criar as tabelas

```bash
npm run db:up        # docker compose up -d
npm run db:migrate   # prisma migrate dev
```

### 4. Importar o catálogo de aberturas

```bash
npm run openings:sync
```

### 5. Rodar a API

```bash
npm run dev
```

- API: <http://localhost:8000/api/v1>
- Documentação interativa (Swagger): <http://localhost:8000/api/docs>

### Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor com recarga automática (tsx watch) |
| `npm run build` | Compila com `tsc` |
| `npm run lint` | ESLint + Prettier |
| `npm run db:up` | Sobe o PostgreSQL no Docker |
| `npm run db:migrate` | Aplica as migrações do Prisma |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run openings:sync` | Importa ou atualiza o catálogo de aberturas |

---

## Endpoints

Base: `/api/v1`. Todas as entradas são validadas com Zod.

Lances são escritos em **SAN** separados por espaço, com ou sem numeração: `e4 c5 Nf3` ou `1. e4 c5 2. Nf3`. Nas URLs, o espaço vira `%20`.

### Estudantes

| Método | Caminho | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `/students` | Cadastra estudante. Confere no Lichess se o `lichessUser` existe | `201` |
| `GET` | `/students` | Lista estudantes | `200` |
| `GET` | `/students/:id` | Detalhe com `ratings` (blitz, rapid, classical) do Lichess | `200` |
| `PUT` | `/students/:id` | Atualiza; campos omitidos são mantidos | `200` |
| `DELETE` | `/students/:id` | Remove o estudante e, em cascata, seus repertórios | `204` |

```json
POST /students
{ "name": "Ana Teste", "email": "ana@example.com", "lichessUser": "ana_teste" }
```

Se o Lichess estiver fora do ar, `GET /students/:id` responde normalmente, com `ratings: null`.

### Catálogo de aberturas (somente leitura)

| Método | Caminho | Descrição | Sucesso |
|---|---|---|---|
| `GET` | `/openings` | Busca paginada no catálogo | `200` |
| `GET` | `/openings/:id` | Detalhe da abertura | `200` |

Filtros de `GET /openings`, todos opcionais:

| Query | Exemplo | Descrição |
|---|---|---|
| `name` | `najdorf` | trecho do nome, sem diferenciar maiúsculas |
| `eco` | `B90` | código ECO exato |
| `moves` | `e4 c5 Nf3` | aberturas que começam com esses lances |
| `limit` / `offset` | `20` / `0` | paginação (`limit` de 1 a 100) |

### Explorer (Lichess ao vivo)

| Método | Caminho | Descrição | Sucesso |
|---|---|---|---|
| `GET` | `/explorer?moves=e4 c5` | Nome e ECO da posição, total de partidas (vitórias de brancas, empates, vitórias de pretas) e os lances mais jogados | `200` |

Sem `moves`, retorna a posição inicial.

### Repertórios

| Método | Caminho | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `/students/:studentId/repertoires` | Cria repertório | `201` |
| `GET` | `/students/:studentId/repertoires` | Lista os repertórios do estudante | `200` |
| `GET` | `/students/:studentId/repertoires/:repertoireId` | Detalhe com todas as linhas | `200` |
| `PUT` | `/students/:studentId/repertoires/:repertoireId` | Renomeia (a cor não muda) | `200` |
| `DELETE` | `/students/:studentId/repertoires/:repertoireId` | Remove o repertório e suas linhas | `204` |

```json
POST /students/:studentId/repertoires
{ "name": "Pretas – principal", "color": "black" }
```

O nome é único por estudante.

### Linhas do repertório

| Método | Caminho | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `.../repertoires/:repertoireId/lines` | Adiciona linha (valida lances e aplica a regra de negócio) | `201` |
| `PUT` | `.../repertoires/:repertoireId/lines/:lineId` | Atualiza as anotações (`notes`, obrigatório) | `200` |
| `DELETE` | `.../repertoires/:repertoireId/lines/:lineId` | Remove a linha | `204` |
| `GET` | `.../repertoires/:repertoireId/lines/:lineId/stats` | Placar do estudante nessa linha, no Lichess | `200` |

O prefixo `...` é `/students/:studentId`.

```json
POST .../lines
{ "moves": "e4 c5 Nf3 d6", "notes": "Contra 3.Bb5+ jogar 3...Bd7" }
```

```json
201
{
  "message": "Linha adicionada ao repertório com sucesso!",
  "data": {
    "id": "...",
    "moves": ["e4", "c5", "Nf3", "d6"],
    "pgn": "1. e4 c5 2. Nf3 d6",
    "notes": "Contra 3.Bb5+ jogar 3...Bd7",
    "opening": { "id": "...", "eco": "B50", "name": "Sicilian Defense: Modern Variations" }
  }
}
```

O campo `opening` é a abertura **mais específica** do catálogo cujos lances são prefixo da linha.

No placar (`/stats`), `partial: true` indica que o Lichess ainda estava indexando as partidas do jogador. Os números já são reais, mas podem crescer nas próximas consultas.

---

## Erros

Todos os erros seguem o mesmo formato:

```json
{ "status": "error", "statusCode": 422, "message": "..." }
```

| Status | Quando | Origem |
|---|---|---|
| `400` | Payload inválido (inclui `issues` com cada campo), JSON malformado ou lance ilegal | `ZodError`, `ValidationError` |
| `404` | Recurso não existe ou não pertence ao "pai" da URL | `NotFoundError` |
| `409` | E-mail, nome de repertório ou linha duplicados | `ConflictError` |
| `422` | Regra de negócio violada (inclui `details`) ou usuário inexistente no Lichess | `BusinessRuleError` |
| `502` | Lichess indisponível, limite de requisições atingido ou token inválido | `ExternalServiceError` |
| `500` | Erro inesperado (detalhes só no log do servidor) | qualquer outro |

Exemplo de conflito da regra de negócio:

```json
{
  "status": "error",
  "statusCode": 422,
  "message": "Conflito com a linha \"1. e4 c5\": após 1. e4, este repertório já responde c5, e a nova linha responde e5. Para estudar as duas respostas, use outro repertório.",
  "details": {
    "conflictingLineId": "...",
    "position": "1. e4",
    "existingMove": "c5",
    "newMove": "e5"
  }
}
```