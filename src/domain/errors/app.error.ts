// Erros do domínio. Nenhum deles sabe de HTTP: quem traduz cada classe
// para um status code é o errorHandler, na camada de infraestrutura.

export class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

// Dado de entrada inválido (ex.: lance ilegal)
export class ValidationError extends AppError {}

// Recurso não existe
export class NotFoundError extends AppError {}

// Recurso já existe (ex.: e-mail ou linha duplicada)
export class ConflictError extends AppError {}

// Dado válido, mas que viola uma regra de negócio
export class BusinessRuleError extends AppError {
    constructor(
        message: string,
        public readonly details?: Record<string, unknown>,
    ) {
        super(message);
    }
}

// Serviço externo (Lichess) falhou ou está indisponível
export class ExternalServiceError extends AppError {}
