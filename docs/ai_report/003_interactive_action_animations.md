# Laporan Akhir: Animasi Interaktif Makan, Main, & Mandi Digital Tamagotchi

## Nama Tugas
Pengembangan & Integrasi Animasi Interaktif untuk Kegiatan Makan (Food & Chewing), Main (Bouncing Ball Physics), Mandi (Soap Bubbles & Shower), dan Petting (Heart Sparkles).

---

## Histori Aksi
1. **Analisa Kebutuhan User**:
   - Memproses instruksi Mas Mufid untuk memperjelas visual kegiatan Tamagotchi saat Makan (ada makanan meluncur & mulut mengunyah), Main (ada bola membal & mata mengikuti), dan Mandi (ada busa sabun & air).

2. **Branching & Prinsip TDD**:
   - Membuat branch baru `feat/interactive-action-animations` dari `mufidhadi/dasai-mochi`.
   - Mengupdate unit test Vitest (`useTamagotchi.test.ts` dan `VirtualRobotFace.test.tsx`) untuk memverifikasi penanganan state `activeAction` (`feeding`, `playing`, `cleaning`, `petting`, `sleeping`).

3. **Pengembangan Animasi Canvas 60fps**:
   - **Makan (`feeding`)**: Item makanan 🍱 meluncur menuju mulut, animasi mengunyah ritmis (`Math.abs(Math.sin(...))`), serta efek remahan makanan yang beterbangan.
   - **Main (`playing`)**: Bola membal ⚽ dengan fisika pantulan 2D yang terus bergerak di dalam viewport, dengan pupil mata robot memandu dan mengunci pergerakan bola secara *real-time*.
   - **Mandi (`cleaning`)**: Busa sabun glowing 🧼🫧 melayang dari bawah ke atas layar dengan animasi wobble, diiringi efek guyuran air.
   - **Petting (`petting`)**: Hati glowing 💖 melayang ke atas dengan efek rona merah di pipi robot (blushing).

4. **Pengujian & Build Produksi**:
   - Menjalankan Vitest `pnpm exec vitest run` (10/10 passed).
   - Menjalankan Pytest `uv run pytest` (5/5 passed).
   - Menjalankan build produksi `pnpm build` (clean output).

5. **Commit, Push & Deployment**:
   - Commit lokal (hash `d21af81`).
   - Push ke GitHub repo `mufidhadi/dasai-mochi` pada branch `feat/interactive-action-animations`.
   - Koneksi SSH ke VPS Hostinger (`172.23.127.184`), fetch & checkout branch `feat/interactive-action-animations`, serta perbarui container dengan `docker compose down && docker compose up --build -d`.

---

## Informasi Repositori & Commit
- **Nama Repo**: `mufidhadi/dasai-mochi`
- **URL Repo**: [https://github.com/mufidhadi/dasai-mochi](https://github.com/mufidhadi/dasai-mochi)
- **Nama Branch**: `feat/interactive-action-animations`
- **Nomor Hash Commit**: `d21af81`
- **URL Live Production**: [https://mochi.masmuf.cloud](https://mochi.masmuf.cloud)

---

## Tech Stack
- React 19, TypeScript, HTML5 Canvas 2D API, Web Audio API, Vitest, Pytest (`uv`), Docker, Nginx.

---

## List Kesulitan, Tantangan, Bug dan Solusi
- *Tantangan*: Menghitung pupil tracking yang natural saat ada objek bergerak (bola membal).
- *Solusi*: Mengalihkan koordinat `targetX` dan `targetY` pupil mata dari koordinat kursor mouse ke posisi 2D bola `ballRef.current` secara otomatis saat `activeAction === 'playing'`.

---

## Lesson Learned
- Penggunaan siklus matematika trigonometri `Math.sin()` pada Canvas render loop memungkinkan penciptaan gerakan mengunyah dan wobble busa yang sangat halus tanpa memberatkan GPU/CPU.
