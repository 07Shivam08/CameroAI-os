# Camero AI

Camero AI is a multi-tenant AI assistant platform built with Next.js. Organizations can create AI-powered chat assistants trained on their own documents, manage teams across branches, and connect third-party tools — all from a single dashboard.

## Features

- **AI Chat Assistant** — conversational AI powered by Google Gemini with streaming responses
- **Document Knowledge Base** — upload PDFs and train the assistant on your own content using Pinecone vector search (RAG)
- **Organizations & Branches** — multi-tenant structure with organization, branch, and user management
- **Role-Based Access** — separate admin and super-admin dashboards
- **Integrations** — connect Google, HubSpot, and Jira accounts via OAuth
- **Payments & Plans** — subscription pricing with Razorpay checkout
- **Email Notifications** — transactional emails via SMTP

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Auth | Clerk |
| Database | PostgreSQL with Prisma ORM |
| AI | Vercel AI SDK, LangChain, Google Generative AI |
| Vector Store | Pinecone |
| API | Hono with Zod validation |
| UI | Tailwind CSS, Radix UI, TanStack Query & Table |
| Payments | Razorpay |

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database
- API keys for Clerk, Google AI, Pinecone, and Razorpay

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the template and fill in your credentials:

   ```bash
   cp .env.example .env
   ```

3. Apply the database schema and seed data:

   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Lint the codebase |
| `npm run db:seed` | Seed the database |
| `npm run db:reset` | Reset and re-seed the database |

## Project Structure

```
app/            Next.js routes (auth, dashboard, bot, pricing, API)
components/     Shared UI components
features/       Domain modules (organization, branch, user)
actions/        Server actions
hooks/          Custom React hooks
lib/            Utilities and service clients
prisma/         Database schema, migrations, and seed script
providers/      App-level context providers
docs/           Project documentation (SRS, SDLC, user guide)
```

## Documentation

- [Software Requirements Specification (SRS)](docs/SRS_Camero_AI.md)
- [Software Development Life Cycle (SDLC)](docs/SDLC_Camero_AI.md)
