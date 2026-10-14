import { defineConfig } from 'prisma/config';

// O Prisma 7 não lê o .env sozinho. Em produção as variáveis vêm do ambiente.
try {
    process.loadEnvFile();
} catch {
    // sem .env: segue com as variáveis do ambiente
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
