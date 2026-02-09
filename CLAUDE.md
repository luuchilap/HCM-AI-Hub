# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HCMC AI Hub is a community website for an AI consortium in Ho Chi Minh City. It's a React SPA with Vietnamese/English internationalization support, built with Lovable.dev.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Architecture

### Stack
- **React 18** with TypeScript
- **Vite** for build tooling (uses SWC)
- **React Router** for client-side routing
- **TanStack Query** for server state
- **shadcn/ui** components (Radix primitives + Tailwind)
- **Framer Motion** for animations
- **i18next** for i18n

### Directory Structure
```
src/
├── components/
│   ├── layout/      # Header, Footer, Layout wrapper
│   ├── sections/    # Homepage section components
│   └── ui/          # shadcn/ui primitives
├── pages/           # Route page components
├── i18n/
│   ├── locales/     # en.json, vi.json translation files
│   └── index.ts     # i18n config (defaults to Vietnamese)
├── hooks/           # Custom React hooks
└── lib/utils.ts     # cn() utility for Tailwind class merging
```

### Key Patterns

**Routing**: All routes defined in `App.tsx`. Pages wrap content in `<Layout>` component which provides Header/Footer.

**i18n**: Uses `useTranslation()` hook. Language persisted to localStorage. Add translations to both `en.json` and `vi.json`.

**Styling**:
- CSS variables for theming in `src/index.css` (light/dark mode support)
- Custom design tokens: `--gradient-hero`, `--gradient-primary`, `--shadow-glow`
- Custom fonts: Outfit (display), DM Sans (body)
- Button has custom variants: `hero`, `heroOutline`, `glow`, `accent`

**Components**: Import UI components from `@/components/ui/`. Use `cn()` from `@/lib/utils` for conditional classes.

### Path Aliases
`@/` maps to `src/` directory.
