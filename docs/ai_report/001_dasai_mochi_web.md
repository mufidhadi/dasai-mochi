# Laporan Akhir: Pembuatan & Deployment Aplikasi Web Digital Pet Dasai Mochi

## 1. Nama Tugas
Pembuatan Aplikasi Web Digital Pet seperti Dasai Mochi (Gen-3 OLED Companion), Desain dengan Pencil MCP (`.pen`), Implementasi Frontend React + Vite + Tailwind CSS + Web Audio API, serta Deployment ke VPS dengan Docker Compose & Traefik Reverse Proxy di domain `mochi.masmuf.cloud`.

---

## 2. Histori Aksi
1. **Riset & Analisa Awal**:
   - Menelusuri spesifikasi resmi dan fitur komunitas Dasai Mochi (animasi OLED 70+ ekspresi, reaktivitas gyroscope/inertia, helm modular yang dapat diganti, efek suara retro 8-bit, mode driving companion).
   - Memeriksa integrasi Pencil MCP (`pen.dev`) via Unix Domain Socket `/Users/anb-0826014/.pencil/socket/pencil-visual_studio_code.sock`.
   - Menginspeksi konfigurasi VPS Hostinger (172.23.127.184) via SSH ZeroTier, mendeteksi reverse proxy Traefik v2 yang berjalan di network docker `web_proxy` dengan certresolver `myresolver`.
   - Memverifikasi resolusi DNS untuk domain `mochi.masmuf.cloud` mengarah ke IP publik VPS `31.97.223.48`.
2. **Inisialisasi Project**:
   - Membuat project baru di `/Users/anb-0826014/project/mufid/dasai-mochi` menggunakan Vite React TypeScript.
   - Menginisialisasi Git repository dan membuat branch fitur `feat/mochi-digital-pet` (menghindari perubahan langsung di `main`).
3. **Desain dengan Pencil MCP (`.pen`)**:
   - Membuat file desain formal Pencil (`design/mochi-pet.pen`) sesuai spesifikasi schema `.pen` v2.17.
   - Menguji dan mengeksekusi script MCP JSON-RPC terhadap server Pencil MCP untuk memverifikasi dokumen desain (frame companion screen, panel HUD, matrix ekspresi, helmet variants, token warna OLED).
4. **Pengembangan Frontend dengan Pendekatan TDD (Test Driven Development)**:
   - Menulis unit tests terlebih dahulu menggunakan **Vitest** dan **React Testing Library**:
     - `src/test/audioEngine.test.ts` (3 tests)
     - `src/test/useMochiPet.test.ts` (7 tests)
     - `src/test/OledDisplay.test.tsx` (5 tests)
     - `src/test/MochiHelmet.test.tsx` (4 tests)
     - `src/test/App.test.tsx` (1 test)
   - Mengimplementasikan komponen & modul:
     - `src/utils/audioEngine.ts`: Sintesis audio retro 8-bit menggunakan Web Audio API tanpa dependensi audio eksternal (chimes, engine rev, brake screech, purr, dizzy boing, fanfare).
     - `src/hooks/useMochiPet.ts`: State machine emosi, inersia G-force, interaksi elus/pet, orientasi gyroscope mobile.
     - `src/components/OledDisplay.tsx`: Tampilan layar OLED CRT scanlines, refleksi kaca, dan animasi ekspresi mata digital.
     - `src/components/MochiHelmet.tsx`: Casing robot modular dengan 6 variasi helm (Cyber Visor, Carbon JDM, Neko Ears, 90s Arcade, Samurai Kabuto, Bare Chassis) & LED underglow glow.
     - `src/components/DrivingControls.tsx`: HUD simulasi kemudi (steer left/right, gas pedal, brake hard, G-force meter).
     - `src/components/EmotionDeck.tsx`: Matrix ekspresi cepat & tombol elus Mochi.
     - `src/components/HelmetSelector.tsx`: Panel pemilihan helm visual interaktif.
     - `src/components/Header.tsx`: Status telemetri baterai, mood, sound toggle, dan car/desk mode switch.
5. **Pengujian Pytest dengan `uv`**:
   - Menginisialisasi virtualenv dengan `uv init` dan menginstall `pytest`.
   - Membuat suite pengujian spesifikasi dan integrasi `tests/test_mochi_app.py` (5 tests):
     - Validasi spesifikasi Pencil `.pen` schema.
     - Validasi konfigurasi Traefik labels di `docker-compose.yml`.
     - Validasi file `.env` dan `.env.example`.
     - Validasi multi-stage build `Dockerfile` dan konfigurasi Nginx SPA.
     - Validasi artifact build produksi di `dist/index.html`.
   - Menjalankan pengujian dengan `uv run pytest -v` (100% lulus).
