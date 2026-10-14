import { z } from 'zod';

// Lê o .env (se existir) e valida as variáveis na subida do servidor.
// Se faltar alguma, o processo para com uma mensagem clara, em vez de
// falhar mais tarde no meio de uma requisição.
try {
    process.loadEnvFile();
} catch {
    // sem .env: segue com as variáveis do ambiente (ex.: produção)
}

const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória.'),
    LICHESS_TOKEN: z
        .string()
        .min(1, 'LICHESS_TOKEN é obrigatório (veja o .env.example).'),
    PORT: z.coerce.number().int().positive().default(8000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Variáveis de ambiente inválidas:');
    for (const issue of parsed.error.issues) {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
}

export const env = parsed.data;
