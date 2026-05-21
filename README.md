# SISACAF — Frontend

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Interface web do **Sistema de Controle de Armamento e Fardamento (SISACAF)** do **31º Batalhão de Polícia Militar do Maranhão**. Permite o gerenciamento completo do efetivo, cautelas de armas e coletes, com geração e visualização de documentos PDF oficiais.

---

## Funcionalidades

- **Login** com autenticação JWT
- **Dashboard** com visão geral do armamento e efetivo
- **Gestão de militares** — listagem, cadastro, edição e visualização do efetivo
- **Controle de cautelas** — abertura, acompanhamento e baixa de cautelas de armas e coletes
- **Geração de PDFs** — requerimentos, cautelas, pareceres e demais documentos oficiais
- **Gestão de armas e coletes** — cadastro e controle de patrimônio
- Interface responsiva com componentes **Radix UI** e **shadcn/ui**

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Componentes | Radix UI + shadcn/ui |
| Tabelas | TanStack Table |
| Ícones | Lucide React |
| Notificações | Sonner |
| Container | Docker (standalone output) |

---

## Pré-requisitos

- Node.js 20+
- npm ou yarn
- Backend SISACAF rodando (`http://localhost:8080`)

---

## Como rodar

### Com Docker (recomendado)

Na raiz do repositório de infraestrutura (onde está o `docker-compose.yml`):

```bash
docker compose up -d --build
```

O frontend estará disponível em `http://localhost:3000`.

### Local (sem Docker)

1. Instale as dependências:

```bash
npm install
```

2. Configure a variável de ambiente:

```bash
# .env.local
API_BASE_URL=http://localhost:8080/api
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`.

---

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `API_BASE_URL` | URL base da API backend | `http://backend:8080/api` |

---

## Estrutura do projeto

```
sisacaf-frontend/
├── app/
│   ├── api/               # Route handlers (proxy para o backend)
│   ├── arma/              # Páginas de gestão de armas
│   ├── cautelas/          # Páginas de controle de cautelas
│   ├── colete/            # Páginas de gestão de coletes
│   ├── inicio/            # Dashboard principal
│   ├── login/             # Página de autenticação
│   ├── militar/           # Páginas de gestão de militares
│   │   ├── [id]/editar/   # Edição de militar
│   │   └── novo/          # Cadastro de novo militar
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial (redireciona para login)
├── components/            # Componentes reutilizáveis
├── public/                # Arquivos estáticos
├── Dockerfile
└── package.json
```

---

## Licença

Uso interno — 31º Batalhão de Polícia Militar / PMMA. Todos os direitos reservados.