6. **Dockerisasi & Kontainer**:
   - Membuat `nginx.conf` dengan kompresi Gzip, caching static assets, dan SPA fallback.
   - Membuat multi-stage `Dockerfile` (Node.js 22 + Nginx Alpine) dengan pinned pnpm 9.15.9.
   - Menguji build lokal `docker build` dan container run (HTTP 200 OK diverifikasi).
7. **Version Control & Remote GitHub Private Repo**:
   - Melakukan commit di branch `feat/mochi-digital-pet`.
   - Membuat repository GitHub private baru `mufidhadi/dasai-mochi` via GitHub CLI (`gh`).
   - Melakukan push branch `feat/mochi-digital-pet` dan `main` menggunakan SSH key `id_ed25519_personal`.
8. **Deployment ke VPS Hostinger via SSH**:
   - Melakukan SSH ke VPS (172.23.127.184).
   - Melakukan git clone ke `/root/project/dasai-mochi`.
   - Checkout branch `feat/mochi-digital-pet` dan menyalin `.env.example` ke `.env`.
   - Menjalankan `docker compose up -d --build`.
   - Memverifikasi status container dan router Traefik untuk `mochi.masmuf.cloud`.

---

## 3. Nomor Hash Commit & Branch
- **Nomor Hash Commit Terakhir**: `59fbbc0` (Commit rangkaian: `04d2cb3` -> `51c7342` -> `0da74de` -> `935df0d` -> `59fbbc0`)
- **Nama Branch**: `feat/mochi-digital-pet`
- **Base Branch**: `main`

---

## 4. Nama dan URL Repo
- **Nama Repo**: `mufidhadi/dasai-mochi` (Public Repo)
- **URL Repo (Web)**: `https://github.com/mufidhadi/dasai-mochi`
- **URL Remote (SSH)**: `git@github.com:mufidhadi/dasai-mochi.git`
- **Akses Live**: `https://mochi.masmuf.cloud`

---

## 5. Tech Stack
- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons, Canvas Confetti
- **Audio**: Web Audio API (Native Real-time Sound Synthesizer)
- **Design Standard**: Pencil MCP (`.pen` format v2.17)
- **Unit Testing**: Vitest, React Testing Library, JSDOM
- **Integration Testing**: Pytest 9, Python 3.12 via `uv`
- **Web Server & Container**: Nginx Alpine, Docker multi-stage build, Docker Compose
- **Reverse Proxy & TLS**: Traefik v2 dengan Let's Encrypt automated certificate resolver (`myresolver`)

---

## 6. List Kesulitan, Tantangan, Bug dan Solusi
1. **Pencil MCP Stdio Protocol Handshake**:
   - *Tantangan*: Pencil MCP server binary (`mcp-server-darwin-arm64`) memerlukan inisialisasi JSON-RPC standard (`initialize` + `notifications/initialized`) serta flag parameter `--agent claudeCodeCLI` saat berkomunikasi dengan socket domain Unix VS Code.
   - *Solusi*: Mengirim handshake lengkap sebelum memanggil `tools/call`, lalu menyusun dokumen `.pen` format v2.17 lengkap dengan tokens dan frames yang tervalidasi oleh engine Pencil MCP.
2. **TypeScript Exclude untuk Build Bundle**:
   - *Tantangan*: `tsc -b` mengikutsertakan file test di `src/test/` yang membutuhkan typing vitest dom matcher (`toBeInTheDocument`), menyebabkan build error saat bundling aplikasi utama.
   - *Solusi*: Menambahkan `"exclude": ["src/test"]` di `tsconfig.app.json` dan menggunakan `vitest/config` di `vite.config.ts`, sehingga build produksi terpisah bersih dari test runner.
3. **Pnpm Supply-Chain Policy Rejection pada Docker Build**:
   - *Tantangan*: Pada instalasi awal Dockerfile dengan `corepack prepare pnpm@latest`, pnpm v12 memblokir package yang baru dirilis kurang dari periode minimum release age.
   - *Solusi*: Mengunci versi pnpm di Dockerfile ke `pnpm@9.15.9` yang identik dengan host lokal, memastikan determinisme build 100%.
4. **Multiple DOM Element Query di App Test**:
   - *Tantangan*: Teks `DASAI MOCHI` terdapat di heading header dan teks footer, sehingga `screen.getByText` menghasilkan konflik multiple matches.
   - *Solusi*: Menggunakan query semantik `screen.getByRole('heading', { name: /DASAI MOCHI/i })`.
5. **Traefik Dual-Network Routing**:
   - *Tantangan*: Container Traefik di VPS terhubung ke dua bridge network (`web` dan `web_proxy`), menyebabkan Traefik menolak meneruskan trafik jika tidak diberi tahu network mana yang harus dipakai (`traefik cannot determine which network to use`).
   - *Solusi*: Menambahkan label `traefik.docker.network=web_proxy` pada service `dasai-mochi` di `docker-compose.yml`.
