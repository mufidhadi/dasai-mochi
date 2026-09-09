# Laporan Akhir: Implementasi Voice AI Agent Mochi dengan Faster-Whisper, LangChain DeepSeek, & Animalese TTS

## Nama Tugas
Integrasi Voice AI Agent Mochi: Speech-to-Text (`faster-whisper`), LLM (`langchain` + `langchain_openai` DeepSeek API `deepseek-v4-flash`), dan Suara Karakter Animal Crossing (`animaleseSynth`).

---

## Histori Aksi
1. **Analisa Kebutuhan User**:
   - Memproses instruksi Mas Mufid untuk mengintegrasikan STT `faster-whisper` Bahasa Indonesia, LLM `langchain` + `langchain_openai` dengan API DeepSeek (`https://api.deepseek.com`, model `deepseek-v4-flash`), serta output suara mumbling karakter Nintendo Animal Crossing dengan teks overlay.

2. **Manajemen Dependensi Python dengan `uv`**:
   - Menggunakan `uv add` untuk menambahkan paket python `fastapi`, `uvicorn`, `faster-whisper`, `langchain`, `langchain-openai`, `python-multipart`, dan `httpx`.

3. **Branching & Prinsip TDD**:
   - Membuat branch baru `feat/voice-ai-agent-deepseek` dari `mufidhadi/dasai-mochi`.
   - Membuat unit test Pytest:
     - `tests/test_mochi_agent.py`: Memeriksa inisialisasi `MochiAgent` dengan ChatOpenAI dan DeepSeek configuration.
     - `tests/test_mochi_stt.py`: Memeriksa transkripsi audio Bahasa Indonesia dengan `faster-whisper`.
     - `tests/test_mochi_api.py`: Memeriksa endpoint FastAPI `/api/health`, `/api/chat`, dan `/api/voice-chat`.
   - Membuat unit test Vitest (`App.test.tsx`, `TamagotchiHUD.test.tsx`).

4. **Pengembangan Modul Backend & Frontend**:
   - **`src/dasai_mochi/stt.py`**: Menggunakan `WhisperModel("tiny")` untuk mengonversi audio rekaman user menjadi teks Bahasa Indonesia.
   - **`src/dasai_mochi/agent.py`**: Menggunakan `ChatOpenAI` dengan base URL `https://api.deepseek.com` dan model `deepseek-v4-flash` untuk menghasilkan balasan lucu nan ramah Mochi.
   - **`src/dasai_mochi/api.py`**: FastAPI endpoints untuk melayani `/api/voice-chat` (multipart form audio upload) dan `/api/chat`.
   - **`src/utils/animaleseSynth.ts`**: Engine suara sintetis gaya Nintendo Animal Crossing (Animalese) menggunakan Web Audio API yang mengompilasi setiap karakter teks menjadi suara mumbling lucu berfrekuensi tinggi dengan efek *typewriter*.
   - **`src/components/VoiceChatButton.tsx`**: Tombol push-to-talk yang merekam mikrofon browser (`MediaRecorder`) dan mengunggah ke backend.
   - **`src/components/SpeechOverlay.tsx`**: Floating speech bubble overlay pada layar penuh Mochi.

5. **Keamanan & Refactoring Docker**:
   - Memindahkan API Key rahasia DeepSeek ke file `.env` (gitignored) dan membaca via `os.getenv("DEEPSEEK_API_KEY")` agar tidak terdeteksi oleh GitHub Push Protection.
   - Mengubah `Dockerfile` menjadi multi-stage container berbasis `python:3.12-slim-bookworm` yang menginstal `uv`, `ffmpeg`, `nginx`, dan menyertakan `docker-entrypoint.sh` untuk menjalankan backend FastAPI (`uvicorn`) dan frontend Nginx secara simultan.
   - Mengonfigurasi `nginx.conf` untuk memproksi rute `/api/` ke `http://127.0.0.1:8000/api/`.

6. **Pengujian & Build**:
   - Menjalankan Vitest `pnpm exec vitest run` (10/10 passed).
   - Menjalankan Pytest `uv run pytest` (12/12 passed).
   - Menjalankan `pnpm build` (produksi dist berhasil dibangun).

7. **Commit, Push, & Deployment**:
   - Commit lokal (hash `ddf4534`).
   - Push branch `feat/voice-ai-agent-deepseek` ke GitHub repo `mufidhadi/dasai-mochi`.
   - SSH ke VPS Hostinger (`172.23.127.184`), checkout branch `feat/voice-ai-agent-deepseek`, git pull, dan eksekusi `docker compose down && docker compose up --build -d`.

---

## Informasi Repositori & Commit
- **Nama Repo**: `mufidhadi/dasai-mochi`
- **URL Repo**: [https://github.com/mufidhadi/dasai-mochi](https://github.com/mufidhadi/dasai-mochi)
- **Nama Branch**: `feat/voice-ai-agent-deepseek`
- **Nomor Hash Commit**: `ddf4534`
- **URL Live Production**: [https://mochi.masmuf.cloud](https://mochi.masmuf.cloud)

---

## Tech Stack
- **STT**: `faster-whisper` (WhisperModel)
- **LLM Engine**: `langchain`, `langchain-openai` (`ChatOpenAI`)
- **API Provider**: DeepSeek API (`https://api.deepseek.com`, model `deepseek-v4-flash`)
- **Backend API**: FastAPI, Uvicorn, Python 3.12 (`uv`)
- **Frontend & Audio**: React 19, TypeScript, Web Audio API (`animaleseSynth`), MediaRecorder API, Tailwind CSS v4
- **Containerization**: Docker Multi-Stage (Python + Nginx + ffmpeg + uv), Traefik v2 Proxy

---

## List Kesulitan, Tantangan, Bug dan Solusi

| No | Masalah / Bug | Deskripsi | Solusi |
|---|---|---|---|
| 1 | GitHub Push Protection Block | GitHub menolak push commit karena deteksi format API key DeepSeek hardcoded di kode. | Memindahkan API Key ke `.env` (gitignored), menggunakan placeholder di test/example, dan membaca via `os.getenv("DEEPSEEK_API_KEY")`. |
| 2 | Audio Decoding Dependency | `faster-whisper` memerlukan `ffmpeg` untuk memproses berbagai format audio webm/wav dari browser. | Mengisntal `ffmpeg` pada container Docker image backend (`apt-get install ffmpeg`). |
| 3 | Dual Service Container | Aplikasi membutuhkan Nginx untuk SPA dan Uvicorn untuk FastAPI di port 8000. | Membuat `docker-entrypoint.sh` yang mengeksekusi Uvicorn di background dan Nginx di foreground, dengan Nginx memproksi rute `/api/`. |

---

## Lesson Learned
- Penggabungan sintesis audio prosedural gaya Nintendo Animal Crossing (Animalese) di browser frontend dan LLM backend menghasilkan interaksi agen suara yang sangat unik, lucu, dan hemat bandwidth.
