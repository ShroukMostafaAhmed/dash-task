# DashFlow

A responsive dashboard application built with Next.js 16, TypeScript, and Tailwind CSS.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Toasts**: Sonner
- **Theme**: next-themes
- **API**: JSONPlaceholder

## Features

- Public pages: Home, Posts list + detail, Users list + profile
- Admin panel: Login, Dashboard stats, Users CRUD, Posts CRUD
- Debounced search (400ms) on all list pages
- Pagination with URL query params
- Light / Dark mode with localStorage persistence
- Optimistic UI updates for all mutations
- Route protection via Next.js proxy

## Getting Started

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run with Docker

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://jsonplaceholder.typicode.com` |

## Admin Credentials

```
Username: admin
Password: admin123
```

## ADR (Architecture Decisions)

- **Zustand over Redux** — simpler API, less boilerplate for this scale
- **Optimistic updates** — JSONPlaceholder mutations are simulated, so we update local state immediately and rollback on error
- **next-themes** — handles SSR hydration for dark mode cleanly
- **Route groups** `(public)` — keeps public and admin layouts fully separated without affecting URLs
- **proxy.ts** — Next.js 16 replaces middleware with proxy for route protection