6. **Alpine Musl IPv6 Resolution pada Docker Healthcheck**:
   - *Tantangan*: Di Alpine Linux dengan musl libc, `wget -q --spider http://localhost/` otomatis me-resolve `localhost` ke IPv6 `[::1]:80`, sementara Nginx default hanya listening di IPv4 `0.0.0.0:80`. Akibatnya healthcheck gagal (exit 1), container berstatus `unhealthy`, dan Traefik otomatis mendrop routing ke container tersebut.
   - *Solusi*: Menambahkan direktif `listen [::]:80;` pada blok server di `nginx.conf` serta menargetkan healthcheck secara eksplisit ke IPv4 loopback `http://127.0.0.1/`. Container langsung berubah status menjadi `healthy` dan Traefik segera melayani routing.

---

## 7. List Test yang Dilakukan dan Hasil dari Test
### A. Unit Tests (Vitest + React Testing Library)
- **`src/test/audioEngine.test.ts`**:
  - `should allow toggling sound on and off` -> PASSED
  - `should trigger play sound methods without throwing errors` -> PASSED
  - `should not play sound if disabled` -> PASSED
- **`src/test/useMochiPet.test.ts`**:
  - `initializes with default idle state and 100% battery` -> PASSED
  - `handles petting interaction and changes emotion to happy/love` -> PASSED
  - `changes emotion manually and returns to idle after timeout` -> PASSED
  - `updates driving physics and triggers cornering emotion` -> PASSED
  - `accelerates and triggers driving speed emotion` -> PASSED
  - `brakes hard and triggers braking / surprised emotion` -> PASSED
  - `switches helmets cleanly` -> PASSED
- **`src/test/OledDisplay.test.tsx`**:
  - `renders correctly with idle emotion` -> PASSED
  - `renders happy emotion with blush cheeks` -> PASSED
  - `renders cool sunglasses when emotion is cool` -> PASSED
  - `renders sleep zzz bubbles when sleeping` -> PASSED
  - `renders speed lines when speed > 50 or driving emotion` -> PASSED
- **`src/test/MochiHelmet.test.tsx`**:
  - `renders base chassis and oled screen` -> PASSED
  - `renders cyber visor when helmet is cyber_visor` -> PASSED
  - `renders neko ears when helmet is neko_ears` -> PASSED
  - `calls onPet when clicked or tapped` -> PASSED
- **`src/test/App.test.tsx`**:
  - `renders header, mochi chassis, and control panels` -> PASSED
- **Hasil Total Vitest**: **20 passed (100%)**

### B. Specification & Architecture Tests (Pytest via `uv run pytest`)
- `test_pencil_design_specification` -> PASSED
- `test_docker_compose_traefik_configuration` -> PASSED
- `test_env_files_and_defaults` -> PASSED
- `test_nginx_and_dockerfile` -> PASSED
- `test_frontend_production_build_artifacts` -> PASSED
- **Hasil Total Pytest**: **5 passed (100%)**

### C. Container & Server Live Integration Test
- Local Docker run check (`curl -I http://localhost:8089`): `HTTP/1.1 200 OK`
- VPS Docker Container check (`docker compose ps`): `Up About a minute (healthy)`
- Traefik routing & Let's Encrypt TLS verification (`curl -iv https://mochi.masmuf.cloud`):
  - TLS Handshake: `TLSv1.3 / AEAD-CHACHA20-POLY1305-SHA256`
  - Certificate Issuer: `C=US, O=Let's Encrypt, CN=YR1`
  - Subject: `CN=mochi.masmuf.cloud`
  - Status: `SSL certificate verify ok`
  - Response: `HTTP/2 200`
  - Static bundles: `application/javascript` (241 KB) & `text/css` (53 KB) `HTTP/2 200`

---

## 8. Lesson Learned
1. **Penerapan TDD Mengurangi Risiko Regresi**: Penulisan test mendahului implementasi logika audio synthesizer dan hook inersia fisika memastikan perilaku komponen terprediksi tanpa error runtime tak terduga.
2. **Procedural Web Audio API vs Static Assets**: Memanfaatkan osilator Web Audio API untuk suara 8-bit retro menghasilkan latensi audio mendekati nol tanpa risiko missing asset file atau CORS restriction pada media audio.
3. **Kepatuhan Terhadap SOP Multi-Environment**: Selalu mengunci versi toolchain (pnpm, node, nginx) antara lingkungan lokal dan kontainer docker produksi untuk menghindari kegagalan dependensi di server.
4. **Detail Jaringan Docker & Musl Libc**: Karakteristik resolusi IPv6 pada Alpine Linux dan penentuan label network Traefik pada container multi-network harus selalu diperhitungkan saat konfigurasi reverse proxy.
