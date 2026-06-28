# Weather Dashboard

A responsive weather dashboard built with React and TypeScript that displays real-time weather data and a 5-day forecast for any city, with geolocation support and search history.

## Features

- Current weather conditions — temperature, humidity, wind speed and direction, weather description
- 5-day forecast grouped by day
- Geolocation-based city detection on load (falls back to London)
- City search with persistent history (last 10 searches stored in `localStorage`)
- Fully responsive layout (mobile + desktop)

## Main Target

Practice building a real-world React + TypeScript app with:
- Strict TypeScript configuration
- Clean component architecture (API layer → types ← components)
- Custom hooks, pure helper functions, and tested code
- Production-grade tooling: ESLint, Prettier, Husky, commitlint, Vitest

## Environment

| Tool | Version |
|------|---------|
| Node.js | 20+ (developed on v25) |
| npm | 10+ |

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/weekden/weather-dashboard.git
cd weather-dashboard
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and add your [OpenWeatherMap API key](https://openweathermap.org/api):

```
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

**4. Start the dev server**

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format `src/**` with Prettier |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |

## Tech Stack

- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **Vitest** + **@testing-library/react** for unit and component tests
- **ESLint** (flat config) + **Prettier** + **Husky** + **commitlint**
