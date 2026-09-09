# Virtual Robot Tamagotchi — Digital Pet

A full-screen, body-less virtual robot Tamagotchi pet. Built with **React 19**, **TypeScript**, **HTML5 Canvas**, **Tailwind CSS v4**, and synthesized audio using native **Web Audio API**.

Live URL: [https://mochi.masmuf.cloud](https://mochi.masmuf.cloud)

---

## Concept & Architecture

- **Minimalist Full-Screen Robot Face**: No body, chassis, helmet, or car dashboard. Only two expressive eyes and one mouth filling 100% of the screen.
- **Dynamic Pupil Tracking**: Robot pupils track user mouse / touch movement across the viewport.
- **Multi-Expression Facial Engine**: Supports Neutral, Happy, Hungry, Sleepy, Sleeping (with Zzz floating particles), Love (Heart eyes), Excited (Star eyes), Surprised, and Low Battery (`!`) expressions.
- **Tamagotchi Needs & Stats**: Hunger, Energy, Happiness, and Battery decay over time.
- **Interactive Care HUD**: Retractable floating controls to Feed 🍱, Play 🎮, Sleep 💤, Clean 🧼, Pet 💖, and change Neon Color Themes (Cyan, Amber, Green, Magenta, White).
- **Procedural Synthesizer**: Built-in 8-bit sound effects using Web Audio API.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Audio**: Web Audio API (procedural synthesis)
- **Testing**: Vitest + React Testing Library (11 tests) & Pytest with uv (5 tests)
- **Deployment**: Docker multi-stage build, Nginx Alpine, Traefik reverse proxy

---

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Run Vitest test suite
pnpm exec vitest run

# Run Pytest specification tests
uv run pytest -v

# Build for production
pnpm build
```

---

## Docker & Deployment

```bash
docker compose up --build -d
```
