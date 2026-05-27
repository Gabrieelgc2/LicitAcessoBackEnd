# LicitAcesso Backend API

Backend da plataforma **LicitAcesso**, desenvolvido com NestJS, Prisma ORM, Firebase Authentication, PostgreSQL (Supabase) e MongoDB.

A API é responsável por:

- autenticação de usuários via Google/Firebase
- gerenciamento de usuários
- análise de oportunidades/licitações
- disponibilização de dados agregados para dashboards e gráficos

---

# Tecnologias Utilizadas

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- MongoDB
- Firebase Admin SDK
- JWT Authentication
- Render.com

---

# Estrutura do Projeto

```bash
src/
 ├── auth/
 ├── firebase/
 ├── oportunidades/
 ├── prisma/
 ├── app.module.ts
 └── main.ts
```

---

# Instalação

## 1. Clonar o projeto

```bash
git clone https://github.com/seu-repositorio/licitacesso-backend.git
```

---

## 2. Instalar dependências

```bash
npm install
```

---

# Prisma

## Gerar client Prisma

```bash
npx prisma generate
```

---

## Aplicar schema no banco

```bash
npx prisma db push
```

ou:

```bash
npx prisma migrate dev
```

---

# Executar Projeto

## Desenvolvimento

```bash
npm run start:dev
```

---

## Produção

```bash
npm run build
npm run start:prod
```

---

# Deploy

O projeto está hospedado no Render:

```txt
https://licitacessobackend.onrender.com
```

---

# Autenticação

A autenticação funciona via Firebase Authentication.

Fluxo:

1. Frontend realiza login Google/Firebase
2. Frontend recebe `idToken`
3. Frontend envia `idToken` para API
4. Backend valida token com Firebase Admin SDK
5. Backend cria usuário no PostgreSQL caso não exista
6. Backend retorna JWT próprio da aplicação

---

# Rotas da API

Base URL:

```txt
https://licitacessobackend.onrender.com
```

---

# Auth

## Login Firebase

### Endpoint

```http
POST /auth/firebase
```

### Body

```json
{
  "idToken": "FIREBASE_ID_TOKEN"
}
```

### Exemplo

```http
POST https://licitacessobackend.onrender.com/auth/firebase
```

### Resposta

```json
{
  "access_token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Gabriel Garcia",
    "email": "gabriel@gmail.com"
  }
}
```

---

# Oportunidades

As rotas abaixo retornam dados analíticos relacionados às oportunidades/licitações.

---

## Por Estado

### Endpoint

```http
GET /oportunidades/por-estado
```

### Query Params

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| periodo_inicio | string | sim |
| periodo_fim | string | sim |

### Exemplo

```http
GET https://licitacessobackend.onrender.com/oportunidades/por-estado?periodo_inicio=2025-01-01&periodo_fim=2025-12-31
```

---

## Por Área de Serviço

### Endpoint

```http
GET /oportunidades/por-area-servico
```

### Query Params

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| periodo_inicio | string | sim |
| periodo_fim | string | sim |

### Exemplo

```http
GET https://licitacessobackend.onrender.com/oportunidades/por-area-servico?periodo_inicio=2025-01-01&periodo_fim=2025-12-31
```

---

## Por Faixa de Valor

### Endpoint

```http
GET /oportunidades/por-faixa-valor
```

### Query Params

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| periodo_inicio | string | sim |
| periodo_fim | string | sim |
| faixa_valor | string | não |

### Exemplo

```http
GET https://licitacessobackend.onrender.com/oportunidades/por-faixa-valor?periodo_inicio=2025-01-01&periodo_fim=2025-12-31
```

### Exemplo com faixa

```http
GET https://licitacessobackend.onrender.com/oportunidades/por-faixa-valor?periodo_inicio=2025-01-01&periodo_fim=2025-12-31&faixa_valor=1000-5000
```

---

## Por Mês

### Endpoint

```http
GET /oportunidades/por-mes
```

### Query Params

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| mes | number | sim |
| ano | number | sim |

### Exemplo

```http
GET https://licitacessobackend.onrender.com/oportunidades/por-mes?mes=5&ano=2025
```

---

## Por Situação

### Endpoint

```http
GET /oportunidades/por-situacao
```

### Query Params

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| periodo_inicio | string | sim |
| periodo_fim | string | sim |

### Exemplo

```http
GET https://licitacessobackend.onrender.com/oportunidades/por-situacao?periodo_inicio=2025-01-01&periodo_fim=2025-12-31
```

---

## Filtros

### Endpoint

```http
GET /oportunidades/filtros
```

### Query Params

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| periodo_inicio | string | sim |
| periodo_fim | string | sim |

### Exemplo

```http
GET https://licitacessobackend.onrender.com/oportunidades/filtros?periodo_inicio=2025-01-01&periodo_fim=2025-12-31
```

---

# Estrutura de Banco de Dados

## PostgreSQL / Prisma

Tabela principal:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

---

# Segurança

- JWT Authentication
- Firebase Token Validation
- Prisma ORM
- Variáveis protegidas via `.env`

---

# Comandos Úteis

## Prisma Studio

```bash
npx prisma studio
```

---

## Gerar Build

```bash
npm run build
```

---

## Executar Produção

```bash
npm run start:prod
```

---

# Observações

- O backend utiliza MongoDB para consultas analíticas.
- O PostgreSQL/Supabase é utilizado para persistência de usuários.
- Firebase Authentication é utilizado para autenticação Google.

---

# Autor

Gabriel Garcia

Projeto acadêmico desenvolvido para estudo de:

- autenticação OAuth/Firebase
- APIs REST
- NestJS
- Prisma ORM
- MongoDB
- PostgreSQL
- arquitetura backend moderna
