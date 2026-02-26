# Desafio Técnico — First Decision

Solução full-stack com Spring Boot (Java 17) + Angular 17, PostgreSQL, Docker e CI (GitHub Actions) para cadastro de usuários.

## Estrutura de Pastas
- backend/ — API REST (Spring Boot)
- frontend/ — App Angular (formulário, listagem, editar/deletar)
- deploy/ — docker-compose de smoke test
- .github/workflows/ci.yml — pipeline de CI

## Requisitos
- Java 17 e Maven 3.9+
- Node 20 e npm (Angular CLI não é obrigatório; usamos scripts do npm)
- Docker Desktop (Windows)

## Banco (dev)
- DB: appdb
- USER: app
- PASSWORD: app

## Executar local (dev)
### 1) Subir Postgres via Docker (opção recomendada)
```
docker run --name pg -e POSTGRES_DB=appdb -e POSTGRES_USER=app -e POSTGRES_PASSWORD=app -p 5432:5432 -d postgres:16
```

### 2) Backend
```
cd backend
mvn spring-boot:run
```
Verificar health:
```
curl http://localhost:8080/api/users/health
```
Resposta esperada: `{ "status": "up" }`

### 3) Frontend
```
cd frontend
npm ci
npm start
```
Acesse http://localhost:4200

- Configure `frontend/src/environments/environment.ts` caso queira apontar para outra URL da API.

## Funcionalidades
- Cadastro de usuário com validações (nome, e-mail, senha e confirmação)
- Listagem com ações Editar e Deletar
- Integração com API via HttpClient
- Tratamento de erros com interceptor (snackbar)

## Testes
### Backend
```
cd backend
mvn -q test
```
- Testes unitários (serviço) e de integração (controller) com Testcontainers + PostgreSQL

### Frontend
```
cd frontend
npm ci
npm test -- --watch=false --browsers=ChromeHeadless
```

## Docker (dev)
Na raiz do repositório:
```
docker compose up -d --build
```
- API: http://localhost:8080
- DB: porta 5432

## CI (GitHub Actions)
Pipeline `.github/workflows/ci.yml` executa em push/PR:
1. Checkout
2. Setup Java e build/test do backend (unit + integração)
3. Setup Node, instalação deps, testes Angular, build Angular
4. Build da imagem Docker do backend
5. Smoke test com `deploy/docker-compose.smoke.yml` (sobe DB + imagem da API e valida `/api/users/health`)
6. Cleanup dos containers

## Como Validar os Requisitos
- Formulário Angular: botões desabilitados quando inválido; mensagens de erro por campo
- Cadastro válido cria usuário (confira na listagem)
- Edição/Exclusão funcionam e refletem na lista
- Erro de e-mail duplicado exibe mensagem amigável
- Desligue backend e tente cadastrar para ver tratamento de falha no interceptor

## Notas
- Senhas são armazenadas com BCrypt.
- Migrações com Flyway (V1 cria tabela e índice único por e-mail - case-insensitive).
- Swagger UI disponível em `/swagger-ui/index.html` quando a API está rodando.
