# Tour Search App

A React-based Single Page Application (SPA) for searching tour offers. Built with a focus on clean architecture, layered decomposition, and vanilla CSS for high-performance UI.

## Tech Stack

- **Core**: React 18+ (Functional components, Hooks)
- **Language**: TypeScript 5+
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (CSS Grid, Flexbox, Design Tokens)
- **API**: Mock API (integrated in `src/api/`)

## Folder Structure

The project follows a strict layered architecture:

- `src/components/`: Reusable UI components (pure rendering).
- `src/hooks/`: Business logic and orchestration.
- `src/services/`: Network layer and API wrappers.
- `src/store/`: Application state management.
- `src/types/`: Shared TypeScript interfaces and types.
- `src/utils/`: Helper functions and data formatters.
- `src/api/`: Mock API implementation.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

Production-ready files will be generated in the `dist/` directory.

---

_Developed as part of the Prompt Machine S01 Sprint._
