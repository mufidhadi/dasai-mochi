# Dasai Mochi — Web Digital Companion & Driving Bot

A high-fidelity digital pet inspired by the legendary **Dasai Mochi Gen-3** OLED dashboard companion. Designed with **Pencil (`.pen`)**, engineered with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, and synthesized with the **Web Audio API**.

Live URL: [https://mochi.masmuf.cloud](https://mochi.masmuf.cloud)

---

## Features

- **Expressive OLED Face Matrix**:
  - Over 10 animated emotions: Idle/Blink, Joy (`^_^`), Love Heart Eyes (`<3`), Driving Focus (`>_<`), Cornering Left/Right Inertia Slant, Sudden Brake / Shocked (`!`), Dizzy Spiral (`@_@`), Sleepy, Sleeping (`zzZ`), and Cool 8-bit Sunglasses (`(⌐■_■)`).
- **CRT & OLED Display Simulation**:
  - Scanlines overlay, phosphor bloom glow, glass lens refraction reflection.
- **Interchangeable Helmets & Custom Visors**:
  - Cyber Visor (Cyberpunk Neon Yellow/Cyan HUD)
  - Carbon JDM (Track-spec lightweight aero shell)
  - Neko Ears (Kawaii Edition with glowing cat ears)
  - 90s Arcade (Synthwave translucent shell)
  - Samurai Kabuto (Golden Ronin warrior crest)
  - Bare Stealth Chassis (Original Gen-3 minimal casing)
- **Dashboard Driving Companion & Inertia Physics**:
  - Lateral G-Force inertia gauge
  - Simulated steering wheel & cornering reactions
  - Gas pedal with engine rev sounds
  - Sudden brake pedal with screech effects
- **Sensory & Audio Integration**:
  - Built-in retro 8-bit sound synthesizer using native **Web Audio API** (zero external assets needed)
  - Device orientation / Gyroscope reactivity on mobile devices
  - Capacitive petting interactions with particle effects
- **Mode Switching**:
  - Car Dash Mode vs Desk Pet Standby Mode

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Audio**: Web Audio API (realtime procedural sound synthesis)
- **Design**: Pencil MCP (`.pen` design specification v2.17 in `design/mochi-pet.pen`)
- **Testing**: Vitest + React Testing Library (20 unit tests) & Pytest with uv (5 specification tests)
- **Deployment**: Docker multi-stage build, Nginx Alpine, Traefik v2 reverse proxy with Let's Encrypt SSL

---

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Run Vitest test suite
pnpm test

# Run Pytest specification tests
uv run pytest -v

# Build for production
pnpm build
```

---

## Docker & Deployment

```bash
# Run locally with docker compose
docker compose up --build -d
```
