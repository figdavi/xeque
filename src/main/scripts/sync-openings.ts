import { env } from '@main/config/env';
import { parseLine, tokenizeMoves } from '@domain/chess/line';
import { createPrismaClient } from '@infrastructure/database/prisma/client';

// Sincroniza o catálogo de aberturas com o dataset oficial do Lichess
// (https://github.com/lichess-org/chess-openings, licença CC0).
//
// Pode ser rodado quantas vezes quiser (idempotente): insere linhas novas,
// atualiza nome/ECO de linhas renomeadas e mantém os ids, para não quebrar
// os repertórios que apontam para elas. Linhas removidas do dataset são
// mantidas no banco.
//
// Uso: npm run openings:sync

const DATASET_URL =
    'https://raw.githubusercontent.com/lichess-org/chess-openings/master';
const FILES = ['a.tsv', 'b.tsv', 'c.tsv', 'd.tsv', 'e.tsv'];

interface DatasetRow {
    eco: string;
    name: string;
    pgn: string;
    uci: string;
}

async function downloadDataset(): Promise<DatasetRow[]> {
    const rows: DatasetRow[] = [];

    for (const file of FILES) {
        const response = await fetch(`${DATASET_URL}/${file}`);
        if (!response.ok) {
            throw new Error(`Falha ao baixar ${file}: HTTP ${response.status}`);
        }

        const lines = (await response.text()).trim().split('\n').slice(1); // pula o cabeçalho
        for (const line of lines) {
            const [eco, name, pgn] = line.split('\t');
            const uci = parseLine(tokenizeMoves(pgn)).uci.join(' ');
            rows.push({ eco, name, pgn, uci });
        }
    }

    return rows;
}

async function main() {
    const prisma = createPrismaClient(env.DATABASE_URL);

    try {
        console.log('Baixando o dataset de aberturas do Lichess...');
        const dataset = await downloadDataset();

        const existing = new Map(
            (await prisma.opening.findMany()).map((row) => [row.uci, row]),
        );

        const toCreate: DatasetRow[] = [];
        const toUpdate: DatasetRow[] = [];
        let unchanged = 0;

        for (const row of dataset) {
            const current = existing.get(row.uci);
            if (!current) {
                toCreate.push(row);
            } else if (
                current.eco !== row.eco ||
                current.name !== row.name ||
                current.pgn !== row.pgn
            ) {
                toUpdate.push(row);
            } else {
                unchanged++;
            }
        }

        // skipDuplicates: o dataset pode repetir a mesma sequência de lances
        const created = await prisma.opening.createMany({
            data: toCreate,
            skipDuplicates: true,
        });

        for (const row of toUpdate) {
            await prisma.opening.update({
                where: { uci: row.uci },
                data: { eco: row.eco, name: row.name, pgn: row.pgn },
            });
        }

        console.log(
            `Catálogo sincronizado: ${dataset.length} linhas no dataset, ` +
                `${created.count} inseridas, ${toUpdate.length} atualizadas, ` +
                `${unchanged} sem mudança.`,
        );
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error('Erro ao sincronizar o catálogo:', error);
    process.exit(1);
});
