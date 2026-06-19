# DashFlow

A responsive, production-ready dashboard application built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Toasts | Sonner |
| Theme | next-themes |
| API | JSONPlaceholder |
| Unit Tests | Jest + React Testing Library |
| E2E Tests | Playwright |

## Features

- Public pages: Home, Posts list + detail, Users list + profile
- Admin panel: Login, Dashboard stats, Users CRUD, Posts CRUD
- Debounced search (400ms) on all list pages
- Pagination with URL query params on all list pages
- Light / Dark mode with localStorage persistence
- Optimistic UI updates for all mutations
- Route protection via Next.js proxy
- Toast notifications for all CRUD operations

## Getting Started

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run with Docker

> Docker uses the pre-built output. Run the build step first.

```bash
npm install
npm run build
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```
NEXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com
```

## Admin Credentials

```
Username: admin
Password: admin123
```

## Running Tests

### Unit Tests (Jest + React Testing Library)

```bash
npm run test
```

Covers: `useDebounce` hook, `Pagination` component, `Button`, `Input`, CRUD helper functions.

### E2E Tests (Playwright)

```bash
# Install browser (first time only)
npx playwright install chromium

# Run tests (requires dev server running)
npm run dev        # in one terminal
npm run e2e        # in another terminal
```

Covers: Admin login/logout, Create post, Search with debounce, Pagination navigation, Theme toggle persistence.

## Architecture Decisions

- **Zustand over Redux** — simpler API, less boilerplate for this project scale
- **Optimistic updates** — JSONPlaceholder mutations are simulated, so local state updates immediately and rolls back on real errors
- **next-themes** — handles SSR hydration for dark mode correctly with `suppressHydrationWarning`
- **Route groups** `(public)` and `(panel)` — keeps public and admin layouts fully separated without affecting URLs
- **proxy.ts** — Next.js 16 replaces `middleware.ts` with `proxy.ts` for route protection
- **Client-side filtering** — users list uses client-side search/filter since JSONPlaceholder returns only 10 users total; posts admin loads all posts then filters locally for instant search
- **Docker pre-build approach** — builds Next.js output locally then copies standalone output into Alpine image, avoiding network issues during `npm install` inside Docker
